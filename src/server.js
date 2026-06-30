const express = require('express');
const cors = require('cors');
require('dotenv').config();
const jobsRouter = require('./routes');

const app = express();

// CORS - required to connect GitHub Pages to Render
app.use(cors());

// Middleware
app.use(express.json());

// Health check
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

// Use /jobs URL
app.use('/jobs', jobsRouter);

app.use((req, res) => res.status(404).json({ error: 'Route not found.' }));

app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'JSON in request body is not formed correctly.' });
  }
  console.error(err);
  return res.status(500).json({ error: 'Internal server error.' });
});

// Render sets its own port in process.env.PORT
// Run on render or locally
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Job Tracker API listening on port ${PORT}`));

module.exports = app;