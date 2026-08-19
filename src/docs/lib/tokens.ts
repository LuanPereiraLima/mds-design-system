// Fonte de dados da documentação (web-only). Lê os CSS já gerados por
// `npm run tokens:build` em `src/tokens/css/<marca>.<modo>.css` — o output
// real deste repositório — e expõe os valores resolvidos (hex/px) para as
// páginas. Não builda nada aqui.
//
// Categorias que o build atual ainda NÃO emite (tipografia, espaçamento,
// elevação, papéis semânticos agregados) ficam como grupos vazios: as páginas
// correspondentes renderizam sem quebrar até que esses tokens entrem no build.

export interface BrandInfo {
  key: string;
  label: string;
}

// Mesma lista/labels de scripts/build-tokens.js (BRANDS).
export const BRANDS: BrandInfo[] = [
  { key: 'mrv', label: 'MRV' },
  { key: 'sensia', label: 'Sensia' },
  { key: 'luggo', label: 'Luggo' },
  { key: 'mrvCo', label: 'CO' },
  { key: 'class', label: 'Class' },
  { key: 'mdc', label: 'MDC' },
  { key: 'urba', label: 'Urba' },
  { key: 'superApp', label: 'SuperApp' },
];

export const MODES = ['light', 'dark'] as const;
export type Mode = (typeof MODES)[number];

/** Mapa plano de token (camelCase) -> valor resolvido, mais os grupos
 * aninhados que as páginas referenciam. Grupos ainda não gerados pelo build
 * permanecem vazios. */
export interface Tokens {
  [key: string]: unknown;
  interface: Record<string, string>;
  global: Record<string, Record<string, unknown>>;
  gap: Record<string, string>;
  radii: { base: Record<string, string>; producao: Record<string, string> };
  breakpoint: Record<string, Record<string, unknown>>;
  Shadow: Record<string, unknown[]>;
  visual: Record<string, Record<string, string>>;
  feedback: Record<string, Record<string, string>>;
  neutral: Record<string, Record<string, string>>;
  semantic: {
    visual: Record<string, Record<string, string>>;
    feedback: Record<string, Record<string, string>>;
    neutral: Record<string, Record<string, string>>;
  };
}

const cssModules = import.meta.glob('../../tokens/css/*.css', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

// Só arquivos <marca>.<modo>.css (ignora button.css / input.css, que não têm modo).
const FILE_RE = /\/([a-zA-Z]+)\.(light|dark)\.css$/;

const kebabToCamel = (s: string): string =>
  s.replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase());

/** Extrai `--nome: valor;` de um CSS bruto num mapa camelCase -> valor. */
function parseCssVars(css: string): Record<string, string> {
  const out: Record<string, string> = {};
  const re = /--([a-z0-9-]+)\s*:\s*([^;]+);/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(css)) !== null) {
    out[kebabToCamel(match[1])] = match[2].trim();
  }
  return out;
}

/** Grupos aninhados ainda não emitidos pelo build (evitam crash nas páginas). */
function emptyGroups() {
  return {
    interface: {} as Record<string, string>,
    global: {} as Record<string, Record<string, unknown>>,
    gap: {} as Record<string, string>,
    radii: { base: {}, producao: {} } as Tokens['radii'],
    breakpoint: {} as Record<string, Record<string, unknown>>,
    Shadow: {} as Record<string, unknown[]>,
    visual: {} as Record<string, Record<string, string>>,
    feedback: {} as Record<string, Record<string, string>>,
    neutral: {} as Record<string, Record<string, string>>,
    semantic: { visual: {}, feedback: {}, neutral: {} } as Tokens['semantic'],
  };
}

const TOKENS: Record<string, Record<string, Tokens>> = {};
const CSS: Record<string, Record<string, string>> = {};

for (const [path, raw] of Object.entries(cssModules)) {
  const match = path.match(FILE_RE);
  if (!match) continue;
  const [, brand, mode] = match;
  CSS[brand] ??= {};
  CSS[brand][mode] = raw;
  TOKENS[brand] ??= {};
  TOKENS[brand][mode] = { ...parseCssVars(raw), ...emptyGroups() };
}

export function getTokens(brand: string, mode: string): Tokens {
  const tokens = TOKENS[brand]?.[mode];
  if (!tokens) {
    throw new Error(
      `Tokens não encontrados para marca="${brand}" modo="${mode}". Rode "npm run tokens:build".`,
    );
  }
  return tokens;
}

export function getCss(brand: string, mode: string): string {
  const css = CSS[brand]?.[mode];
  if (!css) {
    throw new Error(
      `CSS não encontrado para marca="${brand}" modo="${mode}". Rode "npm run tokens:build".`,
    );
  }
  return css;
}

export function brandLabel(key: string): string {
  return BRANDS.find((b) => b.key === key)?.label ?? key;
}
