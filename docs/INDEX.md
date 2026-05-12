# 📚 Índice de Documentação - HabitFlow

Bem-vindo à documentação do HabitFlow! Use este índice para encontrar as informações que você precisa.

## 🎯 Comece Aqui

1. **[README.md](../README.md)** - Visão geral do projeto e tecnologias
2. **[SETUP.md](./SETUP.md)** - Passo a passo para configurar o ambiente

## 📖 Documentação Principal

### Para Desenvolvedores

| Documento | Descrição |
|-----------|-----------|
| **[API.md](./API.md)** | Documentação completa de todos os endpoints da API |
| **[ESTRUTURA_PROJETO.md](./ESTRUTURA_PROJETO.md)** | Detalhes sobre a reorganização da estrutura |
| **[CONVENTIONS.md](./CONVENTIONS.md)** | Convenções de código a seguir no projeto |
| **[DATE_SIMULATION.md](./DATE_SIMULATION.md)** | Como simular passagem de dias para testes |
| **[INDEX.md](./INDEX.md)** | Este documento |

### Instruções Específicas

| Documento | Descrição |
|-----------|-----------|
| **[../EXECUCAO.md](../EXECUCAO.md)** | Como executar o projeto |
| **[../INSTRUCOES_BANCO.md](../INSTRUCOES_BANCO.md)** | Instruções para configurar o banco de dados |
| **[../LIMPEZA_ARQUIVOS_ANTIGOS.md](../LIMPEZA_ARQUIVOS_ANTIGOS.md)** | Limpeza de arquivos obsoletos |

---

## 🏗️ Estrutura do Projeto

```
projeto-habitflow/
├── README.md                 # 👈 Comece aqui
├── .env.example             # Variáveis de ambiente
├── banco_habitoapp.sql      # Schema do banco
│
├── docs/                     # 📚 Documentação
│   ├── INDEX.md             # Este arquivo
│   ├── SETUP.md             # ⭐ Setup e instalação
│   ├── API.md               # Endpoints da API
│   ├── CONVENTIONS.md       # Convenções de código
│   └── ESTRUTURA_PROJETO.md # Reorganização
│
├── public/                   # Frontend estático
│   ├── index.html
│   ├── login.html
│   ├── registro.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── script.js
│
└── backend/                  # Backend Node.js
    ├── src/
    │   ├── app.js
    │   ├── server.js
    │   ├── config/
    │   ├── controllers/
    │   ├── middlewares/
    │   ├── routes/
    │   └── utils/
    └── package.json
```

---

## 🚀 Guia Rápido

### Primeira Vez?

1. **Instale as dependências**
   ```bash
   npm install
   ```

2. **Siga o [SETUP.md](./SETUP.md)**
   - Configure MySQL
   - Importe o banco de dados
   - Configure `.env`

3. **Inicie o servidor**
   ```bash
   npm start
   ```

4. **Acesse em `http://localhost:3000`**

### Desenvolvendo?

1. **Leia [CONVENTIONS.md](./CONVENTIONS.md)** para padrões de código
2. **Consulte [API.md](./API.md)** para endpoints disponíveis
3. **Verifique [ESTRUTURA_PROJETO.md](./ESTRUTURA_PROJETO.md)** para organização

### Testando a API?

1. **Use [API.md](./API.md)** com exemplos de cURL
2. **Use Postman ou similar** para requisições
3. **Comece com `/auth/register`** e `/auth/login`

---

## 🔗 Recursos Rápidos

### Endpoints Principais

| Método | Endpoint | Autenticação |
|--------|----------|--------------|
| POST | `/api/auth/register` | ❌ Não |
| POST | `/api/auth/login` | ❌ Não |
| GET | `/api/habits` | ✅ Sim |
| POST | `/api/habits` | ✅ Sim |
| GET | `/api/ranking/month` | ✅ Sim |

Veja [API.md](./API.md) para documentação completa.

### Variáveis de Ambiente

```env
PORT=3000                           # Porta do servidor
JWT_SECRET=seu_segredo_super_secreto # Chave para JWT
DB_HOST=localhost                   # Host do MySQL
DB_USER=root                        # Usuário MySQL
DB_PASSWORD=sua_senha               # Senha MySQL
DB_NAME=habitflow                   # Nome do banco
```

Veja `.env.example` para template completo.

---

## 📞 Dúvidas Frequentes

**P: Como resetar o banco de dados?**
```bash
mysql -u root -p habitflow < banco_habitoapp.sql
```

**P: Como mudar a porta?**
Edite `.env` e altere `PORT=3000` para a porta desejada.

**P: Como usar modo desenvolvimento?**
```bash
npm run dev
```
(Com hot reload automático)

**P: Onde estão os testes?**
Ainda em desenvolvimento. Veja [CONVENTIONS.md](./CONVENTIONS.md#-backend-nodejs-express).

---

## 🎨 Features Principais

- ✅ Dashboard com estatísticas
- ✅ CRUD de hábitos
- ✅ Sistema de categorias
- ✅ Modo claro/escuro
- ✅ Ranking mensal
- ✅ Autenticação JWT
- ✅ Interface responsiva

---

## 🔐 Segurança

- Senhas hashadas com JWT
- CORS configurado
- Validação de inputs
- Proteção de rotas com middleware

Veja [CONVENTIONS.md](./CONVENTIONS.md) para best practices.

---

## 📅 Timeline do Projeto

| Data | Milestone |
|------|-----------|
| 2024-01-15 | Projeto iniciado |
| 2024-01-20 | Estrutura reorganizada |
| 2024-01-25 | API implementada |
| 2024-02-01 | Frontend completo |
| 2024-02-10 | Tema escuro adicionado |

---

## 🤝 Contribuindo

1. Leia [CONVENTIONS.md](./CONVENTIONS.md)
2. Crie uma branch: `git checkout -b feature/sua-feature`
3. Commit: `git commit -m "feat: descrição da feature"`
4. Push: `git push origin feature/sua-feature`
5. Abra um Pull Request

---

## 📖 Referências Externas

- [Express.js Docs](https://expressjs.com/)
- [JWT Guide](https://jwt.io/)
- [MySQL Docs](https://dev.mysql.com/doc/)
- [MDN Web Docs](https://developer.mozilla.org/)

---

## 📞 Suporte

Encontrou um problema? Veja:

1. **[SETUP.md](./SETUP.md#-troubleshooting)** - Solução de problemas
2. **[API.md](./API.md#-códigos-de-erro)** - Códigos de erro
3. **Abra uma issue** no repositório

---

**Última atualização:** Janeiro de 2024  
**Versão:** 1.0  
**Status:** ✅ Ativo
