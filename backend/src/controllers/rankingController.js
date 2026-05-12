const { query } = require('../config/db');

function initialsFromName(name) {
  return String(name || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || '')
    .join('');
}

async function monthlyRanking(req, res, next) {
  try {
    const month = String(req.query.month || '').trim();
    const referenceMonth = /^\d{4}-\d{2}$/.test(month)
      ? month
      : new Date().toISOString().slice(0, 7);

    const rows = await query(
      `SELECT
         u.id AS usuario_id,
         u.nome_completo,
         COALESCE(SUM(CASE WHEN c.concluido = 1 THEN c.pontos ELSE 0 END), 0) AS pontos
       FROM usuarios u
       LEFT JOIN habito_checkins c
         ON c.usuario_id = u.id
        AND DATE_FORMAT(c.data_ref, '%Y-%m') = ?
       GROUP BY u.id, u.nome_completo
       ORDER BY pontos DESC, u.nome_completo ASC
       LIMIT 20`,
      [referenceMonth]
    );

    const ranking = rows.map((item, index) => ({
      posicao: index + 1,
      usuarioId: item.usuario_id,
      nome: item.nome_completo,
      iniciais: initialsFromName(item.nome_completo),
      pontos: Number(item.pontos || 0),
      isMe: Number(item.usuario_id) === req.user.id,
    }));

    return res.json({ month: referenceMonth, ranking });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  monthlyRanking,
};
