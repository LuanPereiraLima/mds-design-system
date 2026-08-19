import { useCssValues } from './useBrandTheme';

const FIELDS = ['font-family', 'font-weight', 'font-size', 'line-height', 'letter-spacing'] as const;

export interface TypeScaleProps {
  title?: string;
  /** Role em kebab-case (ex.: `display`, `paragraph`). */
  role: string;
  /** Tamanhos em kebab-case (ex.: `x-large`, `medium`, `x-small`). */
  sizes: string[];
  sampleText?: string;
}

/** Escala tipográfica de um role, com preview de texto real em cada tamanho
 * usando os valores lidos ao vivo das CSS vars `--typography-<role>-<size>-*`
 * da marca ativa. */
export function TypeScale({ title, role, sizes, sampleText = 'Design tokens em ação' }: TypeScaleProps) {
  const vars = sizes.flatMap((size) => FIELDS.map((f) => `--typography-${role}-${size}-${f}`));
  const { ref, values, brand } = useCssValues(vars);
  const get = (size: string, field: string) => values[`--typography-${role}-${size}-${field}`] ?? '';

  return (
    <div ref={ref} data-brand={brand} style={{ marginBottom: 32 }}>
      {title && <h3 style={{ marginBottom: 12 }}>{title}</h3>}
      {sizes.map((size) => {
        const fontFamily = get(size, 'font-family');
        const fontWeight = get(size, 'font-weight');
        const fontSize = get(size, 'font-size');
        const lineHeight = get(size, 'line-height');
        const letterSpacing = get(size, 'letter-spacing');
        return (
          <div key={size} style={{ display: 'flex', alignItems: 'baseline', gap: 16, borderBottom: '1px solid #eee', padding: '12px 0' }}>
            <div style={{ width: 220, flexShrink: 0, fontSize: 12, fontFamily: 'monospace', color: '#888' }}>
              {role}.{size}
              <br />
              {fontFamily} {fontWeight}/{fontSize}
              <br />
              line-height: {lineHeight}
            </div>
            <div
              style={{
                fontFamily,
                fontSize,
                fontWeight: Number(fontWeight) || undefined,
                lineHeight,
                letterSpacing,
              }}
            >
              {sampleText}
            </div>
          </div>
        );
      })}
    </div>
  );
}
