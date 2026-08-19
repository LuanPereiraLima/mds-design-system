import { getColorChain } from '../lib/chain';
import { useBrandTheme } from './useBrandTheme';

export interface TokenChainProps {
  /** Nome do papel de cor na camada de marca (ex.: `primary`, `onSurface`). */
  fieldName: string;
}

/**
 * Mostra a cadeia de resolução completa de um token de cor
 * (Semantics -> Brand -> Primitives) para a marca/modo ativos, lendo os
 * aliases direto dos JSONs de origem — não do CSS já resolvido.
 *
 * É o complemento do `ColorGrid`: enquanto o grid mostra o valor final que o
 * componente enxerga, aqui aparecem os nomes intermediários que ligam o papel
 * semântico à paleta crua.
 */
export function TokenChain({ fieldName }: TokenChainProps) {
  const { brand, mode } = useBrandTheme();
  const chain = getColorChain(fieldName, brand, mode);

  if (!chain) {
    return (
      <p style={{ color: '#a33', fontSize: 13 }}>
        <code>{fieldName}</code> não resolve por alias simples em {brand}/{mode} — é um valor
        literal (como <code>shadow</code>, que é rgba) ou não existe nesta marca.
      </p>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
      {chain.map((step, i) => (
        <div key={step.layer} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: 12, minWidth: 160 }}>
            <div style={{ fontSize: 11, textTransform: 'uppercase', color: '#888', letterSpacing: 1 }}>
              {step.layer}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 4,
                  background: step.value,
                  border: '1px solid #ddd',
                }}
              />
              <code style={{ fontSize: 12 }}>{step.path}</code>
            </div>
            <div style={{ fontSize: 12, fontFamily: 'monospace', color: '#888', marginTop: 4 }}>
              {step.value}
            </div>
          </div>
          {i < chain.length - 1 && <span style={{ color: '#bbb' }}>→</span>}
        </div>
      ))}
    </div>
  );
}
