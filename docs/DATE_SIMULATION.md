# 📅 Simulação de Data - Guia de Teste

Este guia explica como simular a passagem de dias na aplicação HabitFlow para testar o ranking e outras funcionalidades.

## 🎯 Como Usar

### Via Console do Navegador

1. **Abra o Console do Navegador**
   - Chrome/Firefox: `F12` ou `Ctrl+Shift+I`
   - Safari: `Cmd+Option+I`

2. **Use os comandos de data:**

```javascript
// ⏰ Avançar para o próximo dia
setDayOffset(1)

// ⏰ Avançar 3 dias
setDayOffset(3)

// ⏰ Avançar 7 dias (uma semana)
setDayOffset(7)

// ⏰ Voltar ao dia atual
resetDayOffset()
```

3. **Recarregue a página** para ver as mudanças
   - A data simulada aparecerá no dashboard
   - O ranking mostrará dados simulados

## 📝 Exemplos Práticos

### Cenário 1: Verificar Histórico de Ontem
```javascriptábitos em Diferentes Data
setDayOffset(3)  // Vai para 14 de maio de 2026
```
- Crie ou complete hábitos com frequência semanal
- Navegue em diferentes datas
- Veja como o ranking muda

### Cenário 3: Voltando ao Hoje
```javascript
resetDayOffset()  // Volta para 11 de maio de 2026 (hoje)
```

## 🔍 Verificando a Data Simulada

Ao carregar o dashboard com um offset ativo, verifique o console (F12) para confirmar:
2
```
📅 Data simulada: +1 dia(s). Use setDayOffset(n) ou resetDayOffset() no console.
```

## 💡 Dicas

- A data simulada é armazenada no `localStorage`
- Ela persiste entre recarregamentos
- Use `getTodayDate()` para obter a data atual simulada

```javascript
console.log(getTodayDate())  // Mostra a data simulada
```

## 🧪 Testando Features

### Testar Ranking Mensal
1. Crie vários hábitos em dias diferentes
2. Marque alguns como completos
3. Execute `setDayOffset(3)` ou mais
4. Vá para "Ranking"
5. Veja como a posição muda ao longo dos dias

### Testar Stats de Hoje
1. Marque alguns hábitos como completos
2. Execute `setDayOffset(1)`
3. Volte ao Dashboard
4. As stats devem mostrar "hoje" com 0 hábitos completos

## ⚠️ Importante

- A simulação é **apenas no frontend** (lado do cliente)
- O backend usa a data real do servidor
- Históricos e rankings podem ter comportamento incomum se misturar datas simuladas e reais
- Use para testes/demonstração, não para produção

## 🔄 Reset Completo

Para limpar tudo:
```javascript
resetDayOffset()  // Reseta data
localStorage.clear()  // Limpa tudo (cuidado!)
location.reload()  // Recarrega
```

---

**Dica:** Use `setDayOffset(1)` para verificar como sua aplicação lida com dados históricos e múltiplos dias!
