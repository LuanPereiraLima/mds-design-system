import { useCssValues } from './useBrandTheme';

export interface ElevationDemoProps {
  title?: string;
  /** Nomes completos das CSS vars de sombra (ex.: `--shadow-01`). */
  vars: string[];
  /** Prefixo removido para gerar o rótulo. */
  prefix?: string;
}

/** Preview de elevação: uma superfície por token de sombra, com o `box-shadow`
 * real aplicado. O valor da var referencia `var(--shadow)`, então a cor da
 * sombra acompanha a marca/modo ativos. */
export function ElevationDemo({ title, vars, prefix = '--shadow-' }: ElevationDemoProps) {
  const { ref, values, brand, mode } = useCssValues(vars);

  return (
    <div ref={ref} data-brand={brand} data-theme={mode} style={{ marginBottom: 24 }}>
      {title && <h3 style={{ marginBottom: 12 }}>{title}</h3>}
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', padding: '8px 0' }}>
        {vars.map((v) => {
          const value = values[v] ?? '';
          const name = v.startsWith(prefix) ? v.slice(prefix.length) : v;
          return (
            <div key={v} style={{ textAlign: 'center' }}>
              <div style={{ width: 96, height: 64, background: '#fff', borderRadius: 8, boxShadow: value }} />
              <div style={{ fontSize: 12, fontFamily: 'monospace', marginTop: 12 }}>Shadow.{name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
