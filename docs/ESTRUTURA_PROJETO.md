# Estrutura do Projeto HabitFlow

## Mudanças Realizadas

O projeto foi reorganizado seguindo o padrão de estrutura recomendado para aplicações Node.js com frontend e backend separados.

### Antes:
```
/
├── index.html
├── login.html
├── registro.html
├── script.js
├── style.css
├── backend/
│   └── src/
├── package.json
└── ...
```

### Depois:
```
/
├── public/                    # Arquivos do frontend
│   ├── index.html
│   ├── login.html
│   ├── registro.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── script.js
├── backend/
│   ├── src/
│   │   ├── app.js            # Configurado para servir /public
│   │   ├── server.js
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   └── utils/
│   └── ...
├── docs/                      # Documentação do projeto
├── package.json
├── .env
└── ...
```

## Benefícios da Nova Estrutura

1. **Separação de Responsabilidades**: Frontend e backend estão organizados em pastas claras
2. **Escalabilidade**: Fácil adicionar novos arquivos CSS/JS sem bagunçar a raiz
3. **Conformidade com Padrões**: Segue as convenções de projetos Node.js profissionais
4. **Manutenibilidade**: Mais fácil navegar e entender a estrutura
5. **Build Otimizado**: Permite minificação e processamento de assets no futuro

## Arquivos Modificados

- **backend/src/app.js**: Atualizado para servir `public/` em vez da raiz
  - Removidas rotas individuais para HTML
  - Simplificado o middleware de arquivos estáticos
  - SPA fallback mantém funcionalidade de roteamento

## Compatibilidade

✅ Todas as funcionalidades mantidas
✅ Servidor Node.js inicia sem erros
✅ Banco de dados funciona normalmente
✅ API routes continuam operacionais
✅ Frontend carrega corretamente

## Próximos Passos Opcionais

1. Remover arquivos antigos da raiz (index.html, login.html, etc. antigos)
2. Considerar minificação de CSS/JS em produção
3. Adicionar build script no package.json se necessário
4. Implementar suporte a assets (imagens, fontes)

## Rodando o Projeto

```bash
# Instalar dependências (se necessário)
npm install

# Iniciar servidor
npm start

# Ou modo desenvolvimento
npm run dev

# O projeto estará disponível em:
# http://localhost:3000
```
