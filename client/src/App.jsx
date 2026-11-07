import React, { useEffect, useState } from 'react';

const API = '/api/tasks';
const empty = { title: '', subject: '', dueDate: '', priority: 'Medium' };

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error();
      setTasks(await res.json());
      setError('');
    } catch {
      setError('Could not reach the server.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(e) {
    e.preventDefault();
    if (!form.title.trim()) return setError('Please enter a title.');
    const res = await fetch(editingId ? `${API}/${editingId}` : API, {
      method: editingId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (!res.ok) return setError('Could not save the task.');
    setForm(empty);
    setEditingId(null);
    setError('');
    load();
  }

  async function toggle(t) {
    await fetch(`${API}/${t.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done: !t.done }),
    });
    load();
  }

  async function remove(id) {
    if (!window.confirm('Delete this task?')) return;
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    if (editingId === id) {
      setEditingId(null);
      setForm(empty);
    }
    load();
  }

  function edit(t) {
    setEditingId(t.id);
    setForm({ title: t.title, subject: t.subject, dueDate: t.dueDate, priority: t.priority });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const shown = tasks.filter((t) => (filter === 'all' ? true : filter === 'done' ? t.done : !t.done));
  const doneCount = tasks.filter((t) => t.done).length;

  return (
    <div className="container">
      <header>
        <h1>📚 Study Planner</h1>
        <p>Plan your assignments and exams. {doneCount}/{tasks.length} completed.</p>
      </header>

      <form className="card form" onSubmit={submit}>
        <h2>{editingId ? 'Edit Task' : 'Add Task'}</h2>
        <input
          placeholder="Task title *"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <div className="row">
          <input
            placeholder="Subject"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
          />
          <input
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          />
          <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>
        <div className="row">
          <button type="submit" className="primary">{editingId ? 'Update' : 'Add'}</button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setForm(empty); }}>Cancel</button>
          )}
        </div>
        {error && <p className="error">{error}</p>}
      </form>

      <div className="filters">
        {['all', 'pending', 'done'].map((f) => (
          <button key={f} className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>
            {f[0].toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="muted">Loading…</p>
      ) : shown.length === 0 ? (
        <p className="muted">No tasks here yet.</p>
      ) : (
        <ul className="list">
          {shown.map((t) => (
            <li key={t.id} className={`card task ${t.done ? 'done' : ''}`}>
              <input type="checkbox" checked={t.done} onChange={() => toggle(t)} aria-label="Mark done" />
              <div className="info">
                <strong>{t.title}</strong>
                <span className="meta">
                  {t.subject}{t.dueDate ? ` • Due ${t.dueDate}` : ''}
                  <em className={`badge ${t.priority.toLowerCase()}`}>{t.priority}</em>
                </span>
              </div>
              <div className="actions">
                <button onClick={() => edit(t)}>Edit</button>
                <button className="danger" onClick={() => remove(t.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <footer>Built by R. Dheeraj Kumar (2024070093)</footer>
    </div>
  );
}
