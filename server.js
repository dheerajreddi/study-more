const path = require('path');
const fs = require('fs');
const express = require('express');
const app = require('./app');

// Serve the built React app when running locally (npm start)
const dist = path.join(__dirname, 'client', 'dist');
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get(/^\/(?!api).*/, (req, res) => res.sendFile(path.join(dist, 'index.html')));
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Study Planner running at http://localhost:${PORT}`));
