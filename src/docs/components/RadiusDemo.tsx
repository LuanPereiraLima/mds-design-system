import { useCssValues } from './useBrandTheme';

export interface RadiusScale {
  label: string;
  /** Nomes completos das CSS vars (ex.: `--radii-medium`). */
  vars: string[];
  /** Prefixo removido para gerar o rótulo de cada item. */
  prefix?: string;
}

export interface RadiusDemoProps {
  title?: string;
  scales: RadiusScale[];
}

/** Preview visual de escalas de raio de borda — uma linha de caixas por escala,
 * cada uma com o raio real aplicado, lido ao vivo das CSS vars. */
export function RadiusDemo({ title, scales }: RadiusDemoProps) {
  const { ref, values } = useCssValues(scales.flatMap((s) => s.vars));

  return (
    <div ref={ref} style={{ marginBottom: 24 }}>
      {title && <h3 style={{ marginBottom: 12 }}>{title}</h3>}
      {scales.map(({ label, vars, prefix = '--radii-' }) => (
        <div key={label} style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{label}</div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {vars.map((v) => {
              const value = values[v] ?? '';
              const name = v.startsWith(prefix) ? v.slice(prefix.length) : v;
              return (
                <div key={v} style={{ textAlign: 'center' }}>
                  <div style={{ width: 64, height: 64, background: '#e8e3dd', borderRadius: value || 0 }} />
                  <div style={{ fontSize: 11, fontFamily: 'monospace', marginTop: 4 }}>{name}</div>
                  <div style={{ fontSize: 11, fontFamily: 'monospace', color: '#888' }}>{value}</div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
