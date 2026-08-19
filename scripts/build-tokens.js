import StyleDictionary from 'style-dictionary';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const T = (p) => resolve(root, p);

/**
 * v4 tokens are a Figma Variables / Tokens Studio export (collections + modes).
 * A concrete theme is a COMPOSITION: pick one brand + one theme (light/dark).
 *
 * We generate two kinds of CSS:
 *  1. Base palette, per brand x theme: the brand's flat semantic tokens resolved
 *     to hex, scoped under [data-brand][data-theme].
 *  2. Button tokens, ONCE: each button token points at a base var (e.g.
 *     var(--primary)) so it cascades per brand/theme automatically. The button's
 *     visual "channel" (primary/secondary/...) selects which base var is used.
 */
const BRANDS = ['mrv', 'sensia', 'luggo', 'mrvCo', 'class', 'mdc', 'urba', 'superApp'];
const THEMES = ['light', 'dark'];
const VISUAL_CHANNELS = ['primary', 'secondary', 'tertiary', 'complementary'];

const OUT = T('src/tokens/css');
const RAW = T('tokens/00-primitives/colors/00-primitive.raw.tokens.json');
const brandFile = (b) => T(`tokens/01-brands/${b}/01-brand.${b}.tokens.json`);
const themeFile = (t) => T(`tokens/01-themes/${t}/01-theme.${t}.tokens.json`);
// The delivery ships three colour "tones" of the same button structure. Each
// one carries all three intent namespaces (brand / feedback / neutral).
const BUTTON_STYLES = {
  default: T('tokens/03-components/buttons/01-button.style.default.tokens.json'),
  alternate: T('tokens/03-components/buttons/01-button.style.alternate.tokens.json'),
  inverse: T('tokens/03-components/buttons/01-button.style.inverse.tokens.json'),
};
const BUTTON_RADII = {
  small: T('tokens/03-components/buttons/00-button.radius.small.tokens.json'),
  default: T('tokens/03-components/buttons/00-button.radius.default.tokens.json'),
  large: T('tokens/03-components/buttons/00-button.radius.large.tokens.json'),
  full: T('tokens/03-components/buttons/00-button.radius.full.tokens.json'),
};
const DIM_PRIMITIVES = T('tokens/00-primitives/dimensions/00-primitive.global.tokens.json');
const RADII = T('tokens/02-semantics/sizing/01-radii.base.tokens.json');
const BUTTON_SIZES = ['small', 'mediumS', 'mediumL', 'large'];
const buttonSizeFile = (size) => T(`tokens/03-components/buttons/00-button.size.${size}.tokens.json`);
const INPUT_RADII = {
  small: T('tokens/03-components/inputs/input.radius.small.tokens.json'),
  default: T('tokens/03-components/inputs/input.radius.default.tokens.json'),
  large: T('tokens/03-components/inputs/input.radius.large.tokens.json'),
  full: T('tokens/03-components/inputs/input.radius.full.tokens.json'),
};

// Sizing (brand-agnostic dimension tokens)
const SPACING = T('tokens/02-semantics/sizing/01-spacing.global.tokens.json');
const BORDER = T('tokens/02-semantics/sizing/01-border.global.tokens.json');
const RADII_PROD = T('tokens/02-semantics/sizing/01-radii.producao.tokens.json');
const BREAKPOINTS = ['mobile', 'tablet', 'desktop', 'wide'].map((b) => [
  b,
  T(`tokens/02-semantics/sizing/02-breakpoint.${b}.tokens.json`),
]);

// Elevation (shadow geometry + brand `shadow` color via var)
const EFFECTS = T('tokens/00-primitives/effects/effect.styles.tokens.json');

// Typography (composite text tokens resolved against a per-brand font scale)
const TYPOGRAPHY = T('tokens/02-semantics/text/01-typography.global.tokens.json');
// Every brand now ships its own font scale, co-located with its brand tokens
// (previously a shared set under 00-primitives/typographies with only 3 modes).
const fontScaleFile = (brand) => T(`tokens/01-brands/${brand}/00-fontScale.${brand}.tokens.json`);

