# 🔧 Guia de Setup - HabitFlow

## 1️⃣ Configuração do Ambiente

### Windows

#### Instalar Node.js
1. Acesse https://nodejs.org/
2. Baixe a versão LTS
3. Execute o instalador e siga as instruções
4. Verifique a instalação:
   ```bash
   node --version
   npm --version
   ```

#### Instalar MySQL
1. Baixe em https://dev.mysql.com/downloads/mysql/
2. Execute o instalador MySQL Community Server
3. Escolha "Development Default" na configuração
4. Configure o MySQL como serviço do Windows
5. Defina uma senha para o usuário `root`

### macOS

```bash
# Usando Homebrew
brew install node mysql

# Verificar instalação
node --version
npm --version
mysql --version
```

### Linux (Ubuntu/Debian)

```bash
# Atualizar repositórios
sudo apt update

# Instalar Node.js
sudo apt install nodejs npm

# Instalar MySQL
sudo apt install mysql-server

# Verificar instalação
node --version
npm --version
mysql --version
```

## 2️⃣ Configuração do Projeto

### Clone e Prepare

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd projeto-habitflow

# Instale as dependências
npm install
```

### Configure o Banco de Dados

#### Opção A: Usando MySQL CLI

```bash
# Acesse o MySQL
mysql -u root -p

# Você será solicitado a digitar a senha

# No console MySQL, execute:
CREATE DATABASE habitflow CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE habitflow;
SOURCE banco_habitoapp.sql;
SHOW TABLES;  # Verifique se as tabelas foram criadas
EXIT;
```

#### Opção B: Importar Arquivo Direto

```bash
# Linux/macOS
mysql -u root -p < banco_habitoapp.sql

# Windows (CMD)
mysql -u root -p < banco_habitoapp.sql
```

### Configure Variáveis de Ambiente

1. **Copie o arquivo de exemplo:**
   ```bash
   cp .env.example .env
   ```

2. **Edite o arquivo `.env` com suas credenciais:**
   ```env
   PORT=3000
   JWT_SECRET=use_uma_senha_forte_e_aleatoria_aqui
   JWT_EXPIRES_IN=7d
   
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=sua_senha_do_mysql
   DB_NAME=habitflow
   ```

### Teste a Conexão com o Banco

```bash
# Teste a conexão MySQL
mysql -h localhost -u root -p -e "use habitflow; SHOW TABLES;"
```

## 3️⃣ Iniciar o Projeto

### Modo Desenvolvimento

```bash
# Com nodemon (reload automático)
npm run dev

# Ou simplesmente
npm start
```

### Modo Produção

```bash
npm start
```

### Acesse a Aplicação

Abra seu navegador e acesse:
```
http://localhost:3000
```

## 4️⃣ Primeiros Passos

1. **Crie uma conta:**
   - Clique em "Registre-se"
   - Preenchao formulário e crie seu usuário

2. **Crie um hábito:**
   - Na dashboard, clique em "+ Adicionar hábito"
   - Escolha uma categoria e frequência
   - Clique em "Salvar"

3. **Explore a aplicação:**
   - ✅ Marque hábitos concluídos
   - 📊 Veja estatísticas na dashboard
   - 🏆 Consulte o ranking
   - 📈 Acompanhe seu histórico

## 🐛 Troubleshooting

### "Port 3000 is already in use"
```bash
# Mude a porta no .env
PORT=3001

# Ou mate o processo (Linux/macOS)
lsof -ti:3000 | xargs kill -9

# Ou (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### "Can't connect to MySQL server"
- Verifique se MySQL está rodando
- Confira as credenciais no `.env`
- Teste: `mysql -u root -p`

### "Connection refused on localhost:3000"
- Verifique se o servidor Node está rodando
- Veja se não há erro no console
- Tente: `npm run dev` para modo debug

### "database 'habitflow' doesn't exist"
- Execute: `mysql -u root -p < banco_habitoapp.sql`
- Ou importe manualmente pelo seu cliente MySQL

## 📦 Dependências Principais

- **express**: Framework web
- **dotenv**: Variáveis de ambiente
- **jwt-simple**: Autenticação JWT
- **mysql2**: Driver MySQL
- **cors**: Middleware CORS

Veja `package.json` para a lista completa.

## 🚀 Scripts Disponíveis

```bash
npm start          # Inicia o servidor (produção)
npm run dev        # Inicia com nodemon (desenvolvimento)
npm test           # Executa testes (quando implementado)
npm run build      # Build para produção (quando implementado)
```

## 📚 Próximos Passos

1. Familiarize-se com a interface
2. Explore as diferentes categorias de hábitos
3. Consulte a documentação da API em `docs/`
4. Personalize o arquivo `.env` conforme necessário

---

**Pronto para começar? Boa sorte! 🎯**
