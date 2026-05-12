# 📡 Documentação da API - HabitFlow

## Base URL

```
http://localhost:3000/api
```

## 🔐 Autenticação

Todos os endpoints (exceto login e registro) requerem o header:

```
Authorization: Bearer <seu_token_jwt>
```

---

## 👤 Autenticação

### 1. Registro de Novo Usuário

**POST** `/auth/register`

```json
{
  "nome": "João Silva",
  "email": "joao@example.com",
  "login": "joao.silva",
  "senha": "senha123"
}
```

**Resposta (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@example.com",
    "login": "joao.silva"
  }
}
```

### 2. Login

**POST** `/auth/login`

```json
{
  "login": "joao.silva",
  "senha": "senha123"
}
```

**Resposta (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@example.com",
    "login": "joao.silva"
  }
}
```

---

## 📋 Hábitos

### 3. Listar Todos os Hábitos do Usuário

**GET** `/habits`

**Headers:**
```
Authorization: Bearer <token>
```

**Resposta (200):**
```json
{
  "habits": [
    {
      "id": 1,
      "nome": "Beber 2L de água",
      "categoria": "Saúde",
      "frequencia": "Diario",
      "pontos": 10,
      "dataCriacao": "2024-01-15T10:30:00Z",
      "done": false
    }
  ]
}
```

### 4. Criar Novo Hábito

**POST** `/habits`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "nome": "Meditar 10 minutos",
  "categoria": "Bem-estar",
  "frequencia": "Diario",
  "pontos": 15
}
```

**Resposta (201):**
```json
{
  "id": 2,
  "nome": "Meditar 10 minutos",
  "categoria": "Bem-estar",
  "frequencia": "Diario",
  "pontos": 15,
  "dataCriacao": "2024-01-20T14:45:00Z"
}
```

### 5. Atualizar Hábito

**PUT** `/habits/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "nome": "Meditar 20 minutos",
  "categoria": "Bem-estar",
  "frequencia": "Diario",
  "pontos": 20
}
```

**Resposta (200):**
```json
{
  "message": "Hábito atualizado com sucesso",
  "habit": { /* dados atualizados */ }
}
```

### 6. Deletar Hábito

**DELETE** `/habits/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Resposta (200):**
```json
{
  "message": "Hábito deletado com sucesso"
}
```

### 7. Marcar Hábito como Concluído

**POST** `/habits/:id/complete`

**Headers:**
```
Authorization: Bearer <token>
```

**Resposta (200):**
```json
{
  "message": "Hábito marcado como concluído",
  "habit": { /* dados do hábito */ }
}
```

### 8. Desmarcar Hábito

**POST** `/habits/:id/uncomplete`

**Headers:**
```
Authorization: Bearer <token>
```

**Resposta (200):**
```json
{
  "message": "Hábito desmarcado",
  "habit": { /* dados do hábito */ }
}
```

### 9. Obter Estatísticas de Hábitos

**GET** `/habits/stats`

**Headers:**
```
Authorization: Bearer <token>
```

**Resposta (200):**
```json
{
  "totalHabitos": 5,
  "concluidosHoje": 3,
  "semana": 18,
  "mes": 75
}
```

---

## 🏆 Ranking

### 10. Obter Ranking Mensal

**GET** `/ranking/month`

**Headers:**
```
Authorization: Bearer <token>
```

**Resposta (200):**
```json
{
  "ranking": [
    {
      "posicao": 1,
      "usuarioId": 5,
      "nome": "Maria Silva",
      "pontos": 450,
      "premio": "🥇 Ouro"
    },
    {
      "posicao": 2,
      "usuarioId": 3,
      "nome": "João Santos",
      "pontos": 380,
      "premio": "🥈 Prata"
    }
  ]
}
```

### 11. Obter Ranking Anual

**GET** `/ranking/year`

**Headers:**
```
Authorization: Bearer <token>
```

**Resposta (200):**
```json
{
  "ranking": [ /* similar ao ranking mensal */ ]
}
```

---

## ⚠️ Códigos de Erro

| Código | Mensagem | Descrição |
|--------|----------|-----------|
| 400 | Bad Request | Dados inválidos ou incompletos |
| 401 | Unauthorized | Token ausente ou inválido |
| 403 | Forbidden | Sem permissão para essa ação |
| 404 | Not Found | Recurso não encontrado |
| 409 | Conflict | Conflito (ex: login duplicado) |
| 500 | Internal Server Error | Erro no servidor |

**Formato de Erro:**
```json
{
  "message": "Descrição do erro",
  "status": 400
}
```

---

## 🧪 Exemplos com cURL

### Registrar Usuário
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João",
    "email": "joao@email.com",
    "login": "joao123",
    "senha": "senha123"
  }'
```

### Criar Hábito
```bash
curl -X POST http://localhost:3000/api/habits \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Exercício",
    "categoria": "Esporte",
    "frequencia": "Diario",
    "pontos": 20
  }'
```

### Obter Ranking
```bash
curl -X GET http://localhost:3000/api/ranking/month \
  -H "Authorization: Bearer <token>"
```

---

## 📝 Categorias Disponíveis

- 💧 Saúde
- 📚 Educação
- 🏃 Esporte
- 💰 Finanças
- 🧘 Bem-estar
- 🥗 Alimentação
- 🤝 Social
- 🎨 Criatividade

---

## ⏱️ Frequências Disponíveis

- Diario
- Semanal
- Mensal

---

**Última atualização:** Janeiro de 2024  
**Versão da API:** 1.0
