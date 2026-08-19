// Traça a cadeia de resolução de um token de cor de marca (ex.: "primary")
// através das camadas Brand -> Primitives, lendo os JSONs de origem direto
// (não o dist/, que só guarda o valor final já resolvido). Usado pela página
// de arquitetura pra mostrar como o alias realmente encadeia pra marca/modo
// ativos. Só cobre tokens de cor do flatten de `01-brand.<marca>` — é a
// camada que expõe os nomes agnósticos de marca (primary, onSurface,
// attention...) documentados como "Semantics" nesta seção.

type TokenNode = { $type?: string; $value?: unknown };

const brandFiles = import.meta.glob<Record<string, TokenNode>>(
  '../../../tokens/01-brands/*/01-brand.*.tokens.json',
  { eager: true, import: 'default' },
);
const themeFiles = import.meta.glob<Record<string, unknown>>(
  '../../../tokens/01-themes/*/01-theme.*.tokens.json',
  { eager: true, import: 'default' },
);
const rawFile = Object.values(
  import.meta.glob<Record<string, unknown>>('../../../tokens/00-primitives/colors/00-primitive.raw.tokens.json', {
    eager: true,
    import: 'default',
  }),
)[0];

function findByBrand<T>(files: Record<string, T>, brandKey: string): T | undefined {
  const entry = Object.entries(files).find(([path]) => path.includes(`/${brandKey}/`) || path.endsWith(`.${brandKey}.tokens.json`));
  return entry?.[1];
}

function findByMode<T>(files: Record<string, T>, mode: string): T | undefined {
  const entry = Object.entries(files).find(([path]) => path.includes(`/${mode}/`));
  return entry?.[1];
}

function aliasPath(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const match = value.match(/^\{(.+)\}$/);
  return match?.[1];
}

function getByDotPath(obj: unknown, dotPath: string): TokenNode | undefined {
  return dotPath.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object') return (acc as Record<string, unknown>)[key];
    return undefined;
  }, obj) as TokenNode | undefined;
}

export interface ChainStep {
  layer: 'Semantics' | 'Brand' | 'Primitives';
  path: string;
  value: string;
}

/** Retorna os 3 elos (Semantics -> Brand -> Primitives) pro campo de cor
 * `fieldName` (ex.: "primary", "onSurface", "attention") na marca/modo
 * ativos, ou `undefined` se o campo não existir/não for um alias de cor
 * simples (ex.: brandModifier, que é string literal, não alias). */
export function getColorChain(fieldName: string, brandKey: string, mode: string): ChainStep[] | undefined {
  const brandFile = findByBrand(brandFiles, brandKey);
  const brandNode = brandFile?.[fieldName];
  const brandAlias = aliasPath(brandNode?.$value);
  if (!brandAlias) return undefined;

  const themeFile = findByMode(themeFiles, mode);
  const themeNode = getByDotPath(themeFile, brandAlias);
  const themeAlias = aliasPath(themeNode?.$value);
  if (!themeAlias) return undefined;

  const rawNode = getByDotPath(rawFile, themeAlias);
  const finalValue = typeof rawNode?.$value === 'string' ? rawNode.$value : undefined;
  if (!finalValue) return undefined;

  return [
    { layer: 'Semantics', path: fieldName, value: finalValue },
    { layer: 'Brand', path: brandAlias, value: finalValue },
    { layer: 'Primitives', path: themeAlias, value: finalValue },
  ];
}
