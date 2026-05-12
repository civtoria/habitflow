const { query } = require('../config/db');

const FREQ_ALLOWED = new Set(['Diario', 'Semanal', 'Mensal']);

function getQueryDate(req) {
  const date = String(req.query.date || '').trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }
  return new Date().toISOString().slice(0, 10);
}

function normalizeFreq(value) {
  const input = String(value || '').trim().toLowerCase();
  if (input === 'diario' || input === 'diário') return 'Diario';
  if (input === 'semanal') return 'Semanal';
  if (input === 'mensal') return 'Mensal';
  return null;
}

function mapHabitRow(row) {
  return {
    id: row.id,
    nome: row.nome,
    categoria: row.categoria,
    frequencia: row.frequencia,
    done: Boolean(row.done),
    pontos: Number(row.pontos || 0),
  };
}

async function ensureHabitOwner(habitId, userId) {
  const rows = await query(
    'SELECT id FROM habitos WHERE id = ? AND usuario_id = ? AND ativo = 1 LIMIT 1',
    [habitId, userId]
  );
  return rows.length > 0;
}

async function listHabits(req, res, next) {
  try {
    const date = getQueryDate(req);
    const rows = await query(
      `SELECT
         h.id,
         h.nome,
         h.categoria,
         h.frequencia,
         COALESCE(c.concluido, 0) AS done,
         COALESCE(c.pontos, 0) AS pontos
       FROM habitos h
       LEFT JOIN habito_checkins c
         ON c.habito_id = h.id
        AND c.usuario_id = h.usuario_id
        AND c.data_ref = ?
       WHERE h.usuario_id = ?
         AND h.ativo = 1
       ORDER BY h.criado_em DESC`,
      [date, req.user.id]
    );

    return res.json({ habits: rows.map(mapHabitRow) });
  } catch (err) {
    return next(err);
  }
}

async function createHabit(req, res, next) {
  try {
    const { nome, categoria, frequencia } = req.body;
    const freqNorm = normalizeFreq(frequencia);

    if (!nome || !categoria || !freqNorm || !FREQ_ALLOWED.has(freqNorm)) {
      return res.status(400).json({ message: 'Informe nome, categoria e frequencia validos.' });
    }

    const result = await query(
      'INSERT INTO habitos (usuario_id, nome, categoria, frequencia) VALUES (?, ?, ?, ?)',
      [req.user.id, String(nome).trim(), String(categoria).trim(), freqNorm]
    );

    const rows = await query(
      `SELECT id, nome, categoria, frequencia, 0 AS done, 0 AS pontos
       FROM habitos
       WHERE id = ? LIMIT 1`,
      [result.insertId]
    );

    return res.status(201).json({ habit: mapHabitRow(rows[0]) });
  } catch (err) {
    return next(err);
  }
}

async function updateHabit(req, res, next) {
  try {
    const habitId = Number(req.params.id);
    const { nome, categoria, frequencia } = req.body;
    const freqNorm = normalizeFreq(frequencia);

    if (!habitId || !nome || !categoria || !freqNorm || !FREQ_ALLOWED.has(freqNorm)) {
      return res.status(400).json({ message: 'Dados invalidos para atualizar o habito.' });
    }

    const owner = await ensureHabitOwner(habitId, req.user.id);
    if (!owner) {
      return res.status(404).json({ message: 'Habito nao encontrado.' });
    }

    await query(
      'UPDATE habitos SET nome = ?, categoria = ?, frequencia = ? WHERE id = ? AND usuario_id = ?',
      [String(nome).trim(), String(categoria).trim(), freqNorm, habitId, req.user.id]
    );

    const date = getQueryDate(req);
    const rows = await query(
      `SELECT
         h.id,
         h.nome,
         h.categoria,
         h.frequencia,
         COALESCE(c.concluido, 0) AS done,
         COALESCE(c.pontos, 0) AS pontos
       FROM habitos h
       LEFT JOIN habito_checkins c
         ON c.habito_id = h.id
        AND c.usuario_id = h.usuario_id
        AND c.data_ref = ?
       WHERE h.id = ?
       LIMIT 1`,
      [date, habitId]
    );

    return res.json({ habit: mapHabitRow(rows[0]) });
  } catch (err) {
    return next(err);
  }
}

async function deleteHabit(req, res, next) {
  try {
    const habitId = Number(req.params.id);
    if (!habitId) {
      return res.status(400).json({ message: 'Habito invalido.' });
    }

    const owner = await ensureHabitOwner(habitId, req.user.id);
    if (!owner) {
      return res.status(404).json({ message: 'Habito nao encontrado.' });
    }

    await query(
      'UPDATE habitos SET ativo = 0 WHERE id = ? AND usuario_id = ?',
      [habitId, req.user.id]
    );

    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

async function toggleHabitToday(req, res, next) {
  try {
    const habitId = Number(req.params.id);
    if (!habitId) {
      return res.status(400).json({ message: 'Habito invalido.' });
    }

    const owner = await ensureHabitOwner(habitId, req.user.id);
    if (!owner) {
      return res.status(404).json({ message: 'Habito nao encontrado.' });
    }

    const date = getQueryDate(req);
    await query(
      `INSERT INTO habito_checkins (habito_id, usuario_id, data_ref, concluido, pontos)
       VALUES (?, ?, ?, 1, 50)
       ON DUPLICATE KEY UPDATE
         concluido = IF(concluido = 1, 0, 1),
         pontos = IF(concluido = 1, 0, 50)`,
      [habitId, req.user.id, date]
    );

    const rows = await query(
      `SELECT
         COALESCE(concluido, 0) AS done,
         COALESCE(pontos, 0) AS pontos
       FROM habito_checkins
       WHERE habito_id = ?
         AND usuario_id = ?
         AND data_ref = ?
       LIMIT 1`,
      [habitId, req.user.id, date]
    );

    const current = rows[0] || { done: 0, pontos: 0 };

    return res.json({
      done: Boolean(current.done),
      pontos: Number(current.pontos || 0),
    });
  } catch (err) {
    return next(err);
  }
}

async function dashboardStats(req, res, next) {
  try {
    const date = getQueryDate(req);
    const statsRows = await query(
      `SELECT
         (SELECT COUNT(*)
            FROM habitos h
           WHERE h.usuario_id = ?
             AND h.ativo = 1) AS total_habitos,
         (SELECT COUNT(*)
            FROM habito_checkins c
            JOIN habitos h ON h.id = c.habito_id
           WHERE c.usuario_id = ?
             AND c.data_ref = ?
             AND c.concluido = 1
             AND h.ativo = 1) AS concluidos_hoje`,
      [req.user.id, req.user.id, date]
    );

    return res.json({
      totalHabitos: Number(statsRows[0]?.total_habitos || 0),
      concluidosHoje: Number(statsRows[0]?.concluidos_hoje || 0),
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  toggleHabitToday,
  dashboardStats,
};