// Semantic role families (each role aliases existing brand color vars)
const SEMANTIC_FAMILIES = [
  { family: 'visual', roles: ['primary', 'secondary', 'tertiary', 'complementary'] },
  { family: 'feedback', roles: ['success', 'caution', 'critical', 'info'] },
  { family: 'neutral', roles: ['background', 'outline', 'surface'] },
];
const roleFile = (family, role) => T(`tokens/02-semantics/${family}/03-${family}.${role}.tokens.json`);
const semanticAggFile = (family) => T(`tokens/02-semantics/${family}/02-semantic.${family}.tokens.json`);

/** Extract the inner name of a `{alias}` reference, or null for a literal. */
const derefName = (value) => /^\{(.+)\}$/.exec(String(value))?.[1] ?? null;

const norm = (p) => p.replace(/\\/g, '/');
const fromBrand = (t) => norm(t.filePath).includes('/01-brands/');

/** camelCase / nested path -> kebab-case, matching Style Dictionary's css names. */
const kebab = (s) =>
  s
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();

// --- 1. Base palette per brand x theme --------------------------------------
StyleDictionary.registerFormat({
  name: 'ts/css-var-map',
  format: ({ dictionary }) => {
    const seen = new Set();
    const entries = [];
    for (const t of dictionary.allTokens) {
      if (!fromBrand(t) || seen.has(t.name)) continue;
      seen.add(t.name);
      entries.push(`  '${t.name}': 'var(--${t.name})',`);
    }
    return (
      '// AUTO-GENERATED by scripts/build-tokens.js — do not edit by hand.\n' +
      `export const tokens = {\n${entries.join('\n')}\n} as const;\n\n` +
      'export type TokenName = keyof typeof tokens;\n'
    );
  },
});

async function buildBase(brand, theme, { withTs }) {
  const selector = `[data-brand="${brand}"][data-theme="${theme}"]`;
  const sd = new StyleDictionary({
    log: { verbosity: 'silent', warnings: 'disabled' },
    source: [RAW, themeFile(theme), brandFile(brand)],
    platforms: {
      css: {
        transformGroup: 'css',
        buildPath: OUT + '/',
        files: [
          {
            destination: `${brand}.${theme}.css`,
            format: 'css/variables',
            filter: fromBrand,
            options: { selector, outputReferences: false },
          },
        ],
      },
      ...(withTs
        ? {
            ts: {
              transformGroup: 'css',
              buildPath: T('src/tokens') + '/',
              files: [{ destination: 'index.ts', format: 'ts/css-var-map' }],
            },
          }
        : {}),
    },
  });
  await sd.buildAllPlatforms();
}

// --- 2. Button tokens (once, cascading via base vars) ------------------------
/**
 * Map a `{reference}` used by the button style to a base CSS var.
 *
 * Only the `brand` namespace is written against visual-channel placeholders
 * (`{visual}`, `{onVisual}`, ...), which resolve differently per channel.
 * Every other ref already names a base var, so it just gets kebab-cased.
 */
function refToVar(ref, channel) {
  const channelMap = {
    visual: channel,
    onVisual: `on-${channel}`,
    visualContainer: `${channel}-container`,
    onVisualContainer: `on-${channel}-container`,
    visualSubtle: `${channel}-subtle`,
    visualMuted: `${channel}-muted`,
  };
  const name = channelMap[ref] ?? kebab(ref);
  return `var(--${name})`;
}

/** Flatten a style namespace's leaves into [pathArray, refString]. */
function flattenLeaves(node, path = [], out = []) {
  if (node && typeof node === 'object' && '$value' in node) {
    out.push([path, node.$value]);
    return out;
  }
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith('$')) continue;
    flattenLeaves(v, [...path, k], out);
  }
  return out;
}

