const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Storage: MongoDB if MONGODB_URI is set, otherwise a local JSON file.
const useMongo = !!process.env.MONGODB_URI;
const SEED_FILE = path.join(__dirname, 'data', 'tasks.json');
const FILE = process.env.VERCEL ? '/tmp/tasks.json' : SEED_FILE;

let mongoCol = null;
async function col() {
  if (mongoCol) return mongoCol;
  const { MongoClient } = require('mongodb');
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  mongoCol = client.db(process.env.MONGODB_DB || 'studyplanner').collection('tasks');
  return mongoCol;
}

function readFile() {
  try {
    return JSON.parse(fs.readFileSync(FILE, 'utf8'));
  } catch (e) {
    try {
      return JSON.parse(fs.readFileSync(SEED_FILE, 'utf8'));
    } catch (e2) {
      return [];
    }
  }
}
function writeFile(items) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(items, null, 2));
}

const clean = (d) => {
  const { _id, ...rest } = d;
  return rest;
};

module.exports = {
  mode: useMongo ? 'mongodb' : 'json-file',

  async list() {
    if (useMongo) {
      const docs = await (await col()).find({}).sort({ createdAt: -1 }).toArray();
      return docs.map(clean);
    }
    return readFile().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async create(data) {
    const task = {
      id: crypto.randomUUID(),
      title: data.title,
      subject: data.subject || 'General',
      dueDate: data.dueDate || '',
      priority: data.priority || 'Medium',
      done: false,
      createdAt: new Date().toISOString(),
    };
    if (useMongo) {
      await (await col()).insertOne({ ...task });
    } else {
      const items = readFile();
      items.push(task);
      writeFile(items);
    }
    return task;
  },

  async update(id, data) {
    const allowed = ['title', 'subject', 'dueDate', 'priority', 'done'];
    const patch = {};
    for (const k of allowed) if (data[k] !== undefined) patch[k] = data[k];
    if (useMongo) {
      const r = await (await col()).findOneAndUpdate({ id }, { $set: patch }, { returnDocument: 'after' });
      const doc = r && (r.value !== undefined ? r.value : r);
      return doc ? clean(doc) : null;
    }
    const items = readFile();
    const i = items.findIndex((t) => t.id === id);
    if (i === -1) return null;
    items[i] = { ...items[i], ...patch };
    writeFile(items);
    return items[i];
  },

  async remove(id) {
    if (useMongo) {
      const r = await (await col()).deleteOne({ id });
      return r.deletedCount > 0;
    }
    const items = readFile();
    const next = items.filter((t) => t.id !== id);
    if (next.length === items.length) return false;
    writeFile(next);
    return true;
  },
};
