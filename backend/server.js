// ─────────────────────────────────────────────────────────────────
//  Brain Visualizer – Express API Server
// ─────────────────────────────────────────────────────────────────
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const emotionRoutes = require('./routes/emotionRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json());

// ── Health-check route ────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Brain Visualizer API is running 🧠', timestamp: new Date() });
});

// ── Feature routes ────────────────────────────────────────────────
app.use('/api', emotionRoutes);

// ── 404 catch-all ─────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

// ── Global error handler ──────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error.' });
});

// ── Start server ──────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀  Brain Visualizer API listening on http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health\n`);
});

