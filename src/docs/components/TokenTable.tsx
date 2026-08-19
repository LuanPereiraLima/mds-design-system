export interface TokenRow {
  name: string;
  value: string;
}

export interface TokenTableProps {
  title?: string;
  rows: TokenRow[];
}

/** Tabela genérica nome/valor para categorias sem componente de exibição
 * dedicado. */
export function TokenTable({ title, rows }: TokenTableProps) {
  return (
    <div style={{ marginBottom: 24 }}>
      {title && <h3 style={{ marginBottom: 8 }}>{title}</h3>}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '2px solid #e0e0e0' }}>
            <th style={{ padding: '6px 8px' }}>Token</th>
            <th style={{ padding: '6px 8px' }}>Valor</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '6px 8px', fontFamily: 'monospace' }}>{row.name}</td>
              <td style={{ padding: '6px 8px', fontFamily: 'monospace' }}>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
