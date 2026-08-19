import { useCssValues } from './useBrandTheme';

export interface SpacingScaleProps {
  title?: string;
  /** Nomes completos das CSS vars (ex.: `--gap-m-small`). */
  vars: string[];
  /** Prefixo removido para gerar o rótulo exibido. */
  prefix?: string;
}

/** Escala de espaçamento: uma barra proporcional ao valor em px de cada token,
 * lida ao vivo das CSS custom properties geradas. */
export function SpacingScale({ title, vars, prefix = '--gap-' }: SpacingScaleProps) {
  const { ref, values } = useCssValues(vars);
  const entries = vars.map((v) => ({
    name: v.startsWith(prefix) ? v.slice(prefix.length) : v,
    value: values[v] ?? '',
  }));
  const maxPx = Math.max(...entries.map((e) => parseFloat(e.value) || 0), 1);

  return (
    <div ref={ref} style={{ marginBottom: 24 }}>
      {title && <h3 style={{ marginBottom: 12 }}>{title}</h3>}
      <div>
        {entries.map(({ name, value }) => {
          const px = parseFloat(value) || 0;
          return (
            <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
              <div style={{ width: 140, fontSize: 12, fontFamily: 'monospace', color: '#666' }}>{name}</div>
              <div style={{ height: 14, width: `${(px / maxPx) * 240}px`, background: '#079d56', borderRadius: 2 }} />
              <div style={{ fontSize: 12, fontFamily: 'monospace', color: '#888' }}>{value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
