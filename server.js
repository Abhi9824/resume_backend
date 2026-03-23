require('dotenv').config();
const express = require('express');
const cors = require('cors');
const analyzeRoutes = require('./routes/analyze');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));
app.use(express.json());

app.use('/api', analyzeRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'AI Resume Analyzer API is running' });
});

// Start server for local and non-serverless production (like Render)
const listener = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


module.exports = app;
