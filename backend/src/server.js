const app = require('./app');
const env = require('./config/env');
const { pool } = require('./config/db');

async function startServer() {
  try {
    await pool.query('SELECT 1');
    console.log('Conexao MySQL estabelecida com sucesso.');

    app.listen(env.port, () => {
      console.log(`HabitFlow API rodando em http://localhost:${env.port}`);
    });
  } catch (err) {
    console.error('Falha ao conectar no MySQL:', err.message);
    process.exit(1);
  }
}

startServer();
