const { query } = require('../config/db');
const { hashPassword, comparePassword, signToken } = require('../utils/auth');

function sanitizeUser(user) {
  return {
    id: user.id,
    nome: user.nome_completo,
    email: user.email,
    login: user.login,
  };
}

async function register(req, res, next) {
  try {
    const { nome, email, login, senha } = req.body;

    if (!nome || !email || !login || !senha) {
      return res.status(400).json({ message: 'Preencha nome, email, login e senha.' });
    }

    const emailNorm = String(email).trim().toLowerCase();
    const loginNorm = String(login).trim().toLowerCase();

    const existent = await query(
      'SELECT id FROM usuarios WHERE email = ? OR login = ? LIMIT 1',
      [emailNorm, loginNorm]
    );

    if (existent.length > 0) {
      return res.status(409).json({ message: 'Email ou login ja cadastrado.' });
    }

    const senhaHash = await hashPassword(String(senha));

    const result = await query(
      'INSERT INTO usuarios (nome_completo, email, login, senha_hash) VALUES (?, ?, ?, ?)',
      [String(nome).trim(), emailNorm, loginNorm, senhaHash]
    );

    const users = await query(
      'SELECT id, nome_completo, email, login FROM usuarios WHERE id = ? LIMIT 1',
      [result.insertId]
    );

    const user = users[0];
    const token = signToken(user);

    return res.status(201).json({
      message: 'Conta criada com sucesso.',
      token,
      user: sanitizeUser(user),
    });
  } catch (err) {
    return next(err);
  }
}

async function login(req, res, next) {
  try {
    const { login, senha } = req.body;

    if (!login || !senha) {
      return res.status(400).json({ message: 'Informe login/email e senha.' });
    }

    const loginNorm = String(login).trim().toLowerCase();

    const users = await query(
      'SELECT id, nome_completo, email, login, senha_hash FROM usuarios WHERE login = ? OR email = ? LIMIT 1',
      [loginNorm, loginNorm]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'Credenciais invalidas.' });
    }

    const user = users[0];
    const valid = await comparePassword(String(senha), user.senha_hash);

    if (!valid) {
      return res.status(401).json({ message: 'Credenciais invalidas.' });
    }

    const token = signToken(user);

    return res.json({
      message: 'Login realizado com sucesso.',
      token,
      user: sanitizeUser(user),
    });
  } catch (err) {
    return next(err);
  }
}

async function me(req, res, next) {
  try {
    const users = await query(
      'SELECT id, nome_completo, email, login FROM usuarios WHERE id = ? LIMIT 1',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'Usuario nao encontrado.' });
    }

    return res.json({ user: sanitizeUser(users[0]) });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  register,
  login,
  me,
};
