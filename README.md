# HabitFlow — Documentação do Sistema

## Introdução

O HabitFlow é uma aplicação web desenvolvida com o objetivo de auxiliar usuários no gerenciamento e acompanhamento de hábitos cotidianos. O sistema permite o cadastro, monitoramento e controle de atividades recorrentes, oferecendo uma interface simples para organização pessoal e acompanhamento de progresso.

O projeto foi desenvolvido como atividade acadêmica, com foco na aplicação prática de conceitos relacionados ao desenvolvimento web, integração entre frontend e backend, autenticação de usuários e persistência de dados em banco relacional.

---

# Objetivos do Projeto

O sistema possui como principais objetivos:

* Permitir o cadastro e gerenciamento de hábitos;
* Registrar a conclusão de atividades diárias;
* Organizar hábitos por categoria e frequência;
* Exibir informações de progresso do usuário;
* Aplicar conceitos de autenticação e controle de acesso;
* Demonstrar a integração entre interface web, servidor e banco de dados.

---

# Funcionalidades Principais

O HabitFlow disponibiliza as seguintes funcionalidades:

* Cadastro de usuários;
* Login e autenticação;
* Criação de hábitos;
* Edição e exclusão de hábitos;
* Registro de conclusão de hábitos;
* Visualização de hábitos cadastrados;
* Sistema de pontuação e ranking;
* Alternância entre tema claro e escuro.

---

# Estrutura Geral do Sistema

O sistema é dividido em duas partes principais:

## Frontend

Responsável pela interface gráfica e interação com o usuário.

### Tecnologias utilizadas

* HTML5
* CSS3
* JavaScript

### Principais arquivos

* `public/index.html`
* `public/login.html`
* `public/registro.html`
* `public/css/style.css`
* `public/js/script.js`

---

## Backend

Responsável pelo processamento das requisições, regras de negócio e comunicação com o banco de dados.

### Tecnologias utilizadas

* Node.js
* Express.js
* MySQL

### Componentes principais

#### Rotas

Definem os endpoints utilizados pela aplicação.

#### Controllers

Processam as requisições recebidas e executam as regras de negócio.

#### Banco de Dados

Responsável pelo armazenamento das informações do sistema.

#### Middlewares

Utilizados para autenticação, validação de dados e tratamento de erros.

---

# Funcionamento do Sistema

## Cadastro de Usuário

O usuário pode criar uma conta informando e-mail e senha. As informações são armazenadas no banco de dados, sendo a senha protegida por criptografia.

---

## Autenticação

Após o login, o sistema gera um token de autenticação utilizado para validar as requisições realizadas pelo usuário durante a sessão.

---

## Gerenciamento de Hábitos

O sistema permite:

* Criar hábitos;
* Editar hábitos existentes;
* Excluir hábitos;
* Definir categorias;
* Definir frequência de realização.

As frequências disponíveis são:

* Diário;
* Semanal;
* Mensal.

---

## Registro de Conclusão

Os hábitos podem ser marcados como concluídos diretamente no painel principal. Cada conclusão adiciona pontos ao usuário no sistema de ranking.

---

## Ranking

O ranking apresenta os usuários com maior pontuação acumulada, considerando a quantidade de hábitos concluídos.

---

# Estrutura do Banco de Dados

O banco de dados é composto pelas seguintes tabelas:

## Tabela: usuarios

```text id="2wbgb7"
id
email
senha
data_criacao
```

---

## Tabela: habitos

```text id="a6mv6m"
id
usuario_id
nome
categoria
frequencia
ativo
criado_em
```

---

## Tabela: habito_checkins

```text id="h2r4z6"
id
habito_id
usuario_id
data_ref
concluido
pontos
```

---

## Tabela: ranking

```text id="pl6mye"
id
usuario_id
mes
pontos_totais
posicao
```

---

# Interface do Sistema

A interface foi desenvolvida com foco em simplicidade e facilidade de navegação.

O sistema possui as seguintes telas:

* Tela de login;
* Tela de cadastro;
* Dashboard principal;
* Tela de listagem de hábitos;
* Tela de criação e edição de hábitos;
* Tela de ranking.

Além disso, a aplicação possui suporte aos temas claro e escuro.

---

# Segurança

O sistema utiliza autenticação baseada em token JWT para controle de acesso às rotas protegidas.

As senhas são armazenadas de forma criptografada no banco de dados, evitando armazenamento em texto simples.

---

# Instalação e Execução

## Pré-requisitos

* Node.js
* MySQL

---

## Instalação das dependências

```bash id="jlwm1u"
npm install
```

---

## Configuração do banco de dados

```bash id="fjlwmw"
mysql -u root -p habitflow < banco_habitoapp.sql
```

---

## Configuração das variáveis de ambiente

Arquivo `.env`:

```env id="p0zvte"
PORT=3000
JWT_SECRET=chave_secreta
JWT_EXPIRES_IN=7d

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=senha
DB_NAME=habitflow
```

---

## Inicialização do servidor

```bash id="4vksr5"
npm start
```

---

# Considerações Finais

O HabitFlow foi desenvolvido como projeto acadêmico com a finalidade de aplicar conceitos relacionados ao desenvolvimento de aplicações web completas.

Durante o desenvolvimento, foram utilizados conhecimentos de frontend, backend, autenticação, integração com banco de dados e organização estrutural de sistemas web.

O projeto atende aos requisitos propostos e demonstra a implementação prática das tecnologias estudadas ao longo do curso.
