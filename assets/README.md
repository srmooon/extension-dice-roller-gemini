# Assets Directory

Esta pasta contém os recursos visuais da extensão Dice Roller.

## Estrutura

```
assets/
├── icons/              # Ícones da extensão
│   ├── dice-16.png     # Ícone 16x16px
│   ├── dice-32.png     # Ícone 32x32px
│   ├── dice-48.png     # Ícone 48x48px
│   └── dice-128.png    # Ícone 128x128px
├── textures/           # Texturas para dados 3D
└── create-icons.html   # Gerador de ícones
```

## Como Gerar os Ícones

1. Abra o arquivo `create-icons.html` em um navegador
2. Clique em "Gerar Todos os Ícones"
3. Faça o download de cada ícone clicando no botão "Download"
4. Salve os arquivos na pasta `icons/` com os nomes corretos:
   - `dice-16.png` (16x16 pixels)
   - `dice-32.png` (32x32 pixels)
   - `dice-48.png` (48x48 pixels)
   - `dice-128.png` (128x128 pixels)

## Design dos Ícones

Os ícones seguem o design do Material Design com:
- Fundo circular azul (#4285f4)
- Dado branco com pontos azuis
- Bordas arredondadas
- Diferentes níveis de detalhes baseados no tamanho

## Texturas 3D

A pasta `textures/` pode conter texturas para os dados 3D, como:
- Texturas de faces numeradas
- Materiais diferentes para tipos de dados
- Padrões e cores personalizadas

## Formatos Suportados

- **Ícones**: PNG com transparência
- **Texturas**: PNG, JPG, ou formatos suportados pelo Three.js
- **Tamanhos**: Múltiplos tamanhos para diferentes contextos de uso

## Otimização

- Ícones são otimizados para clareza em tamanhos pequenos
- Uso de cores contrastantes para boa visibilidade
- Formato PNG para suporte à transparência
- Tamanhos padrão para compatibilidade com navegadores