/**
 * Emits every button colour token: 3 tones x 3 intents x 3 appearances x 6
 * states. Naming is `--button-[<tone>-]<scope>-<appearance>-<state>-<prop>`,
 * where `<scope>` is a visual channel for the `brand` intent and the intent
 * name itself for `feedback` / `neutral`. The `default` tone keeps unprefixed
 * names, so the vars the component already consumes are unchanged.
 *
 * Nothing is resolved to a literal colour here: each token points at a base
 * var, so a single declaration cascades across every brand and theme.
 *
 * The `feedback` intent resolves against whichever `[data-feedback="<role>"]`
 * scope is active (see semantics.css) — the same set of vars serves success,
 * caution, critical and info.
 */
function buildButtonCss() {
  // Two scopes, for the same reason the shadows are scoped the way they are: a
  // custom property whose value references an undefined var is invalid at
  // computed-value time, so each declaration has to live where the var it
  // points at actually resolves.
  //
  //  - brand/neutral -> the brand+theme element, where the base palette lives.
  //  - feedback      -> any `[data-feedback]` element, since `--feedback` is
  //                     only defined by the `[data-feedback="<role>"]` rules in
  //                     semantics.css. The base vars these also reference
  //                     (`--outline-muted`, ...) inherit down from the brand
  //                     scope, so they still resolve there.
  const scoped = { '[data-brand][data-theme]': [], '[data-feedback]': [] };

  for (const [tone, file] of Object.entries(BUTTON_STYLES)) {
    const style = JSON.parse(readFileSync(file, 'utf8'));
    const tonePart = tone === 'default' ? '' : `${tone}-`;
    for (const [intent, node] of Object.entries(style)) {
      const leaves = flattenLeaves(node);
      const scopes = intent === 'brand' ? VISUAL_CHANNELS : [intent];
      const target = intent === 'feedback' ? scoped['[data-feedback]'] : scoped['[data-brand][data-theme]'];
      for (const scope of scopes) {
        target.push(`  /* ${tone} / ${intent}${intent === 'brand' ? ` / ${scope}` : ''} */`);
        for (const [path, value] of leaves) {
          const name = path.map(kebab).join('-');
          const ref = derefName(value);
          target.push(`  --button-${tonePart}${scope}-${name}: ${ref ? refToVar(ref, scope) : value};`);
        }
      }
    }
  }

  const blocks = Object.entries(scoped).map(([selector, lines]) => `${selector} {\n${lines.join('\n')}\n}`);

  // Radii are brand-agnostic, so they sit on :root in the same file.
  const radii = Object.entries(resolveRadii(BUTTON_RADII)).map(
    ([name, px]) => `  --button-radius-${name}: ${px};`,
  );
  blocks.push(`:root {\n${radii.join('\n')}\n}`);

  writeFileSync(resolve(OUT, 'button.css'), blocks.join('\n\n') + '\n');
  console.log('\u2713 button.css');
}

// --- 3. Input tokens (radius, resolved to px) --------------------------------
/** Reads a `{ radius: { $value } }` (or single-token) file's `$value`. */
const tokenValue = (obj) =>
  '$value' in obj ? obj.$value : obj[Object.keys(obj).find((k) => !k.startsWith('$'))].$value;

/**
 * Resolve a component's radius ref chain (component -> radii.base -> dimension
 * primitive) down to px. Shared by the button and the input, which both point
 * at the same `radii.base` scale.
 */
function resolveRadii(files) {
  const dims = JSON.parse(readFileSync(DIM_PRIMITIVES, 'utf8'));
  const radii = JSON.parse(readFileSync(RADII, 'utf8'));
  const out = {};
  for (const [name, file] of Object.entries(files)) {
    const raw = JSON.parse(readFileSync(file, 'utf8'));
    let ref = derefName(tokenValue(raw)); // e.g. "medium"
    if (ref && radii[ref]) ref = derefName(radii[ref].$value); // e.g. "2"
    out[name] = ref && dims[ref] ? dims[ref].$value : tokenValue(raw);
  }
  return out;
}

