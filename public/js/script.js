const API_BASE = window.HABITFLOW_API_BASE || 'http://localhost:3000/api';
const TOKEN_KEY = 'hf_token';
const USER_KEY = 'hf_user';
const THEME_KEY = 'hf_theme';
const DAY_OFFSET_KEY = 'hf_day_offset';

// Sistema de gerenciamento de data para testes/demonstração
function getTodayDate() {
  const today = new Date();
  const offset = parseInt(localStorage.getItem(DAY_OFFSET_KEY) || '0', 10);
  today.setDate(today.getDate() + offset);
  return today;
}

function setDayOffset(days) {
  localStorage.setItem(DAY_OFFSET_KEY, String(days));
  const realDate = new Date();
  const simDate = getTodayDate();
  console.log(`📅 Data simulada para: ${simDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`);
  console.log(`   Offset: +${days} dia(s) | Real: ${realDate.toLocaleDateString('pt-BR')}`);
  console.log(`   ⚠️ Recarregue a página para aplicar as mudanças (F5 ou Ctrl+R)`);
}

function resetDayOffset() {
  localStorage.removeItem(DAY_OFFSET_KEY);
  console.log('📅 Data resetada para hoje.');
  console.log(`   ⚠️ Recarregue a página para aplicar as mudanças (F5 ou Ctrl+R)`);
}

function getDateStatus() {
  const offset = parseInt(localStorage.getItem(DAY_OFFSET_KEY) || '0', 10);
  const today = getTodayDate();
  console.log(`
╔════════════════════════════════════════╗
║     STATUS DE SIMULAÇÃO DE DATA       ║
╠════════════════════════════════════════╣
║ Data Simulada: ${today.toLocaleDateString('pt-BR')}         
║ Offset: ${offset >= 0 ? '+' : ''}${offset} dia(s)                         
║ Data Real: ${new Date().toLocaleDateString('pt-BR')}           
╠════════════════════════════════════════╣
║ Comandos:                              ║
║  • setDayOffset(1)   - próximo dia     ║
║  • setDayOffset(3)   - 3 dias depois   ║
║  • resetDayOffset()  - volta hoje      ║
║  • getDateStatus()   - mostra isso     ║
╚════════════════════════════════════════╝
  `);
}

// Exponha funções para console para fácil teste
window.setDayOffset = setDayOffset;
window.getTodayDate = getTodayDate;
window.resetDayOffset = resetDayOffset;
window.getDateStatus = getDateStatus;

const CAT_EMOJI = {
  'Saúde': '💧',
  Educação: '📚',
  Esporte: '🏃',
  'Finanças': '💰',
  'Bem-estar': '🧘',
  Alimentação: '🥗',
  Social: '🤝',
  Criatividade: '🎨',
};

const CAT_COLOR = {
  'Saúde': '#EAF3DE',
  Educação: '#E6F1FB',
  Esporte: '#FAEEDA',
  'Finanças': '#EAF3DE',
  'Bem-estar': '#EEEDFE',
  Alimentação: '#EAF3DE',
  Social: '#FBEAF0',
  Criatividade: '#FAECE7',
};

let habits = [];
let lastLoadedDate = null;  // Rastreia qual data foi carregada
let editId = null;
let deleteId = null;
let filterCat = 'Todos';
let filterCatLista = 'Todos';

// Retorna a data simulada formatada como YYYY-MM-DD
function getSimulatedDateString() {
  const today = getTodayDate();
  return today.toISOString().split('T')[0];  // Formato: 2026-05-12
}

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user || {}));
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function showInlineMessage(text, ok = false) {
  const msg = document.getElementById('msg');
  if (!msg) return;
  msg.style.display = 'block';
  msg.style.color = ok ? '#2176ae' : '#c0392b';
  msg.textContent = text;
}

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (options.auth !== false && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  let data = null;
  try {
    data = await response.json();
  } catch (_err) {
    data = null;
  }

  if (!response.ok) {
    const message = data?.message || 'Erro ao processar a requisição.';
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return data;
}

function toApiFreq(freq) {
  if (freq === 'Diário') return 'Diario';
  return freq;
}

function toUiFreq(freq) {
  if (freq === 'Diario') return 'Diário';
  return freq;
}

function initials(name) {
  return String(name || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || '')
    .join('');
}

async function registrar() {
  const nome = document.getElementById('nome')?.value.trim();
  const email = document.getElementById('email')?.value.trim();
  const login = document.getElementById('login')?.value.trim();
  const senha = document.getElementById('senha')?.value;
  const confirma = document.getElementById('confirma')?.value;

  if (!nome || !email || !login || !senha || !confirma) {
    showInlineMessage('Preencha todos os campos!');
    return;
  }

  if (senha !== confirma) {
    showInlineMessage('As senhas não coincidem!');
    return;
  }

  try {
    const result = await apiFetch('/auth/register', {
      method: 'POST',
      auth: false,
      body: { nome, email, login, senha },
    });
    setSession(result.token, result.user);
    showInlineMessage('Conta criada com sucesso! Redirecionando...', true);
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 900);
  } catch (err) {
    showInlineMessage(err.message);
  }
}

