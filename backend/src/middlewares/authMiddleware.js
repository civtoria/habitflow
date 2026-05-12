const { verifyToken } = require('../utils/auth');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const [type, token] = authHeader.split(' ');

  if (type !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Token ausente ou invalido.' });
  }

  try {
    const payload = verifyToken(token);
    req.user = {
      id: Number(payload.sub),
      login: payload.login,
      nome: payload.nome,
    };
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Token expirado ou invalido.' });
  }
}

module.exports = authMiddleware;
