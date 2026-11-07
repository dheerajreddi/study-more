const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const wrap = (fn) => (req, res) =>
  fn(req, res).catch((err) => {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  });

app.get('/api/health', (req, res) => res.json({ ok: true, storage: db.mode }));

// READ all
app.get('/api/tasks', wrap(async (req, res) => res.json(await db.list())));

// CREATE
app.post('/api/tasks', wrap(async (req, res) => {
  const title = (req.body.title || '').trim();
  if (!title) return res.status(400).json({ error: 'Title is required' });
  res.status(201).json(await db.create({ ...req.body, title }));
}));

// UPDATE
app.put('/api/tasks/:id', wrap(async (req, res) => {
  if (req.body.title !== undefined && !String(req.body.title).trim()) {
    return res.status(400).json({ error: 'Title cannot be empty' });
  }
  const task = await db.update(req.params.id, req.body);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
}));

// DELETE
app.delete('/api/tasks/:id', wrap(async (req, res) => {
  const ok = await db.remove(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Task not found' });
  res.json({ success: true });
}));

module.exports = app;
