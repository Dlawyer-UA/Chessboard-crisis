import ExportBar from './ExportBar.jsx'
import {
  SPHERES_FULL, SPHERES_SHORT,
  calcIKP, calcKsystem, calcKMatrix,
  calcColSums, calcRowSums,
  getCrisisLevel, heatColor,
} from '../data/model.js'

function IKPBar({ label, value }) {
  const lvl = getCrisisLevel(value)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
      <div style={{ fontSize: 11, color: 'var(--text-secondary)', width: 150, flexShrink: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</div>
      <div style={{ flex: 1, height: 6, background: 'var(--bg-3)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${value * 100}%`, background: lvl.color, borderRadius: 3, transition: 'width 0.4s ease' }} />
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: lvl.color, width: 36, textAlign: 'right' }}>{value.toFixed(2)}</div>
    </div>
  )
}

function SigmaChip({ label, value, max }) {
  const t = value / max
  const color = t < 0.4 ? '#22c55e' : t < 0.65 ? '#eab308' : '#ef4444'
  return (
    <div style={{
      background: `${color}18`, border: `1px solid ${color}33`,
      borderRadius: 10, padding: '8px 14px', textAlign: 'center', minWidth: 100,
    }}>
      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700, color }}>{value.toFixed(1)}</div>
    </div>
  )
}

function ChessBoard({ company, matrixA }) {
  const ikp = calcIKP(company.S)
  const K   = calcKMatrix(ikp, matrixA)
  const colSums = calcColSums(K)
  const rowSums = calcRowSums(K)
  const ksys = calcKsystem(ikp)
  const lvl  = getCrisisLevel(ksys)

  const maxSigma = Math.max(...colSums, ...rowSums)

  return (
    <div>
      {/* Company header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 24, flexWrap: 'wrap', gap: 12,
      }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{company.name}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
            Kij = ІКПi × Aij × 10 · Рядок i = джерело, стовпець j = прояв
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Ksystem</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: lvl.color, lineHeight: 1 }}>{ksys.toFixed(3)}</div>
          </div>
          <div style={{
            background: `${lvl.color}22`, border: `1px solid ${lvl.color}44`,
            borderRadius: 10, padding: '8px 16px',
            fontWeight: 600, fontSize: 13, color: lvl.color,
          }}>{lvl.label}</div>
        </div>
      </div>

      {/* Matrix table */}
      <div style={{ overflowX: 'auto', marginBottom: 24 }}>
        <table style={{ borderCollapse: 'separate', borderSpacing: 3, minWidth: 620 }}>
          <thead>
            <tr>
              <th style={{ fontSize: 10, color: 'var(--text-muted)', padding: '4px 8px', textAlign: 'left', fontWeight: 400, fontFamily: 'var(--font-mono)', minWidth: 140 }}>
                Джерело ↓ / Прояв →
              </th>
              {SPHERES_SHORT.map(sp => (
                <th key={sp} style={{
                  fontSize: 9, color: 'var(--purple-light)', padding: '4px 6px', textAlign: 'center',
                  fontFamily: 'var(--font-mono)', fontWeight: 600, letterSpacing: '0.02em',
                  minWidth: 70,
                }}>{sp}</th>
              ))}
              <th style={{ fontSize: 9, color: '#14b8a6', padding: '4px 6px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 600, minWidth: 55 }}>Σi</th>
            </tr>
          </thead>
          <tbody>
            {/* IKP row */}
            <tr>
              <td style={{ fontSize: 9, color: 'var(--text-muted)', padding: '3px 8px', fontFamily: 'var(--font-mono)' }}>ІКПi →</td>
              {ikp.map((v, j) => {
                const lv = getCrisisLevel(v)
                return (
                  <td key={j} style={{
                    textAlign: 'center', padding: '4px 6px',
                    background: `${lv.color}22`, borderRadius: 5,
                    fontFamily: 'var(--font-mono)', fontSize: 10,
                    fontWeight: 700, color: lv.color,
                  }}>{v.toFixed(2)}</td>
                )
              })}
              <td />
            </tr>
            {/* K matrix rows */}
            {K.map((row, i) => (
              <tr key={i}>
                <td style={{
                  fontSize: 11, color: 'var(--text-secondary)', padding: '4px 8px',
                  fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden',
                  textOverflow: 'ellipsis', maxWidth: 140,
                }}>{SPHERES_FULL[i]}</td>
                {row.map((v, j) => {
                  const isDiag = i === j
                  const colors = isDiag
                    ? { bg: 'rgba(124,58,237,0.3)', text: '#c4b5fd' }
                    : heatColor(v)
                  return (
                    <td key={j} style={{
                      textAlign: 'center', padding: '6px 4px',
                      background: colors.bg, borderRadius: 6,
                      fontFamily: 'var(--font-mono)', fontSize: 11,
                      fontWeight: isDiag ? 700 : 600,
                      color: colors.text,
                      border: isDiag ? '1px solid rgba(124,58,237,0.5)' : 'none',
                    }}>{v.toFixed(1)}</td>
                  )
                })}
                <td style={{
                  textAlign: 'center', padding: '6px 8px',
                  fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700,
                  color: '#5eead4',
                }}>{rowSums[i].toFixed(1)}</td>
              </tr>
            ))}
            {/* Col sums */}
            <tr>
              <td style={{ fontSize: 9, color: '#5eead4', padding: '6px 8px', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>Σj (тиск)</td>
              {colSums.map((s, j) => (
                <td key={j} style={{
                  textAlign: 'center', padding: '5px 4px',
                  background: 'rgba(20,184,166,0.12)', borderRadius: 6,
                  fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: '#5eead4',
                }}>{s.toFixed(1)}</td>
              ))}
              <td />
            </tr>
          </tbody>
        </table>
      </div>

      {/* Sigma analysis */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div className="glass-card" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: 11, color: 'var(--teal-light)', fontFamily: 'var(--font-mono)', marginBottom: 12, fontWeight: 600 }}>Σj — ТИСК НА СФЕРУ (мішені)</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {SPHERES_SHORT.map((sp, j) => <SigmaChip key={sp} label={sp} value={colSums[j]} max={maxSigma} />)}
          </div>
        </div>
        <div className="glass-card" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: 11, color: '#c4b5fd', fontFamily: 'var(--font-mono)', marginBottom: 12, fontWeight: 600 }}>Σi — ПОТУЖНІСТЬ ТРИГЕРА (джерела)</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {SPHERES_SHORT.map((sp, i) => <SigmaChip key={sp} label={sp} value={rowSums[i]} max={maxSigma} />)}
          </div>
        </div>
      </div>

      {/* IKP profile */}
      <div className="glass-card" style={{ padding: '16px 20px' }}>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 14, fontWeight: 600 }}>ПРОФІЛЬ ІКП ПО СФЕРАХ</div>
        {SPHERES_FULL.map((sp, i) => <IKPBar key={sp} label={sp} value={ikp[i]} />)}
      </div>
    </div>
  )
}

