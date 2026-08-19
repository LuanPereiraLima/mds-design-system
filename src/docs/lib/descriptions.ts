// Duas fontes de descrição, nesta ordem de precedência:
//
//  1. `$description` lido direto dos JSONs de tokens/ (o dist/ não carrega essa
//     metadata). Hoje só `02-semantics/styles/color.styles.tokens.json` traz
//     `$description`, e as chaves dele são nomes de estilo em português
//     ("branco", "cinza 15") — não batem com nome de papel, então na prática
//     essa fonte ainda não alimenta as páginas de cor.
//  2. `HANDOFF_DESCRIPTIONS`: descrições curadas dos papéis semânticos,
//     transcritas do handoff do protótipo Figma "MDS - Site".
//
// Componentes que exibem descrição devem tolerar a ausência dela (ver
// `hasAnyDescription`) — famílias de papel (`visual`, `onVisual`...) não têm
// entrada, só os papéis concretos de marca/neutra/feedback.

type TokenNode = { $description?: string; [key: string]: unknown };

const sourceFiles = import.meta.glob<Record<string, unknown>>('../../../tokens/**/*.tokens.json', {
  eager: true,
  import: 'default',
});

// Mapa "último segmento do caminho -> descrição". Simplificação deliberada:
// como as descrições hoje só existem num arquivo fora de escopo, não vale a
// pena reconstruir o grafo de alias só pra casar caminho fonte -> caminho
// resolvido em dist/. Se novas descrições forem adicionadas aos arquivos que
// o build usa, esse mapa passa a alimentar as tabelas automaticamente.
const DESCRIPTIONS: Record<string, string> = {};

function walk(node: unknown, lastKey: string | undefined) {
  if (typeof node !== 'object' || node === null) return;
  const obj = node as TokenNode;
  if (typeof obj.$description === 'string' && lastKey) {
    DESCRIPTIONS[lastKey] = obj.$description;
  }
  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith('$')) continue;
    walk(value, key);
  }
}

for (const data of Object.values(sourceFiles)) {
  walk(data, undefined);
}

