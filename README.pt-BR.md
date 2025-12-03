# 🎲 Rolador de Dados para Gemini Chat

**Português** | [English](README.md)

Uma extensão do Chrome que adiciona funcionalidade avançada de rolagem de dados ao Google Gemini Chat com animações bonitas e recursos focados em RPG.

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Chrome](https://img.shields.io/badge/chrome-extension-orange.svg)

## ✨ Recursos

### 🎯 Recursos Principais
- **8 Dados Simultâneos**: Role até 8 dados diferentes de uma vez
- **Sistema Player vs NPC**: 4 dados para jogadores (com modificadores) + 4 dados para NPCs
- **Múltiplos Formatos**: Suporte para vários formatos de dados (1d20, 2d6, 3d8+5, etc.)
- **Expressões Complexas**: Role múltiplos tipos de dados em uma expressão (1d20+2d6+5)
- **Inserção Automática**: Insere automaticamente os resultados no chat e envia
- **Botão Limpar Tudo**: Limpe rapidamente todos os 8 campos de dados de uma vez

### 🎮 Mecânicas Avançadas
- **Vantagem/Desvantagem**: Rolagens estilo D&D 5e com vantagem e desvantagem
- **Modo Dado Sortudo** 🍀: Garante resultados nos 70% superiores (apenas dados de Player)
- **Modo Dado Azarado** 💀: Garante resultados nos 30% inferiores (apenas dados de Player)
- **Modificadores**: Suporte para modificadores positivos e negativos (+5, -2, etc.)
- **Aleatório Seguro**: Usa Web Crypto API para números aleatórios criptograficamente seguros

### 👤 Dados do Player (1-4)
- Suporte completo a modificadores (Sortudo/Azarado)
- Tipos de rolagem: Vantagem/Desvantagem/Normal
- Cores: Azul, Vermelho, Verde, Roxo

### 🎭 Dados de NPC (5-8)
- Apenas tipos de rolagem: Vantagem/Desvantagem/Normal
- Sem modificadores Sortudo/Azarado
- Cores: Vermelho, Amarelo, Laranja, Marrom
- Perfeito para rolagens de inimigos/NPCs

### 🌍 Internacionalização
- **Suporte Bilíngue**: Suporte completo para Português (PT-BR) e Inglês (EN-US)
- **Troca Dinâmica de Idioma**: Mude o idioma instantaneamente
- **Configurações Persistentes**: Preferência de idioma salva no localStorage
- **Idioma Padrão**: Inglês (EN-US)

### 🎨 Interface do Usuário
- **Material Design**: Segue as diretrizes do Material Design do Google
- **Compatível com Tema Escuro**: Combina com o tema escuro do Gemini
- **Responsivo**: Funciona em todos os tamanhos de tela
- **Layout Organizado**: Dados de Player e NPC em seções separadas

## 📦 Instalação

### Instalação Manual (Modo Desenvolvedor)

1. **Baixe a Extensão**
   ```bash
   git clone https://github.com/srmooon/extension-dice-roller-gemini.git
   cd extension-dice-roller-gemini
   ```

2. **Carregue no Chrome**
   - Abra o Chrome e navegue até `chrome://extensions/`
   - Ative o "Modo do desenvolvedor" (botão no canto superior direito)
   - Clique em "Carregar sem compactação"
   - Selecione a pasta da extensão

3. **Comece a Usar**
   - Vá para [gemini.google.com](https://gemini.google.com)
   - Procure pelo botão 🎲 Dados ao lado da entrada de chat
   - Clique e comece a rolar!

## 🎲 Como Usar

### Rolagem Básica

1. Clique no botão 🎲 **Dados** no Gemini Chat
2. Digite o formato do dado em qualquer um dos 8 campos
3. Selecione o tipo de rolagem (Normal/Vantagem/Desvantagem)
4. Para dados de Player: opcionalmente selecione o modificador Sortudo/Azarado
5. Clique em **Rolar Dados**
6. Os resultados são automaticamente inseridos no chat

### Exemplos de Formato de Dados

| Formato | Descrição |
|---------|-----------|
| `1d20` | Rola um dado de 20 lados |
| `2d6` | Rola dois dados de 6 lados |
| `3d8+5` | Rola três dados de 8 lados e adiciona 5 |
| `1d12-2` | Rola um dado de 12 lados e subtrai 2 |
| `4d6` | Rola quatro dados de 6 lados |
| `1d20+2d6+3` | Rola 1d20, 2d6 e adiciona 3 |
| `3d6+2d8+5` | Rola 3d6, 2d8 e adiciona 5 |

### Recursos Avançados

#### Rolagem de Múltiplos Dados
- **Dados 1-4 (Player)**: Com modificadores Sortudo/Azarado
- **Dados 5-8 (NPC)**: Sem modificadores especiais
- Role qualquer combinação simultaneamente
- Resultados são agrupados por categoria (PLAYER/NPC)

#### Tipos de Rolagem
- **Normal**: Rolagem padrão
- **Vantagem**: Rola 2 dados por dado, pega o maior
- **Desvantagem**: Rola 2 dados por dado, pega o menor

#### Modificadores (Apenas Dados de Player)
- **Nenhum**: Rolagem padrão
- **Sortudo** 🍀: Garante resultados nos 70% superiores
- **Azarado** 💀: Garante resultados nos 30% inferiores

### Seleção de Idioma

1. Abra o popup do rolador de dados
2. Role até o final
3. Selecione seu idioma (PT-BR ou EN-US)
4. Clique em "Recarregar Página" para aplicar as mudanças
5. A preferência de idioma é salva automaticamente

## 🛠️ Detalhes Técnicos

### Dados Suportados
- **Lados**: 2 a 100 lados
- **Quantidade**: 1 a 200 dados por rolagem
- **Modificadores**: Ilimitados
- **Expressões Complexas**: Múltiplos tipos de dados em uma rolagem

### Geração de Números Aleatórios
- **Primário**: Web Crypto API (criptograficamente seguro)
- **Fallback**: Math.random() (se Crypto API indisponível)
- **Sortudo/Azarado**: Mecanismo de re-rolagem para faixas garantidas

### Compatibilidade de Navegadores
- Chrome 88+
- Edge 88+
- Outros navegadores baseados em Chromium

## 📁 Estrutura do Projeto

```
extension-dice-roller-gemini/
├── manifest.json           # Manifesto da extensão
├── content-script.js       # Script de conteúdo principal
├── utils/
│   ├── i18n.js            # Internacionalização
│   ├── dice-parser.js     # Parser de formato de dados
│   ├── random-generator.js # Geração de números aleatórios
│   ├── roll-engine.js     # Lógica de rolagem de dados
│   ├── error-handler.js   # Tratamento de erros
│   ├── gemini-injector.js # Injeção de UI
│   └── fallback-manager.js # Estratégias de fallback
├── popup/
│   ├── dice-popup.js      # Lógica do popup
│   └── dice-popup.css     # Estilos do popup
├── styles/
│   └── dice-button.css    # Estilos do botão
├── assets/
│   └── icons/             # Ícones da extensão
└── tests/                 # Arquivos de teste
```

## 🎯 Recursos em Detalhe

### Sistema Sortudo/Azarado
O sistema de modificadores usa um mecanismo de re-rolagem:

**Dado Sortudo** 🍀:
- d6: Garante 5-6
- d10: Garante 7-10
- d20: Garante 14-20
- Outros dados: Faixa dos 70% superiores

**Dado Azarado** 💀:
- d6: Garante 1-3
- d10: Garante 1-3
- d20: Garante 1-6
- Outros dados: Faixa dos 30% inferiores

### Formato de Saída

**Português (PT-BR):**
```
👤 PLAYER
🎲 Dado 1: 1d20 ➜ 18 (Vantagem)
🎲 Dado 2: 2d6+3 ➜ 11 🍀

🎭 NPC
🎲 Dado 5: 1d20 ➜ 12
```

**Inglês (EN-US):**
```
👤 PLAYER
🎲 Die 1: 1d20 ➜ 18 (Advantage)
🎲 Die 2: 2d6+3 ➜ 11 🍀

🎭 NPC
🎲 Die 5: 1d20 ➜ 12
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para enviar um Pull Request.

### Configuração de Desenvolvimento

1. Clone o repositório
2. Faça suas alterações
3. Teste no Chrome (Modo Desenvolvedor)
4. Envie um PR com uma descrição clara

## 📝 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🐛 Relatórios de Bugs e Solicitações de Recursos

- **Issues**: [GitHub Issues](https://github.com/srmooon/extension-dice-roller-gemini/issues)

## 📧 Contato

- **GitHub**: [@srmooon](https://github.com/srmooon)
- **Repositório**: [extension-dice-roller-gemini](https://github.com/srmooon/extension-dice-roller-gemini)

## 🙏 Agradecimentos

- Google Gemini pela incrível plataforma de chat com IA
- Material Design pelas diretrizes de design
- A comunidade de RPG e D&D pela inspiração

---

**Feito com 🎲 para a comunidade de RPG e jogos**

*Divirta-se rolando seus dados no Gemini Chat!*
