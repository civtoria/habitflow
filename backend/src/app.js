const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const habitRoutes = require('./routes/habitRoutes');
const rankingRoutes = require('./routes/rankingRoutes');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();
const frontendRoot = path.resolve(__dirname, '../../public');

app.use(cors());
app.use(express.json());

// Servir arquivos estáticos (frontend)
app.use(express.static(frontendRoot));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'habitflow-api' });
});

app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/ranking', rankingRoutes);

// SPA Fallback - serve index.html para qualquer rota não reconhecida
app.use((req, res) => {
  res.sendFile(path.join(frontendRoot, 'index.html'));
});


app.use(errorMiddleware);

module.exports = app;
