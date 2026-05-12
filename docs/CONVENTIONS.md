# 📐 Convenções de Código - HabitFlow

## 📋 Índice

1. [Estrutura de Pastas](#estrutura-de-pastas)
2. [Nomeação de Arquivos](#nomeação-de-arquivos)
3. [JavaScript](#javascript)
4. [CSS](#css)
5. [HTML](#html)
6. [Backend (Node.js/Express)](#backend-nodejs-express)
7. [Banco de Dados](#banco-de-dados)
8. [Commits](#commits)

---

## 📁 Estrutura de Pastas

```
projeto/
├── src/                    # Código fonte
│   ├── frontend/          # Frontend (futuro)
│   └── server/            # Backend estruturado (futuro)
├── public/                # Arquivos estáticos
│   ├── css/               # Estilos
│   └── js/                # Scripts
├── backend/               # Backend atual
│   └── src/
│       ├── config/        # Configurações
│       ├── controllers/   # Controladores
│       ├── middlewares/   # Middlewares
│       ├── routes/        # Rotas
│       └── utils/         # Utilitários
├── docs/                  # Documentação
└── tests/                 # Testes (futuro)
```

**Regra:** Nunca coloque código solto na raiz. Organize em pastas lógicas.

---

## 📝 Nomeação de Arquivos

### JavaScript
- **Kebab-case** para pastas e arquivos no frontend: `user-profile.js`, `api-client.js`
- **camelCase** para funções e variáveis: `getUserData()`, `isUserActive`
- **PascalCase** para classes: `UserController`, `HabitValidator`

### CSS
- **Kebab-case** para nomes de classes: `.user-card`, `.habit-list-item`
- **snake_case** para variáveis CSS: `--primary-color`, `--spacing-unit`
- Agrupe seletores relacionados

### Backend (Node.js)
- **camelCase** para nomes de arquivos: `authController.js`, `userRoutes.js`
- **PascalCase** para classes e middlewares: `AuthMiddleware`, `DatabaseConnection`
- **lowercase** para nomes de tabelas: `usuarios`, `habitos`, `registros`

---

## 🌐 JavaScript

### Padrão de Módulos

```javascript
// ❌ Evitar: variáveis globais
var usuarioGlobal = {};

// ✅ Usar: escopo local ou módulos
const usuario = {};
let contador = 0;
```

### Funções

```javascript
// ✅ Bom: função clara e concisa
function calcularPontos(diasCompletos, categoria) {
  const basePontos = 10;
  const bonus = diasCompletos * 1.5;
  return basePontos + bonus;
}

// ✅ Usar arrow functions para callbacks
const usuarios = data.map(item => ({
  id: item.id,
  nome: item.nome
}));
```

### Tratamento de Erros

```javascript
// ✅ Bom: sempre tratar erros
try {
  const dados = await fetch('/api/dados');
  const resultado = await dados.json();
} catch (erro) {
  console.error('Erro ao buscar dados:', erro);
  mostrarMensagemErro('Falha ao carregar dados');
}

// ❌ Evitar: ignorar erros
const dados = await fetch('/api/dados');
```

### Variáveis

```javascript
// ✅ Bom: nomes descritivos
const TEMPO_SESSAO_MS = 7 * 24 * 60 * 60 * 1000;
const usuariosAtivos = [];
let estadoAtual = 'carregando';

// ❌ Evitar: nomes genéricos
const x = 30000;
const arr = [];
let e = 'loading';
```

---

## 🎨 CSS

### Estrutura

```css
/* ✅ Bom: organizado em seções */

/* ========== GLOBAL ========== */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* ========== CORES (Variables) ========== */
:root {
  --color-primary: #1A73E8;
  --color-text: #1a1a1a;
  --color-border: #E0E0E0;
  --spacing-unit: 8px;
  --border-radius: 14px;
}

/* ========== COMPONENTES ========== */
.card {
  padding: var(--spacing-unit) * 2;
  border-radius: var(--border-radius);
}
```

### Nomeação de Classes

```css
/* ✅ BEM Methodology (Block Element Modifier) */
.habit-card { /* Block */ }
.habit-card__title { /* Element */ }
.habit-card--completed { /* Modifier */ }

/* ❌ Evitar: nomes genéricos */
.box { }
.title { }
.active { }
```

### Responsividade

```css
/* ✅ Mobile-first approach */
.container {
  width: 100%;
  padding: 16px;
}

@media (min-width: 768px) {
  .container {
    width: 90%;
    max-width: 1200px;
  }
}

@media (min-width: 1024px) {
  .container {
    padding: 32px;
  }
}
```

---

## 📄 HTML

### Estrutura

```html
<!-- ✅ Bom: semântico e bem indentado -->
<section class="habits-section">
  <header>
    <h1>Meus Hábitos</h1>
  </header>
  
  <article class="habit-card">
    <h2>Beber água</h2>
    <p>Saúde · Diário</p>
  </article>
</section>

<!-- ❌ Evitar: divs sem significado semântico -->
<div class="habits-section">
  <div>Meus Hábitos</div>
  <div class="habit">...</div>
</div>
```

### Atributos

```html
<!-- ✅ Bom: dados estruturados -->
<button 
  class="btn-primary" 
  id="submit-form" 
  data-action="save"
  aria-label="Salvar hábito"
>
  Salvar
</button>

<!-- ❌ Evitar: sem atributos de acessibilidade -->
<button onclick="salvar()">Salvar</button>
```

---

## 🔧 Backend (Node.js/Express)

### Estrutura de Rota

```javascript
// ✅ Bom: separação clara
// routes/habitRoutes.js
const express = require('express');
const router = express.Router();
const habitController = require('../controllers/habitController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, habitController.criarHabito);
router.get('/', authMiddleware, habitController.listarHabitos);
router.put('/:id', authMiddleware, habitController.atualizarHabito);
router.delete('/:id', authMiddleware, habitController.deletarHabito);

module.exports = router;
```

### Controlador

```javascript
// ✅ Bom: controlador bem estruturado
// controllers/habitController.js
const database = require('../config/db');

const criarHabito = async (req, res) => {
  try {
    const { nome, categoria, frequencia, pontos } = req.body;
    const usuarioId = req.user.id;
    
    // Validação
    if (!nome || !categoria) {
      return res.status(400).json({ 
        message: 'Nome e categoria são obrigatórios' 
      });
    }
    
    // Lógica
    const resultado = await database.query(
      'INSERT INTO habitos (nome, categoria, frequencia, pontos, usuario_id) VALUES (?, ?, ?, ?, ?)',
      [nome, categoria, frequencia, pontos, usuarioId]
    );
    
    res.status(201).json({ 
      message: 'Hábito criado com sucesso',
      habitId: resultado.insertId 
    });
  } catch (erro) {
    console.error('Erro ao criar hábito:', erro);
    res.status(500).json({ 
      message: 'Erro ao criar hábito' 
    });
  }
};

module.exports = { criarHabito };
```

### Middleware

```javascript
// ✅ Bom: middleware bem estruturado
// middlewares/authMiddleware.js
const jwt = require('jwt-simple');

const verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      message: 'Token não fornecido' 
    });
  }
  
  try {
    const decoded = jwt.decode(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (erro) {
    res.status(401).json({ 
      message: 'Token inválido' 
    });
  }
};

module.exports = verificarToken;
```

### Tratamento de Erros

```javascript
// ✅ Bom: error handler centralizado
// middlewares/errorMiddleware.js
const tratarErro = (erro, req, res, next) => {
  console.error('Erro:', erro);
  
  const status = erro.status || 500;
  const mensagem = erro.message || 'Erro interno do servidor';
  
  res.status(status).json({ 
    message: mensagem,
    status 
  });
};

module.exports = tratarErro;
```

---

## 🗄️ Banco de Dados

### Nomeação

```sql
-- ✅ Bom: snake_case, significativo
CREATE TABLE usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  login VARCHAR(50) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE habitos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT NOT NULL,
  nome VARCHAR(100) NOT NULL,
  categoria VARCHAR(50),
  frequencia VARCHAR(50),
  pontos INT DEFAULT 10,
  data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- ❌ Evitar: abreviaturas e nomes genéricos
CREATE TABLE usr ( -- ❌ nome muito abreviado
  id INT,
  nm VARCHAR(100), -- ❌ abreviação confusa
  val INT -- ❌ muito genérico
);
```

### Índices

```sql
-- ✅ Bom: índices para queries frequentes
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_habitos_usuario_id ON habitos(usuario_id);
CREATE INDEX idx_registros_data ON registros(data_conclusao);
```

---

## 💬 Commits

### Padrão de Mensagem

Usar **Conventional Commits**:

```
<tipo>(<escopo>): <descrição>

<corpo opcional>

<rodapé opcional>
```

### Tipos

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação, sem mudança de lógica
- `refactor`: Refatoração de código
- `perf`: Melhoria de performance
- `test`: Testes
- `chore`: Configurações, dependências

### Exemplos

```bash
# ✅ Bom
git commit -m "feat(auth): adicionar login com JWT"
git commit -m "fix(habit): corrigir cálculo de pontos"
git commit -m "docs: atualizar README com instruções"
git commit -m "refactor(api): melhorar estrutura de rotas"

# ❌ Evitar
git commit -m "mudanças"
git commit -m "consertei uns bugs"
git commit -m "random stuff"
```

---

## ✅ Checklist de Código

Antes de fazer commit:

- [ ] Nomes de variáveis são descritivos
- [ ] Funções têm responsabilidade única
- [ ] Erros são tratados apropriadamente
- [ ] Código está indentado corretamente
- [ ] Sem variáveis globais desnecessárias
- [ ] Sem console.log() em produção
- [ ] Comentários apenas para lógica complexa
- [ ] Testes escritos (quando aplicável)

---

**Última atualização:** Janeiro de 2024
