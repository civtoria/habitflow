const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

module.exports = {
  port: Number(process.env.PORT || 3000),
  jwtSecret: process.env.JWT_SECRET || 'habitflow_dev_secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'habitflow',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  },
};
