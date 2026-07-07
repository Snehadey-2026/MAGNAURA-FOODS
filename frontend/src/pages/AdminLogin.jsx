import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { api } from '../lib/api';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    setError('');
    try {
      const result = await api.login(form);
      localStorage.setItem('magnaura_token', result.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="admin-login">
      <form className="lead-form admin-card" onSubmit={submit}>
        <span className="eyebrow">Secure Admin</span>
        <h1>MAGNAURA FOODS Dashboard</h1>
        <input type="email" required placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" required placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="gold-button" type="submit">
          Sign In <ArrowRight size={18} />
        </button>
        {error && <p className="form-status">{error}</p>}
      </form>
    </main>
  );
}
