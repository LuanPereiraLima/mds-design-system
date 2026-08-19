# MDS — Multi-brand Design System

Design system multimarca construído sobre **Design Tokens (DTCG)**, com
**React + TypeScript**, **styled-components**, **Style Dictionary** e
**Storybook**.

Um tema concreto é uma **composição**: uma marca + um modo (claro/escuro). São
**8 marcas** (`mrv`, `sensia`, `luggo`, `mrvCo`, `class`, `mdc`, `urba`,
`superApp`) × **2 modos**, e o mesmo componente serve a todas — o que muda é o
valor por trás do nome do token, nunca o nome.

📖 **[Storybook](https://luanpereiralima.github.io/mds-design-system/)** — documentação viva, com seletor de marca e
modo na toolbar.

## Como usar

```tsx
import { BrandProvider, Button, Input } from 'mds-design-system';

<BrandProvider brand="mrv" theme="light">
  <Input placeholder="Seu nome" />
  <Button variant="primary">Enviar</Button>
</BrandProvider>;
```

Não há `.css` para importar: o `BrandProvider` injeta todo o CSS de tokens de
uma vez via `createGlobalStyle` e aplica `data-brand` / `data-theme` no
wrapper, ativando as custom properties da combinação escolhida.

## Componentes

| Grupo        | Componentes                                                                                  |
| ------------ | -------------------------------------------------------------------------------------------- |
| **Ações**    | `Button`                                                                                       |
| **Entrada**  | `Input`, `InputPassword`, `InputAction`, `Textarea`, `InputDropdown`, `InputCode`, `InputStepper`, `Dropzone` |
| **Seleção**  | `Checkbox`, `Radio`, `Selector`, `StepHelper`                                                   |

Todos os campos compartilham o mesmo padrão de validação: a prop `feedback`
(`success` \| `caution` \| `critical` \| `info`) marca o elemento com
`data-feedback` e colore borda e anel de foco com `var(--feedback)`; `invalid`
é atalho de `feedback="critical"` e também marca `aria-invalid`.

## Arquitetura de tokens

```
tokens/
  00-primitives/     Paleta crua, dimensões, famílias de fonte — sem noção de marca
  01-brands/<marca>/ Papéis de cor da marca + escala tipográfica própria
  01-themes/{light,dark}/  Mapeia os papéis da marca para a paleta crua
  02-semantics/      Famílias de papel (visual, feedback, neutral), sizing, tipografia
  03-components/     Tokens de componente (hoje: buttons e inputs)
```

A cadeia resolve assim:

```
Primitives  →  Brand           →  Semantics
paleta crua    marca × modo        nome final consumido
(hex bruto)    (aponta pra raw)    pelos componentes
```

`scripts/build-tokens.js` percorre essa cadeia e emite CSS custom properties em
`src/tokens/css/` — **gerado, não versionado**. Cada arquivo é escopado pelo
seletor onde suas referências resolvem (`[data-brand][data-theme]`,
`[data-feedback]`, `:root`), o que faz um único conjunto de declarações
cascatear por todas as marcas e modos.

> A página **Arquitetura → As 3 camadas** no Storybook traça a cadeia ao vivo
> para a marca e o modo escolhidos na toolbar.

## Scripts

| Comando                   | Descrição                                            |
| ------------------------- | ---------------------------------------------------- |
| `npm run tokens:build`    | Gera o CSS/TS de tokens a partir dos JSON            |
| `npm run storybook`       | Sobe o Storybook em `:6006`                          |
| `npm run build-storybook` | Build estático do Storybook                          |
| `npm run build`           | Gera a lib (bundle + tipos)                          |
| `npm run typecheck`       | Type-check sem emitir                                |
| `npm test`                | Testes (Vitest + Testing Library)                    |

`npm run tokens:build` roda automaticamente no `prepare`, então um
`npm install` já deixa o projeto pronto.

## Como adicionar uma marca

1. Crie `tokens/01-brands/<marca>/` com `01-brand.<marca>.tokens.json` e
   `00-fontScale.<marca>.tokens.json` (copie uma existente como base).
2. Acrescente as entradas da marca em `tokens/01-themes/{light,dark}/`.
3. Inclua o nome no array `BRANDS` em `scripts/build-tokens.js`.
4. Registre o nome nos três lugares que listam marcas: o tipo `Brand` em
   `src/theme/BrandProvider.tsx`, o array `brands` em `.storybook/preview.tsx`
   e o `BRANDS` em `src/docs/components/useBrandTheme.ts`.
5. `npm run tokens:build`.

## Desenvolvimento

Requer **Node 22**.

```bash
npm install
npm run storybook
```

### MCP

`.vscode/mcp.json` configura dois MCP servers para uso no editor: um de
memória (persistido em `ai/mcp-knowledge/memory.jsonl`, com o conhecimento
acumulado do projeto) e o `figma-developer-mcp`.

O token do Figma **não fica no arquivo** — é pedido pelo editor na primeira
execução e guardado no cofre dele. Se preferir, gere o seu em
_Figma → Settings → Personal access tokens_.