// Descrições curadas dos 67 papéis semânticos de cor (marca/neutra/feedback),
// transcritas do handoff de conteúdo do protótipo Figma "MDS - Site"
// (validado com o time de design) — ainda não existem como `$description`
// nos JSONs de origem. Servem de fallback: se um dia essas descrições forem
// adicionadas aos arquivos que o build usa, o walk() acima passa a
// alimentar DESCRIPTIONS diretamente e este dicionário fica redundante (mas
// inofensivo, já que só é consultado quando DESCRIPTIONS não tem a chave).
const HANDOFF_DESCRIPTIONS: Record<string, string> = {
  // Marca (visual)
  primary: 'Cor principal da marca. Usada para composições primárias (ex.: botões principais), componentes de alto destaque e seleção ativa.',
  onPrimary: 'Cor de textos e ícones (ou outros elementos) que aparecem por cima de elementos com fundo primary.',
  primaryContainer: 'Fundo de menor ênfase para elementos primários (ex.: um botão tonal ou card com cor da marca). Pode ser aplicado em áreas dentro de outras áreas com fundo primary ou neutro.',
  onPrimaryContainer: 'Cor de textos e ícones (ou outros elementos) aplicados sobre o fundo primaryContainer.',
  primarySubtle: 'Variação suavizada da cor primária. Usada para aplicações compostas discretas.',
  primaryMuted: 'Variação esmaecida e opaca da cor primária. Usada para aplicações compostas neutras.',
  secondary: 'Cor de apoio. Usada para botões secundários, chips, controles de seleção e elementos que precisam de destaque diferente do primário.',
  onSecondary: 'Cor de textos e ícones (ou outros elementos) que aparecem por cima de elementos com fundo secondary.',
  secondaryContainer: 'Fundo de menor ênfase para elementos secundários ou de apoio. Pode ser aplicado em áreas dentro de outras áreas com fundo secondary ou neutro.',
  onSecondaryContainer: 'Cor de textos e ícones (ou outros elementos) aplicados sobre o fundo secondaryContainer.',
  secondarySubtle: 'Variação suavizada da cor secundária. Usada para aplicações compostas discretas.',
  secondaryMuted: 'Variação esmaecida e opaca da cor secundária. Usada para aplicações compostas neutras.',
  tertiary: 'Cor de apoio terciário. Usada para equilibrar o design e chamar atenção para elementos únicos.',
  onTertiary: 'Cor de textos e ícones (ou outros elementos) que aparecem por cima de elementos com fundo tertiary.',
  tertiaryContainer: 'Fundo de menor ênfase para elementos extras ou de apoio. Pode ser aplicado em áreas dentro de outras áreas com fundo tertiary ou neutro.',
  onTertiaryContainer: 'Cor de textos e ícones (ou outros elementos) aplicados sobre o fundo tertiaryContainer.',
  tertiarySubtle: 'Variação suavizada da cor terciária. Usada para aplicações compostas discretas.',
  tertiaryMuted: 'Variação esmaecida e opaca da cor terciária. Usada para aplicações compostas neutras.',
  complementary: 'Cor de apoio complementar. Usada para equilibrar o design e chamar atenção para elementos únicos.',
  onComplementary: 'Cor de textos e ícones (ou outros elementos) que aparecem por cima de elementos com fundo complementary.',
  complementaryContainer: 'Fundo de menor ênfase para elementos extras ou de apoio. Pode ser aplicado em áreas dentro de outras áreas com fundo complementary ou neutro.',
  onComplementaryContainer: 'Cor de textos e ícones (ou outros elementos) aplicados sobre o fundo complementaryContainer.',
  complementarySubtle: 'Variação suavizada da cor complementar. Usada para aplicações compostas discretas.',
  complementaryMuted: 'Variação esmaecida e opaca da cor complementar. Usada para aplicações compostas neutras.',
  // Neutras e inversas
  background: 'A cor de fundo principal da tela/página da aplicação.',
  backgroundSubtle: 'Variação mais suave do fundo principal, usada para criar blocos de respiro ou faixas diferenciadas na página.',
  backgroundMuted: 'Variação mais neutra de fundo, usada para criar blocos de respiro ou faixas diferenciadas na página.',
  onBackground: 'A cor padrão (com o melhor contraste) para o texto principal e ícones gerais lidos diretamente sobre o background.',
  subtleOnBackground: 'Cor para textos secundários (textos de apoio, legendas, placeholders) sobre background.',
  mutedOnBackground: 'Cor para textos desabilitados (textos de apoio, legendas, placeholders) sobre background.',
  surface: 'Cor de fundo para componentes elevados (como Cards, Modais, Menus Dropdown e Sheets).',
  surfaceSubtle: 'Variação mais suave da superfície principal, usada para criar elevações diferenciadas na página.',
  surfaceMuted: 'Variação mais neutra de superfície, usada para criar elevações diferenciadas na página.',
  onSurface: 'A cor padrão (com o melhor contraste) para o texto principal e ícones gerais lidos diretamente sobre o surface.',
  subtleOnSurface: 'Cor para textos secundários (textos de apoio, legendas, placeholders) sobre surface.',
  mutedOnSurface: 'Cor para textos desabilitados (textos de apoio, legendas, placeholders) sobre surface.',
  outline: 'Cor principal para contornos, divisores e bordas de componentes (ex.: campos de formulário, linhas de tabelas).',
  outlineMuted: 'Bordas mais discretas, usadas para separadores sutis que não devem chamar atenção.',
  outlineEmphasized: 'Bordas de alto contraste, usadas para dar foco a um componente.',
  inverse: 'Cor auxiliar "inversa" genérica.',
  inversePrimary: 'Cor auxiliar "inversa" à primary.',
  inverseSecondary: 'Cor auxiliar "inversa" à secondary.',
  shadow: 'Para dar profundidade e destacar elementos em relação à camada inferior.',
  // Feedback
  attention: 'Indica informações importantes, notificações, foco ou avisos não críticos.',
  onAttention: 'Cor de textos e ícones (ou outros elementos) que aparecem por cima de elementos com fundo attention.',
  attentionContainer: 'Fundo de menor ênfase para elementos extras ou de apoio. Pode ser aplicado em áreas dentro de outras áreas com fundo attention ou neutro.',
  onAttentionContainer: 'Cor de textos e ícones (ou outros elementos) aplicados sobre o fundo attentionContainer.',
  attentionSubtle: 'Variação suavizada da cor attention. Usada para aplicações compostas discretas.',
  attentionMuted: 'Variação esmaecida e opaca da cor attention. Usada para aplicações compostas neutras.',
  success: 'Indica confirmação, aprovação ou sucesso em uma ação.',
  onSuccess: 'Cor de textos e ícones (ou outros elementos) que aparecem por cima de elementos com fundo success.',
  successContainer: 'Fundo de menor ênfase para elementos extras ou de apoio. Pode ser aplicado em áreas dentro de outras áreas com fundo success ou neutro.',
  onSuccessContainer: 'Cor de textos e ícones (ou outros elementos) aplicados sobre o fundo successContainer.',
  successSubtle: 'Variação suavizada da cor success. Usada para aplicações compostas discretas.',
  successMuted: 'Variação esmaecida e opaca da cor success. Usada para aplicações compostas neutras.',
  caution: 'Indica advertências, alertas preventivos ou ações que requerem cuidado antes de prosseguir.',
  onCaution: 'Cor de textos e ícones (ou outros elementos) que aparecem por cima de elementos com fundo caution.',
  cautionContainer: 'Fundo de menor ênfase para elementos extras ou de apoio. Pode ser aplicado em áreas dentro de outras áreas com fundo caution ou neutro.',
  onCautionContainer: 'Cor de textos e ícones (ou outros elementos) aplicados sobre o fundo cautionContainer.',
  cautionSubtle: 'Variação suavizada da cor caution. Usada para aplicações compostas discretas.',
  cautionMuted: 'Variação esmaecida e opaca da cor caution. Usada para aplicações compostas neutras.',
  critical: 'Indica erros severos, falhas no sistema ou ações destrutivas irreversíveis.',
  onCritical: 'Cor de textos e ícones (ou outros elementos) que aparecem por cima de elementos com fundo critical.',
  criticalContainer: 'Fundo de menor ênfase para elementos extras ou de apoio. Pode ser aplicado em áreas dentro de outras áreas com fundo critical ou neutro.',
  onCriticalContainer: 'Cor de textos e ícones (ou outros elementos) aplicados sobre o fundo criticalContainer.',
  criticalSubtle: 'Variação suavizada da cor critical. Usada para aplicações compostas discretas.',
  criticalMuted: 'Variação esmaecida e opaca da cor critical. Usada para aplicações compostas neutras.',
};

export function getDescription(tokenName: string): string | undefined {
  return DESCRIPTIONS[tokenName] ?? HANDOFF_DESCRIPTIONS[tokenName];
}

export function hasAnyDescription(tokenNames: string[]): boolean {
  return tokenNames.some((name) => Boolean(DESCRIPTIONS[name] ?? HANDOFF_DESCRIPTIONS[name]));
}
