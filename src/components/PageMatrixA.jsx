import { DEFAULT_A, SPHERES_FULL, SPHERES_SHORT } from '../data/model.js'

export default function PageMatrixA({ matrixA, updateA, resetAll }) {
  return (
    <div style={{ paddingTop: 36 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6, letterSpacing: '-0.01em' }}>
            Матриця взаємовпливів A
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', maxWidth: 600, lineHeight: 1.6 }}>
            Aij ∈ [0;1] — сила впливу кризи-джерела <em>i</em> на прояв кризи <em>j</em>. Значення на діагоналі Aii = 1 (незмінно). Поза діагоналлю — редагуйте вручну або задавайте на основі експертних оцінок / кореляційно-регресійних залежностей.
          </p>
        </div>
        <button className="btn-ghost" onClick={resetAll}>
          Скинути до авторських значень
        </button>
      </div>

      <div className="glass-card" style={{ padding: '24px 28px', overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'separate', borderSpacing: 4, minWidth: 700 }}>
          <thead>
            <tr>
              <th style={{ fontSize: 10, color: 'var(--text-muted)', padding: '4px 10px', textAlign: 'left', fontFamily: 'var(--font-mono)', fontWeight: 400, minWidth: 170 }}>
                A (i→j)
              </th>
              {SPHERES_SHORT.map(sp => (
                <th key={sp} style={{
                  fontSize: 9, color: 'var(--purple-light)', padding: '4px 6px', textAlign: 'center',
                  fontFamily: 'var(--font-mono)', fontWeight: 600, minWidth: 82,
                }}>{sp}</th>
              ))}
              <th style={{ fontSize: 9, color: 'var(--teal-light)', padding: '4px 8px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 600, minWidth: 60 }}>Σ рядка</th>
            </tr>
          </thead>
          <tbody>
            {matrixA.map((row, i) => {
              const rowSum = Math.round(row.reduce((a,v) => a+v, 0) * 100) / 100
              return (
                <tr key={i}>
                  <td style={{ fontSize: 12, color: 'var(--text-secondary)', padding: '6px 10px', fontWeight: 500, whiteSpace: 'nowrap' }}>
                    {SPHERES_FULL[i]}
                  </td>
                  {row.map((val, j) => {
                    const isDiag = i === j
                    if (isDiag) return (
                      <td key={j} style={{ textAlign: 'center', padding: '4px' }}>
                        <div style={{
                          background: 'rgba(124,58,237,0.30)',
                          border: '1px solid rgba(124,58,237,0.55)',
                          borderRadius: 8, padding: '8px 10px',
                          fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700,
                          color: '#c4b5fd', minWidth: 72, textAlign: 'center',
                        }}>1.00</div>
                      </td>
                    )
                    const t = val
                    const color = t < 0.4 ? '#5eead4' : t < 0.7 ? '#eab308' : '#f97316'
                    return (
                      <td key={j} style={{ textAlign: 'center', padding: '4px' }}>
                        <input
                          type="number" min="0" max="1" step="0.05"
                          value={val}
                          onChange={e => {
                            const v = Math.min(1, Math.max(0, parseFloat(e.target.value) || 0))
                            updateA(i, j, v)
                          }}
                          style={{
                            background: `${color}15`,
                            border: `1px solid ${color}44`,
                            borderRadius: 8, padding: '7px 6px',
                            color, fontFamily: 'var(--font-mono)',
                            fontSize: 12, fontWeight: 600,
                            width: 72, textAlign: 'center',
                          }}
                        />
                      </td>
                    )
                  })}
                  <td style={{ textAlign: 'center', padding: '4px 8px' }}>
                    <div style={{
                      background: 'rgba(20,184,166,0.12)',
                      border: '1px solid rgba(20,184,166,0.25)',
                      borderRadius: 8, padding: '7px 10px',
                      fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700,
                      color: '#5eead4',
                    }}>{rowSum.toFixed(2)}</div>
                  </td>
                </tr>
              )
            })}
            {/* Col sums */}
            <tr>
              <td style={{ fontSize: 10, color: '#5eead4', padding: '8px 10px', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>Σ стовпця</td>
              {matrixA[0].map((_, j) => {
                const cs = Math.round(matrixA.reduce((a,row) => a+row[j], 0) * 100) / 100
                return (
                  <td key={j} style={{ textAlign: 'center', padding: '4px' }}>
                    <div style={{
                      background: 'rgba(20,184,166,0.10)',
                      border: '1px solid rgba(20,184,166,0.2)',
                      borderRadius: 8, padding: '6px',
                      fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
                      color: '#5eead4',
                    }}>{cs.toFixed(2)}</div>
                  </td>
                )
              })}
              <td />
            </tr>
          </tbody>
        </table>
      </div>

      {/* Explanation */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14, marginTop: 20 }}>
        {[
          ['Методичні рекомендації', 'Задавайте значення Aij на основі методу Делфі, парних порівнянь або кореляційно-регресійних залежностей між кризовими показниками.'],
          ['Діагональ Aii = 1', 'Кожна криза має 100% вплив на саму себе. Це базова умова методу — діагональ не підлягає редагуванню.'],
          ['Адаптація під галузь', 'Для логістично залежного бізнесу підвищте вагу рядка «Логістична». При воєнних ризиках — рядка «Стратегічна».'],
        ].map(([title, text]) => (
          <div key={title} style={{
            background: 'rgba(124,58,237,0.06)',
            border: '1px solid rgba(124,58,237,0.15)',
            borderRadius: 12, padding: '16px 18px',
          }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--purple-light)', marginBottom: 6 }}>{title}</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{text}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
