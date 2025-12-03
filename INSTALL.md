# 📦 Guia de Instalação - Dice Roller Extension

Este guia fornece instruções detalhadas para instalar a extensão Dice Roller no seu navegador.

## 🔧 Pré-requisitos

- **Navegador compatível**: Chrome 88+, Firefox 85+, ou Edge 88+
- **Acesso ao Gemini Chat**: Conta Google para acessar https://gemini.google.com
- **Permissões de desenvolvedor**: Para instalação manual

## 🚀 Instalação Manual (Recomendada para Desenvolvimento)

### Para Google Chrome

1. **Baixe a extensão**
   - Clone este repositório ou baixe como ZIP
   - Extraia os arquivos se necessário

2. **Abra o Chrome**
   - Digite `chrome://extensions/` na barra de endereços
   - Ou vá em Menu → Mais ferramentas → Extensões

3. **Ative o modo desenvolvedor**
   - Clique no botão "Modo do desenvolvedor" no canto superior direito
   - O botão deve ficar azul/ativo

4. **Carregue a extensão**
   - Clique em "Carregar sem compactação"
   - Navegue até a pasta `dice-roller-extension`
   - Selecione a pasta e clique em "Selecionar pasta"

5. **Verifique a instalação**
   - A extensão deve aparecer na lista com o ícone 🎲
   - Certifique-se de que está ativada (toggle azul)

### Para Mozilla Firefox

1. **Prepare a extensão**
   - Baixe e extraia os arquivos
   - Abra o Firefox

2. **Acesse as extensões**
   - Digite `about:debugging` na barra de endereços
   - Clique em "Este Firefox" na barra lateral

3. **Carregue temporariamente**
   - Clique em "Carregar extensão temporária..."
   - Navegue até a pasta da extensão
   - Selecione o arquivo `manifest.json`

4. **Nota importante**
   - No Firefox, extensões temporárias são removidas ao fechar o navegador
   - Para uso permanente, a extensão precisa ser assinada pela Mozilla

### Para Microsoft Edge

1. **Abra o Edge**
   - Digite `edge://extensions/` na barra de endereços

2. **Ative o modo desenvolvedor**
   - Clique no botão "Modo de desenvolvedor" na barra lateral esquerda

3. **Carregue a extensão**
   - Clique em "Carregar descompactado"
   - Selecione a pasta `dice-roller-extension`

## ✅ Verificação da Instalação

### Teste Básico

1. **Acesse o Gemini Chat**
   - Vá para https://gemini.google.com
   - Faça login se necessário

2. **Procure o botão de dados**
   - Olhe no toolbox drawer (área com botões como "Video", "Deep Research")
   - Deve haver um botão "Dados" com ícone 🎲

3. **Teste a funcionalidade**
   - Clique no botão de dados
   - Digite "1d6" no campo
   - Clique em "Rolar Dados"
   - Verifique se a animação funciona
   - Clique em "Inserir no Chat"

### Teste de Fallback

Se o botão não aparecer no toolbox:

1. **Procure o botão flutuante**
   - Deve aparecer no canto inferior direito da tela

2. **Teste o atalho de teclado**
   - Pressione Ctrl+Shift+D
   - O popup de dados deve abrir

3. **Verifique o console**
   - Pressione F12 para abrir as ferramentas de desenvolvedor
   - Vá para a aba "Console"
   - Procure por mensagens começando com "🎲"

## 🔧 Solução de Problemas

### Extensão não carrega

**Problema**: Erro ao carregar a extensão
**Soluções**:
- Verifique se todos os arquivos estão presentes
- Confirme que o `manifest.json` está na raiz da pasta
- Verifique se não há erros de sintaxe no console

### Botão não aparece

**Problema**: Botão de dados não aparece no Gemini
**Soluções**:
1. Recarregue a página do Gemini (F5)
2. Verifique se a extensão está ativa
3. Aguarde alguns segundos para a injeção automática
4. Procure pelo botão flutuante ou use Ctrl+Shift+D

### Animações não funcionam

**Problema**: Dados não animam ou aparecem erros
**Soluções**:
- A extensão usa fallback automático
- Verifique se WebGL está habilitado no navegador
- Teste em uma aba anônima para descartar conflitos

### Resultados não são inseridos

**Problema**: Clique em "Inserir no Chat" não funciona
**Soluções**:
1. Certifique-se de estar na página oficial do Gemini
2. Clique no campo de texto antes de inserir
3. Recarregue a página se necessário

## 🔄 Atualização da Extensão

### Atualizações Manuais

1. **Baixe a nova versão**
2. **Substitua os arquivos** na pasta da extensão
3. **Recarregue a extensão**:
   - Vá para `chrome://extensions/`
   - Clique no ícone de recarregar (🔄) na extensão

### Verificar Versão

- Vá para `chrome://extensions/`
- Procure por "Dice Roller for Gemini Chat"
- A versão atual está listada abaixo do nome

## 🛡️ Permissões Necessárias

A extensão solicita as seguintes permissões:

- **activeTab**: Para interagir com a aba ativa do Gemini
- **Acesso a gemini.google.com**: Para injetar o botão e inserir resultados

### Por que essas permissões?

- **activeTab**: Necessária para detectar quando você está no Gemini e injetar o botão
- **gemini.google.com**: Específica para o domínio do Gemini, garantindo que a extensão só funcione onde deveria

## 📱 Uso em Dispositivos Móveis

**Nota**: Esta extensão foi projetada para navegadores desktop. Navegadores móveis têm suporte limitado para extensões.

### Chrome Mobile
- Não suporta extensões de terceiros
- Use a versão desktop do Chrome

### Firefox Mobile
- Suporte limitado para extensões
- Algumas funcionalidades podem não funcionar

## 🔒 Segurança

### Dados Coletados
- **Nenhum**: A extensão não coleta ou envia dados externos
- **Local apenas**: Todos os cálculos são feitos localmente

### Permissões Mínimas
- A extensão usa apenas as permissões necessárias
- Não acessa outros sites além do Gemini

## 📞 Suporte

Se você encontrar problemas:

1. **Verifique este guia** primeiro
2. **Execute os testes** em `tests/test-runner.html`
3. **Abra uma issue** no GitHub com:
   - Versão do navegador
   - Mensagens de erro do console
   - Passos para reproduzir o problema

---

**Instalação concluída com sucesso? Divirta-se rolando dados no Gemini! 🎲**