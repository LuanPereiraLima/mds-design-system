import { useEffect, useRef, useState } from 'react';
import { getDescription } from '../lib/descriptions';
import { cssVar, useBrandTheme } from './useBrandTheme';

export interface ColorGridProps {
  title?: string;
  /** Nomes de token em camelCase (ex.: `onPrimary`), resolvidos para
   * `var(--on-primary)` na marca/modo ativos. */
  names: string[];
  /** Atributos data-* extras no container, para resolver seletores de papel
   * semântico (ex.: `{ 'data-visual': 'primary' }`). */
  attrs?: Record<string, string>;
}

/** Grid de swatches de cor. Cada swatch usa a CSS custom property real
 * (`var(--token)`), então reage à marca/modo escolhidos na toolbar; o valor
 * hex ao lado é lido do computed style do container, e a descrição curada do
 * papel (quando existe) explica quando aplicá-lo. */
export function ColorGrid({ title, names, attrs }: ColorGridProps) {
  const { brand, mode } = useBrandTheme();
  const ref = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const namesKey = names.join('|');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const styles = getComputedStyle(el);
    const next: Record<string, string> = {};
    for (const name of names) {
      const value = styles.getPropertyValue(cssVar(name)).trim();
      if (value) next[name] = value;
    }
    setValues(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brand, mode, namesKey]);

  return (
    <div ref={ref} data-brand={brand} data-theme={mode} {...attrs} style={{ marginBottom: 24 }}>
      {title && <h3 style={{ marginBottom: 12 }}>{title}</h3>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
        {names.map((name) => {
          const value = values[name];
          return (
            <div key={name} style={{ border: '1px solid #e0e0e0', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ height: 56, background: `var(${cssVar(name)})` }} />
              <div style={{ padding: '8px 10px', fontSize: 13 }}>
                <div style={{ fontFamily: 'monospace', fontWeight: 600 }}>{name}</div>
                {value && <div style={{ fontFamily: 'monospace', color: '#666' }}>{value}</div>}
                {getDescription(name) && (
                  <div style={{ marginTop: 6, fontSize: 12, lineHeight: 1.4, color: '#555' }}>
                    {getDescription(name)}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