export default function PageBoard({ companies, matrixA, activeBoard, setActiveBoard }) {
  return (
    <div style={{ paddingTop: 36 }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6, letterSpacing: '-0.01em' }}>
        Шахова дошка криз
      </h2>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24 }}>
        Матриця Kij · теплова карта каскадних ефектів · аналіз векторів впливу
      </p>

      <ExportBar companies={companies} matrixA={matrixA} />
      {/* Company selector */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28, overflowX: 'auto', paddingBottom: 4 }}>
        {companies.map((c, i) => {
          const ks = calcKsystem(calcIKP(c.S))
          const lvl = getCrisisLevel(ks)
          const isActive = i === activeBoard
          return (
            <button
              key={c.id}
              onClick={() => setActiveBoard(i)}
              style={{
                flexShrink: 0,
                background: isActive ? `${lvl.color}22` : 'var(--bg-card)',
                border: `1px solid ${isActive ? lvl.color + '66' : 'var(--border)'}`,
                borderRadius: 10, padding: '8px 16px',
                cursor: 'pointer', color: isActive ? lvl.color : 'var(--text-secondary)',
                fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: isActive ? 600 : 400,
                transition: 'all 0.15s',
              }}
            >
              {c.name}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
        {[['0–2','#22c55e','Стабільно'],['2–4','#84cc16','Слабка'],['4–6','#eab308','Помірна'],['6–8','#f97316','Розвинена'],['8–10','#ef4444','Глибока']].map(([range, col, lbl]) => (
          <div key={range} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-muted)' }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: col + '88' }} />
            {range} — {lbl}
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-muted)' }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(124,58,237,0.5)' }} />
          діагональ (Aii=1)
        </div>
      </div>

      <div className="glass-card" style={{ padding: '28px' }}>
        <ChessBoard company={companies[activeBoard] || companies[0]} matrixA={matrixA} />
      </div>
    </div>
  )
}
