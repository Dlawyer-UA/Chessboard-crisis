import ExportBar from './ExportBar.jsx'
import {
  RadarChart, PolarGrid, PolarAngleAxis,
  Radar, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, Cell,
} from 'recharts'
import { calcIKP, calcKsystem, getCrisisLevel, SPHERES_SHORT } from '../data/model.js'

const COLORS = ['#a78bfa', '#5eead4', '#fb923c', '#60a5fa', '#f472b6', '#a3e635']

export default function PageRanking({ companies, matrixA }) {
  const ranked = companies.map((c, i) => {
    const ikp = calcIKP(c.S)
    const ks  = calcKsystem(ikp)
    return { ...c, ikp, ks, lvl: getCrisisLevel(ks), rank: 0, origIdx: i }
  }).sort((a, b) => b.ks - a.ks).map((c, i) => ({ ...c, rank: i + 1 }))

  // radar data
  const radarData = SPHERES_SHORT.map((sp, si) => {
    const obj = { subject: sp }
    ranked.forEach(c => { obj[c.name] = Math.round(c.ikp[si] * 100) })
    return obj
  })

  // bar data
  const barData = ranked.map(c => ({
    name: c.name.replace('ТОВ «', '').replace('ПСП «', '').replace('»', '').replace('Агрокомплекс «', ''),
    ks: Math.round(c.ks * 1000) / 1000,
    fill: c.lvl.color,
  }))

  return (
    <div style={{ paddingTop: 36 }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6, letterSpacing: '-0.01em' }}>
        Ранжування
      </h2>
      <ExportBar companies={companies} matrixA={matrixA} />
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 28 }}>
        Системний індекс кризовості Ksystem — від найвищого до найнижчого ризику
      </p>

      {/* Ranking list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 36 }}>
        {ranked.map((c, i) => (
          <div key={c.id} className="glass-card" style={{ padding: '16px 22px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700,
              color: 'var(--text-muted)', minWidth: 36, textAlign: 'right', lineHeight: 1,
            }}>{c.rank}</div>
            <div style={{ flex: 1, minWidth: 160 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{c.name}</div>
              <div style={{
                display: 'inline-block', fontSize: 11, fontWeight: 600,
                color: c.lvl.color, background: `${c.lvl.color}1a`,
                border: `1px solid ${c.lvl.color}33`, borderRadius: 6, padding: '2px 8px',
              }}>{c.lvl.label}</div>
            </div>
            {/* IKP mini-bars */}
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', flex: 2, minWidth: 200 }}>
              {SPHERES_SHORT.map((sp, si) => {
                const lv = getCrisisLevel(c.ikp[si])
                return (
                  <div key={sp} style={{ textAlign: 'center', minWidth: 55 }}>
                    <div style={{ fontSize: 9, color: 'var(--text-muted)', marginBottom: 3, fontFamily: 'var(--font-mono)' }}>{sp}</div>
                    <div style={{ height: 24, background: 'var(--bg-3)', borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
                      <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        height: `${c.ikp[si] * 100}%`,
                        background: lv.color, borderRadius: 4, transition: 'height 0.4s',
                      }} />
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: lv.color, marginTop: 2 }}>{c.ikp[si].toFixed(2)}</div>
                  </div>
                )
              })}
            </div>
            {/* Ksystem */}
            <div style={{ minWidth: 80, textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 26, fontWeight: 700, color: c.lvl.color, lineHeight: 1 }}>
                {c.ks.toFixed(3)}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', marginTop: 2 }}>Ksystem</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16 }}>
        {/* Bar chart */}
        <div className="glass-card" style={{ padding: '20px 22px' }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 16, fontWeight: 600 }}>KSYSTEM — ПОРІВНЯННЯ</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} margin={{ top: 5, right: 10, left: -20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#6b7280', fontFamily: 'IBM Plex Mono' }} angle={-25} textAnchor="end" />
              <YAxis tick={{ fontSize: 9, fill: '#6b7280', fontFamily: 'IBM Plex Mono' }} domain={[0, 1]} />
              <Tooltip
                contentStyle={{ background: '#1a1030', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 8, fontFamily: 'IBM Plex Mono', fontSize: 11 }}
                labelStyle={{ color: '#a78bfa' }}
                formatter={v => [v.toFixed(3), 'Ksystem']}
              />
              <Bar dataKey="ks" radius={[4,4,0,0]}>
                {barData.map((d, i) => <Cell key={i} fill={d.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radar chart */}
        <div className="glass-card" style={{ padding: '20px 22px' }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 16, fontWeight: 600 }}>ІКП × 100 — РАДАРНА КАРТА</div>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: '#6b7280', fontFamily: 'IBM Plex Mono' }} />
              {ranked.map((c, i) => (
                <Radar key={c.id} name={c.name.substring(0,12)} dataKey={c.name}
                  stroke={COLORS[i % COLORS.length]} fill={COLORS[i % COLORS.length]}
                  fillOpacity={0.08} strokeWidth={1.5} />
              ))}
              <Legend wrapperStyle={{ fontSize: 9, fontFamily: 'IBM Plex Mono', color: '#9ca3af' }} />
              <Tooltip
                contentStyle={{ background: '#1a1030', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 8, fontFamily: 'IBM Plex Mono', fontSize: 10 }}
                formatter={v => [`${v}%`, '']}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
