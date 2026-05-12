const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../config/env');

async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

function signToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      login: user.login,
      nome: user.nome_completo,
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );
}

function verifyToken(token) {
  return jwt.verify(token, env.jwtSecret);
}

module.exports = {
  hashPassword,
  comparePassword,
  signToken,
  verifyToken,
};