async function loginUsuario() {
  const login = document.getElementById('login-usuario')?.value.trim();
  const senha = document.getElementById('login-senha')?.value;

  if (!login || !senha) {
    showInlineMessage('Informe login e senha.');
    return;
  }

  try {
    const result = await apiFetch('/auth/login', {
      method: 'POST',
      auth: false,
      body: { login, senha },
    });
    setSession(result.token, result.user);
    showInlineMessage('Login realizado com sucesso! Redirecionando...', true);
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 700);
  } catch (err) {
    showInlineMessage(err.message);
  }
}

async function loadHabits() {
  const simulatedDate = getSimulatedDateString();
  
  // Recarrega se a data mudou
  if (lastLoadedDate && lastLoadedDate !== simulatedDate) {
    console.log(`📅 Data mudou de ${lastLoadedDate} para ${simulatedDate}. Recarregando hábitos...`);
  }
  
  const result = await apiFetch(`/habits?date=${simulatedDate}`);
  lastLoadedDate = simulatedDate;
  
  habits = (result.habits || []).map((h) => ({
    id: h.id,
    nome: h.nome,
    cat: h.categoria,
    freq: toUiFreq(h.frequencia),
    done: Boolean(h.done),
    pts: Number(h.pontos || 0),
  }));
}

function goTo(id) {
  document.querySelectorAll('.screen').forEach((s) => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach((b) => b.classList.remove('active'));

  if (id === 'screen-dashboard') {
    void renderDash();
  }
  if (id === 'screen-lista') {
    renderLista();
  }
  if (id === 'screen-ranking') {
    void renderRanking();
  }
  if (id === 'screen-criar' && !editId) {
    resetForm();
  }
}

async function renderDash() {
  const today = getTodayDate();
  document.getElementById('dash-date').textContent = today.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  try {
    const date = getSimulatedDateString();
    const stats = await apiFetch(`/habits/stats?date=${date}`);
    document.getElementById('stat-total').textContent = stats.totalHabitos;
    document.getElementById('stat-done').textContent = stats.concluidosHoje;
  } catch (_err) {
    document.getElementById('stat-total').textContent = habits.length;
    document.getElementById('stat-done').textContent = habits.filter((h) => h.done).length;
  }

  buildFilters('filter-row', filterCat, setFilter);
  const list = document.getElementById('habits-list');
  const filtered = filterCat === 'Todos' ? habits : habits.filter((h) => h.cat === filterCat);

  if (!filtered.length) {
    list.innerHTML = `<div class="empty-state"><div class="empty-icon">📋</div><p>Nenhum hábito ${filterCat !== 'Todos' ? 'nessa categoria' : ''} ainda.<br>Adicione seu primeiro hábito!</p></div>`;
    return;
  }

  list.innerHTML = filtered.map((h) => habitCardHTML(h, true)).join('');
}

function renderLista() {
  const filtered = filterCatLista === 'Todos' ? habits : habits.filter((h) => h.cat === filterCatLista);
  document.getElementById('lista-count').textContent =
    filtered.length +
    ' hábito' +
    (filtered.length !== 1 ? 's' : '') +
    ' cadastrado' +
    (filtered.length !== 1 ? 's' : '');

  buildFilters('filter-row-lista', filterCatLista, setFilterLista);
  const list = document.getElementById('lista-list');

  if (!filtered.length) {
    list.innerHTML = `<div class="empty-state"><div class="empty-icon">📋</div><p>Nenhum hábito aqui.</p></div>`;
    return;
  }

  list.innerHTML = filtered.map((h) => habitCardHTML(h, false)).join('');
}

function habitCardHTML(h, showCheck) {
  const emoji = CAT_EMOJI[h.cat] || '⭐';
  const color = CAT_COLOR[h.cat] || '#F4F4F2';
  const badgeClass = h.done ? 'badge-done' : 'badge-pending';
  const badgeTxt = h.done ? '✓ Feito' : 'Pendente';

  return `<div class="habit-card">
    <div class="habit-icon" style="background:${color}">${emoji}</div>
    <div class="habit-info">
      <div class="habit-name">${h.nome}</div>
      <div class="habit-meta">${h.cat} · ${h.freq}</div>
      <div class="habit-actions">
        <button class="btn-sm" onclick="editarHabito(${h.id})">✏️ Editar</button>
        <button class="btn-sm danger" onclick="pedirExcluir(${h.id})">🗑 Excluir</button>
        ${
          showCheck
            ? `<button class="btn-sm" onclick="toggleDone(${h.id})" style="${
                h.done ? 'background:#EAF3DE;color:#27500A;border-color:#97C459' : ''
              }">${h.done ? '↩ Desfazer' : '✓ Concluir'}</button>`
            : ''
        }
      </div>
    </div>
    <span class="badge ${badgeClass}">${badgeTxt}</span>
  </div>`;
}

function buildFilters(rowId, activecat, fn) {
  const cats = [...new Set(habits.map((h) => h.cat))];
  const row = document.getElementById(rowId);
  row.innerHTML =
    `<div class="filter-pill ${activecat === 'Todos' ? 'active' : ''}" data-cat="Todos" onclick="(${fn.name})(this)">Todos</div>` +
    cats
      .map(
        (c) =>
          `<div class="filter-pill ${activecat === c ? 'active' : ''}" data-cat="${c}" onclick="(${fn.name})(this)">${CAT_EMOJI[c] || ''} ${c}</div>`
      )
      .join('');
}

function setFilter(el) {
  filterCat = el.dataset.cat;
  void renderDash();
}

function setFilterLista(el) {
  filterCatLista = el.dataset.cat;
  renderLista();
}

async function toggleDone(id) {
  try {
    const date = getSimulatedDateString();
    await apiFetch(`/habits/${id}/toggle?date=${date}`, { method: 'POST' });
    await loadHabits();
    await renderDash();
    renderLista();
  } catch (err) {
    showToast(err.message);
  }
}

function resetForm() {
  editId = null;
  document.getElementById('form-title').textContent = 'Criar hábito';
  document.getElementById('input-nome').value = '';
  document.getElementById('input-cat').value = '';
  document.getElementById('input-freq').value = '';
}

async function salvarHabito() {
  const nome = document.getElementById('input-nome').value.trim();
  const cat = document.getElementById('input-cat').value;
  const freq = document.getElementById('input-freq').value;

  if (!nome || !cat || !freq) {
    showToast('⚠️ Preencha todos os campos!');
    return;
  }

  try {
    const payload = {
      nome,
      categoria: cat,
      frequencia: toApiFreq(freq),
    };

    if (editId) {
      await apiFetch(`/habits/${editId}`, {
        method: 'PUT',
        body: payload,
      });
      showToast('✓ Hábito atualizado!');
    } else {
      await apiFetch('/habits', {
        method: 'POST',
        body: payload,
      });
      showToast('✓ Hábito criado com sucesso!');
    }

    editId = null;
    await loadHabits();
    goTo('screen-dashboard');
  } catch (err) {
    showToast(err.message);
  }
}

function editarHabito(id) {
  const h = habits.find((x) => x.id === Number(id));
  if (!h) return;

  editId = Number(id);
  document.getElementById('form-title').textContent = 'Editar hábito';
  document.getElementById('input-nome').value = h.nome;
  document.getElementById('input-cat').value = h.cat;
  document.getElementById('input-freq').value = h.freq;
  goTo('screen-criar');
}

function pedirExcluir(id) {
  deleteId = Number(id);
  document.getElementById('modal-excluir').classList.add('open');
}

function fecharModal() {
  document.getElementById('modal-excluir').classList.remove('open');
  deleteId = null;
}

async function confirmarExcluir() {
  if (!deleteId) return;

  try {
    await apiFetch(`/habits/${deleteId}`, { method: 'DELETE' });
    fecharModal();
    showToast('🗑 Hábito excluído.');
    await loadHabits();
    await renderDash();
    renderLista();
  } catch (err) {
    showToast(err.message);
  }
}

function cancelForm() {
  resetForm();
  goTo('screen-dashboard');
}

async function renderRanking() {
  const today = getTodayDate();
  const month = today.toISOString().slice(0, 7);
  const monthLabel = today.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  document.getElementById('rank-month').textContent = 'Melhores de ' + monthLabel;

  try {
    const result = await apiFetch(`/ranking/monthly?month=${month}`);
    const medals = ['🥇', '🥈', '🥉'];
    const prizes = ['Vale-presente R$100', 'Assinatura premium', 'Kit bem-estar'];

    document.getElementById('ranking-list').innerHTML = (result.ranking || [])
      .map((u, i) => {
        const bgColors = ['#FAEEDA', '#E6F1FB', '#EAF3DE', '#EEEDFE', '#FBEAF0'];
        const textColors = ['#854F0B', '#185FA5', '#3B6D11', '#3C3489', '#993556'];
        const bg = bgColors[i % bgColors.length];
        const tc = textColors[i % textColors.length];

        return `<div class="rank-card" style="${u.isMe ? 'border-color:#1A73E8;border-width:2px;' : ''}">
          <div class="rank-pos">${medals[i] || '#' + u.posicao}</div>
          <div class="rank-avatar" style="background:${bg};color:${tc}">${u.iniciais || initials(u.nome)}</div>
          <div class="rank-info">
            <div class="rank-name">${u.nome}${u.isMe ? ' (você)' : ''}</div>
            <div class="rank-pts">${Number(u.pontos || 0).toLocaleString('pt-BR')} pontos</div>
          </div>
          ${i < 3 ? `<span class="rank-prize">${prizes[i]}</span>` : ''}
        </div>`;
      })
      .join('');
  } catch (err) {
    document.getElementById('ranking-list').innerHTML = `<div class="empty-state"><p>${err.message}</p></div>`;
  }
}

async function initDashboardPage() {
  const token = getToken();
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  loadTheme();
  updateThemeButton();

  // Mostrar informações sobre gerenciamento de data para testes
  const offset = parseInt(localStorage.getItem(DAY_OFFSET_KEY) || '0', 10);
  if (offset !== 0) {
    console.log(`📅 Data simulada: +${offset} dia(s). Use setDayOffset(n) ou resetDayOffset() no console.`);
  }

  try {
    await apiFetch('/auth/me');
    await loadHabits();
    await renderDash();
    renderLista();
  } catch (_err) {
    clearSession();
    window.location.href = 'login.html';
  }
}

function loadTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
}

function toggleTheme() {
  const isDark = document.body.classList.toggle('dark-mode');
  localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
  updateThemeButton();
}

function updateThemeButton() {
  const btn = document.getElementById('theme-toggle');
  if (btn) {
    const isDark = document.body.classList.contains('dark-mode');
    btn.textContent = isDark ? '☀️' : '🌙';
  }
}

function logout() {
  clearSession();
  window.location.href = 'login.html';
}

function initLoginPage() {
  if (getToken()) {
    window.location.href = 'index.html';
  }
}

function initRegisterPage() {
  if (getToken()) {
    window.location.href = 'index.html';
  }
}

window.registrar = registrar;
window.loginUsuario = loginUsuario;
window.goTo = goTo;
window.setFilter = setFilter;
window.setFilterLista = setFilterLista;
window.salvarHabito = salvarHabito;
window.editarHabito = editarHabito;
window.pedirExcluir = pedirExcluir;
window.fecharModal = fecharModal;
window.confirmarExcluir = confirmarExcluir;
window.cancelForm = cancelForm;
window.toggleDone = toggleDone;

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('app')) {
    void initDashboardPage();
  }
  if (document.getElementById('nome') && document.getElementById('confirma')) {
    initRegisterPage();
  }
  if (document.getElementById('login-usuario') && document.getElementById('login-senha')) {
    initLoginPage();
  }
});