function buildInputCss() {
  const lines = Object.entries(resolveRadii(INPUT_RADII)).map(
    ([name, px]) => `  --input-radius-${name}: ${px};`,
  );

  // Input has no dedicated color tokens in the delivery; it reuses the base
  // semantic palette (surface / on-surface / outline / primary / critical),
  // which already cascades per brand + theme.
  const css = `:root {\n${lines.join('\n')}\n}\n`;
  writeFileSync(resolve(OUT, 'input.css'), css);
  console.log('\u2713 input.css');
}

// --- 4. Sizing (spacing, border, radii, breakpoints) ------------------------
/**
 * Brand-agnostic dimension tokens resolved to px against the dimension
 * primitives. Emitted on `:root` since none of these depend on brand/theme.
 */
function buildSizingCss() {
  const dims = JSON.parse(readFileSync(DIM_PRIMITIVES, 'utf8'));
  const dimPx = (key) => dims[key]?.$value ?? null;
  const resolve1 = (value) => {
    const ref = derefName(value);
    return ref && dimPx(ref) != null ? dimPx(ref) : value;
  };

  const lines = [];

  const spacing = JSON.parse(readFileSync(SPACING, 'utf8'));
  lines.push('  /* spacing (gap.*) */');
  for (const [name, tok] of Object.entries(spacing.gap)) {
    lines.push(`  --gap-${kebab(name)}: ${resolve1(tok.$value)};`);
  }

  const border = JSON.parse(readFileSync(BORDER, 'utf8'));
  lines.push('  /* border widths */');
  for (const [name, tok] of Object.entries(border)) {
    lines.push(`  --border-${kebab(name)}: ${resolve1(tok.$value)};`);
  }

  for (const [prefix, file] of [['radii', RADII], ['radii-producao', RADII_PROD]]) {
    const radii = JSON.parse(readFileSync(file, 'utf8'));
    lines.push(`  /* ${prefix} */`);
    for (const [name, tok] of Object.entries(radii)) {
      lines.push(`  --${prefix}-${kebab(name)}: ${resolve1(tok.$value)};`);
    }
  }

  lines.push('  /* breakpoints */');
  for (const [bp, file] of BREAKPOINTS) {
    const data = JSON.parse(readFileSync(file, 'utf8'));
    for (const [field, tok] of Object.entries(data)) {
      if (tok.$type === 'string') continue;
      lines.push(`  --breakpoint-${bp}-${kebab(field)}: ${tok.$value};`);
    }
  }

  writeFileSync(resolve(OUT, 'sizing.css'), `:root {\n${lines.join('\n')}\n}\n`);
  console.log('\u2713 sizing.css');
}

// --- 5. Elevation (shadows) --------------------------------------------------
/**
 * Shadow tokens keep fixed geometry but point their color at the brand's
 * `shadow` var, so `var(--shadow-01)` re-tints per brand/theme automatically.
 */
function buildElevationCss() {
  const effects = JSON.parse(readFileSync(EFFECTS, 'utf8'));
  const lines = [];
  for (const [level, tok] of Object.entries(effects.Shadow ?? {})) {
    const layers = Array.isArray(tok.$value) ? tok.$value : [tok.$value];
    const css = layers
      .map((l) => {
        const colorRef = derefName(l.color);
        const color = colorRef ? `var(--${kebab(colorRef)})` : l.color;
        return `${l.offsetX} ${l.offsetY} ${l.blur} ${l.spread} ${color}`;
      })
      .join(', ');
    lines.push(`  --shadow-${level}: ${css};`);
  }
  // Scoped to `[data-brand][data-theme]` (not `:root`) on purpose: the shadow
  // color is `var(--shadow)`, which only exists inside a brand/theme scope. If
  // these composites lived on `:root`, `var(--shadow)` would be undefined there,
  // making each `--shadow-NN` invalid-at-computed-value-time (empty) and that
  // empty value would inherit everywhere. Declaring them where `--shadow` is
  // defined lets the color resolve and stay reactive to brand/theme.
  writeFileSync(resolve(OUT, 'elevation.css'), `[data-brand][data-theme] {\n${lines.join('\n')}\n}\n`);
  console.log('\u2713 elevation.css');
}

