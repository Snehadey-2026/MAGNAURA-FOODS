"""
MAGNAURA FOODS - Backend Proxy Wrapper
Spawns the Node.js Express backend as a subprocess and exposes a FastAPI proxy on
port 8001 (as expected by platform supervisor). All /api requests are transparently
forwarded to the Node backend on port 5000.
"""
import asyncio
import atexit
import os
import signal
import subprocess
from contextlib import asynccontextmanager

import httpx
from fastapi import FastAPI, Request, Response
from fastapi.responses import JSONResponse

NODE_PORT = int(os.environ.get("PORT", "5000"))
NODE_URL = f"http://127.0.0.1:{NODE_PORT}"
node_process: subprocess.Popen | None = None


def start_node_backend():
    """Boot the existing Node.js Express server as a background subprocess."""
    global node_process
    env = os.environ.copy()
    env["PORT"] = str(NODE_PORT)
    node_process = subprocess.Popen(
        ["node", "index.js"],
        cwd="/app/backend",
        env=env,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        preexec_fn=os.setsid,
    )


def stop_node_backend():
    global node_process
    if node_process and node_process.poll() is None:
        try:
            os.killpg(os.getpgid(node_process.pid), signal.SIGTERM)
        except ProcessLookupError:
            pass
        node_process = None


atexit.register(stop_node_backend)


@asynccontextmanager
async def lifespan(app: FastAPI):
    start_node_backend()
    # Give Node backend a moment to bind the port
    for _ in range(30):
        try:
            async with httpx.AsyncClient(timeout=1.0) as client:
                r = await client.get(f"{NODE_URL}/api/health")
                if r.status_code == 200:
                    break
        except Exception:
            await asyncio.sleep(0.5)
    yield
    stop_node_backend()


app = FastAPI(lifespan=lifespan)


@app.get("/api/health")
async def health():
    return {"ok": True, "service": "MAGNAURA FOODS API (proxy)"}


@app.api_route("/api/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"])
async def proxy(path: str, request: Request):
    url = f"{NODE_URL}/api/{path}"
    query = request.url.query
    if query:
        url = f"{url}?{query}"
    body = await request.body()
    headers = {k: v for k, v in request.headers.items() if k.lower() not in {"host", "content-length"}}
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            upstream = await client.request(
                request.method,
                url,
                content=body,
                headers=headers,
            )
    except httpx.ConnectError:
        return JSONResponse({"message": "Backend service unavailable"}, status_code=503)
    except Exception as exc:
        return JSONResponse({"message": f"Proxy error: {exc}"}, status_code=502)

    excluded = {"content-encoding", "transfer-encoding", "connection", "content-length"}
    resp_headers = {k: v for k, v in upstream.headers.items() if k.lower() not in excluded}
    return Response(content=upstream.content, status_code=upstream.status_code, headers=resp_headers)
