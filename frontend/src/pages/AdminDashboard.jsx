import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Download, Plus, Trash2 } from 'lucide-react';
import { api } from '../lib/api';

const resources = [
  ['Hero Slides', 'hero'],
  ['Brands', 'brands'],
  ['Menu Items', 'menu'],
  ['Franchise Applications', 'franchise'],
  ['Contact Messages', 'contact'],
];

export default function AdminDashboard() {
  const token = localStorage.getItem('magnaura_token');
  const [summary, setSummary] = useState(null);
  const [active, setActive] = useState('hero');
  const [draft, setDraft] = useState({});

  useEffect(() => {
    if (token) api.adminSummary().then(setSummary).catch(() => setSummary({}));
  }, [token]);

  if (!token) return <Navigate to="/admin" replace />;

  const current = summary?.[active] || [];

  async function createItem(event) {
    event.preventDefault();
    const created = await api.createResource(active, draft);
    setSummary((state) => ({ ...state, [active]: [created, ...(state?.[active] || [])] }));
    setDraft({});
  }

  async function removeItem(id) {
    await api.deleteResource(active, id);
    setSummary((state) => ({ ...state, [active]: state[active].filter((item) => item._id !== id) }));
  }

  function exportApplications() {
    const rows = current.map((item) => Object.values(item).join(',')).join('\n');
    const blob = new Blob([rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${active}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="admin-dashboard">
      <aside>
        <strong>MAGNAURA ADMIN</strong>
        {resources.map(([label, key]) => (
          <button className={active === key ? 'active' : ''} key={key} onClick={() => setActive(key)}>
            {label}
          </button>
        ))}
      </aside>
      <section>
        <div className="admin-topbar">
          <div>
            <span className="eyebrow">Dashboard</span>
            <h1>{resources.find((item) => item[1] === active)?.[0]}</h1>
          </div>
          {(active === 'franchise' || active === 'contact') && (
            <button className="icon-text" onClick={exportApplications}>
              <Download size={16} /> Export
            </button>
          )}
        </div>

        {!['franchise', 'contact'].includes(active) && (
          <form className="admin-form" onSubmit={createItem}>
            <input placeholder="Title / Name" value={draft.title || draft.name || ''} onChange={(e) => setDraft({ ...draft, title: e.target.value, name: e.target.value })} />
            <input placeholder="Media / Image URL" value={draft.mediaUrl || draft.heroImage || draft.imageUrl || ''} onChange={(e) => setDraft({ ...draft, mediaUrl: e.target.value, heroImage: e.target.value, imageUrl: e.target.value })} />
            <input placeholder="Description / Subtitle" value={draft.description || draft.subtitle || ''} onChange={(e) => setDraft({ ...draft, description: e.target.value, subtitle: e.target.value })} />
            <button className="gold-button" type="submit">
              <Plus size={16} /> Add
            </button>
          </form>
        )}

        <div className="admin-table">
          {current.map((item) => (
            <article key={item._id}>
              <div>
                <strong>{item.title || item.name || item.fullName || item.email}</strong>
                <p>{item.description || item.subtitle || item.message || item.category}</p>
              </div>
              <button className="icon-button" onClick={() => removeItem(item._id)} aria-label="Delete">
                <Trash2 size={17} />
              </button>
            </article>
          ))}
          {!current.length && <p>No records yet.</p>}
        </div>
      </section>
    </main>
  );
}