// --- 6. Typography (composite text tokens, per brand) ------------------------
/**
 * `text/typography.global` roles x sizes are composite tokens whose fields
 * reference an (unqualified) font scale. We resolve each field against the
 * active brand's scale and emit long-hand vars per role/size, scoped by brand.
 */
function buildTypographyCss() {
  const typo = JSON.parse(readFileSync(TYPOGRAPHY, 'utf8'));
  const loadScale = (brand) => JSON.parse(readFileSync(fontScaleFile(brand), 'utf8'));
  const resolveField = (scale, value) => {
    const ref = derefName(value);
    if (!ref) return value;
    if (ref === 'fontFamily') return scale.family?.primary?.$value ?? value; // primary is the default channel
    const [group, key] = ref.split('.');
    return scale[group]?.[key]?.$value ?? value;
  };

  const blocks = [];
  for (const brand of BRANDS) {
    const scale = loadScale(brand);
    const lines = [];
    for (const [role, sizes] of Object.entries(typo)) {
      for (const [size, comp] of Object.entries(sizes)) {
        const base = `--typography-${kebab(role)}-${kebab(size)}`;
        lines.push(`  ${base}-font-family: "${resolveField(scale, comp.fontFamily?.$value)}";`);
        lines.push(`  ${base}-font-weight: ${resolveField(scale, comp.fontWeight?.$value)};`);
        lines.push(`  ${base}-font-size: ${resolveField(scale, comp.fontSize?.$value)};`);
        lines.push(`  ${base}-line-height: ${resolveField(scale, comp.lineHeight?.$value)};`);
        lines.push(`  ${base}-letter-spacing: ${resolveField(scale, comp.kerning?.$value)};`);
      }
    }
    blocks.push(`[data-brand="${brand}"] {\n${lines.join('\n')}\n}`);
  }
  writeFileSync(resolve(OUT, 'typography.css'), blocks.join('\n\n') + '\n');
  console.log('\u2713 typography.css');
}

// --- 7. Semantic role families (visual / feedback / neutral) -----------------
/**
 * Each role file aliases a family field (`visual`, `onVisual`, ...) to an
 * existing brand color var. Emitting them under `[data-<family>="<role>"]`
 * selectors lets a component swap family + role at runtime while the value
 * still cascades per brand/theme. The aggregated form (`--semantic*`) sits
 * under `[data-semantic="<family>"]`.
 */
function buildSemanticRolesCss() {
  const colorVars = (data) => {
    const lines = [];
    for (const [field, tok] of Object.entries(data)) {
      if (tok.$type !== 'color') continue;
      const ref = derefName(tok.$value);
      const value = ref ? `var(--${kebab(ref)})` : tok.$value;
      lines.push(`  --${kebab(field)}: ${value};`);
    }
    return lines;
  };

  const blocks = [];
  for (const { family, roles } of SEMANTIC_FAMILIES) {
    blocks.push(`/* ${family} family */`);
    for (const role of roles) {
      const data = JSON.parse(readFileSync(roleFile(family, role), 'utf8'));
      blocks.push(`[data-${family}="${role}"] {\n${colorVars(data).join('\n')}\n}`);
    }
    const agg = JSON.parse(readFileSync(semanticAggFile(family), 'utf8'));
    blocks.push(`[data-semantic="${family}"] {\n${colorVars(agg).join('\n')}\n}`);
  }
  writeFileSync(resolve(OUT, 'semantics.css'), blocks.join('\n\n') + '\n');
  console.log('\u2713 semantics.css');
}

// --- 8. Button sizes (dimension chain, per brand) ----------------------------
/**
 * Size tokens pull from three sources: the spacing scale (`gap.*`,
 * `inset-deprecated.*`), the brand's font scale (`size.*`, `lineHeight.*`,
 * `weight.*`) and the dimension primitives they bottom out in.
 *
 * This chain was unresolvable in the previous delivery — that export had lost
 * the decimal dimension keys ({0_5}, {2_5}, ...), which is why the component
 * still hardcodes its sizes in px. The current export restores them, so the
 * real values are emitted here. Scoped per brand because the font scale is a
 * brand asset, even though every brand currently ships the same metrics.
 */
function buildButtonSizeCss() {
  const dims = JSON.parse(readFileSync(DIM_PRIMITIVES, 'utf8'));
  const spacing = JSON.parse(readFileSync(SPACING, 'utf8'));

  /** Walk a dotted ref through the sources that can define it. */
  const lookup = (ref, scale) => {
    for (const source of [spacing, scale, dims]) {
      let node = source;
      for (const part of ref.split('.')) {
        if (node && typeof node === 'object' && part in node) node = node[part];
        else { node = null; break; }
      }
      if (node && typeof node === 'object' && '$value' in node) return node.$value;
    }
    return null;
  };

  /** Follow a ref chain to its literal value (refs nest up to a few levels). */
  const resolveDeep = (value, scale, depth = 0) => {
    const ref = derefName(value);
    if (!ref || depth > 6) return value;
    const next = lookup(ref, scale);
    return next == null ? value : resolveDeep(next, scale, depth + 1);
  };

  const blocks = [];
  for (const brand of BRANDS) {
    const scale = JSON.parse(readFileSync(fontScaleFile(brand), 'utf8'));
    const lines = [];
    for (const size of BUTTON_SIZES) {
      const tokens = JSON.parse(readFileSync(buttonSizeFile(size), 'utf8'));
      for (const [field, tok] of Object.entries(tokens)) {
        lines.push(`  --button-size-${kebab(size)}-${kebab(field)}: ${resolveDeep(tok.$value, scale)};`);
      }
    }
    blocks.push(`[data-brand="${brand}"] {\n${lines.join('\n')}\n}`);
  }
  writeFileSync(resolve(OUT, 'button-size.css'), blocks.join('\n\n') + '\n');
  console.log('\u2713 button-size.css');
}

// --- 9. Combined CSS as a TS module (auto-injected at runtime) ----------------
/**
 * Concatenates every generated CSS file into a single TS module exporting the
 * raw CSS string. `BrandProvider` injects it via styled-components'
 * `createGlobalStyle`, so consumers only import components — no manual CSS
 * imports. Order is irrelevant: every rule is scoped by selector.
 */
function buildCssModule() {
  const files = readdirSync(OUT)
    .filter((f) => f.endsWith('.css'))
    .sort();
  const css = files
    .map((f) => readFileSync(resolve(OUT, f), 'utf8').trim())
    .join('\n\n');
  const escaped = css
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${');
  const module =
    '// AUTO-GENERATED by scripts/build-tokens.js — do not edit by hand.\n' +
    'export const globalCss = `' +
    escaped +
    '`;\n';
  writeFileSync(T('src/tokens/css.generated.ts'), module);
  console.log('\u2713 css.generated.ts');
}

// --- orchestration -----------------------------------------------------------
let first = true;
for (const brand of BRANDS) {
  for (const theme of THEMES) {
    await buildBase(brand, theme, { withTs: first });
    console.log(`\u2713 ${brand}.${theme}.css`);
    first = false;
  }
}
buildButtonCss();
buildInputCss();
buildSizingCss();
buildElevationCss();
buildTypographyCss();
buildSemanticRolesCss();
buildButtonSizeCss();
buildCssModule();
