import { ArrowRight, BookOpen, Layers, BarChart3, GitBranch } from 'lucide-react'
import { SPHERES_FULL, WEIGHTS, CRISIS_SCALE } from '../data/model.js'

function Formula({ children }) {
  return (
    <span style={{
      fontFamily: 'var(--font-mono)', fontSize: 13,
      background: 'rgba(124,58,237,0.15)',
      border: '1px solid rgba(124,58,237,0.25)',
      borderRadius: 7, padding: '4px 10px',
      color: '#c4b5fd', display: 'inline-block',
      margin: '2px 0',
    }}>{children}</span>
  )
}

function Card({ icon: Icon, title, children }) {
  return (
    <div className="glass-card" style={{ padding: '24px 28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 9,
          background: 'rgba(124,58,237,0.18)',
          border: '1px solid rgba(124,58,237,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#a78bfa', flexShrink: 0,
        }}><Icon size={16} /></div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '0.04em' }}>{title}</div>
      </div>
      {children}
    </div>
  )
}

export default function PageMethod({ onStart }) {
  return (
    <div style={{ paddingTop: 48 }}>
      {/* Hero */}
      <div className="fade-up" style={{ textAlign: 'center', marginBottom: 64 }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em',
          color: 'var(--purple-light)', opacity: 0.7, marginBottom: 16,
          textTransform: 'uppercase',
        }}>АВТОРСЬКА МЕТОДОЛОГІЯ · КОЗЛОВСЬКИЙ Д.О. · 2025</div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(26px, 4vw, 44px)',
          fontWeight: 700,
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
          color: 'var(--text-primary)',
          marginBottom: 20,
        }}>
          Метод<br />
          <span style={{ color: 'var(--purple-light)' }}>«Шахова дошка криз»</span>
        </h1>
        <p style={{ fontSize: 15, color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto 32px', lineHeight: 1.7 }}>
          Структурна модель комплексної діагностики кризових проявів та виявлення каскадних ефектів у функціональних підсистемах аграрних бізнес-організацій
        </p>
        <button className="btn-primary" onClick={onStart} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
          Розпочати діагностику <ArrowRight size={15} />
        </button>
      </div>

      {/* Formulas grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Sj', sub: 'Функціональна спроможність', formula: 'Sj ∈ [0; 10]', note: '10 = висока, 0 = критична' },
          { label: 'ІКПj', sub: 'Індекс кризових проявів', formula: 'ІКПj = 1 − Sj / 10', note: 'ІКПj ∈ [0; 1]' },
          { label: 'Kij', sub: 'Клітинка шахової дошки', formula: 'Kij = ІКПi × Aij × 10', note: 'Кij ∈ [0; 10]' },
          { label: 'Ksystem', sub: 'Системний індекс', formula: 'Ksystem = Σ(Wj × ІКПj)', note: 'Ksystem ∈ [0; 1]' },
        ].map(({ label, sub, formula, note }) => (
          <div key={label} className="glass-card" style={{ padding: '20px 22px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--purple-light)', marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 10 }}>{sub}</div>
            <Formula>{formula}</Formula>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8, fontFamily: 'var(--font-mono)' }}>{note}</div>
          </div>
        ))}
      </div>

      {/* 3 cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginBottom: 32 }}>
        <Card icon={Layers} title="ФУНКЦІОНАЛЬНІ СФЕРИ ТА ВАГИ Wj">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {SPHERES_FULL.map((sp, i) => (
              <div key={sp} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                  background: `rgba(124,58,237,${0.1 + WEIGHTS[i] * 0.8})`,
                  border: `1px solid rgba(167,139,250,${0.15 + WEIGHTS[i] * 0.5})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
                  color: '#c4b5fd',
                }}>{(WEIGHTS[i] * 100).toFixed(0)}%</div>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 500 }}>{sp}</div>
                  <div style={{
                    marginTop: 3, height: 3, borderRadius: 2,
                    background: `rgba(124,58,237,${0.2 + WEIGHTS[i] * 1.5})`,
                    width: `${WEIGHTS[i] * 500}px`, maxWidth: '100%',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card icon={BarChart3} title="ШКАЛА ІНТЕРПРЕТАЦІЇ ІКП">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {CRISIS_SCALE.map(s => (
              <div key={s.label} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 12px', borderRadius: 8,
                background: s.bg,
                border: `1px solid ${s.color}30`,
              }}>
                <span style={{ fontSize: 14 }}>{s.dot}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: s.color }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card icon={GitBranch} title="АЛГОРИТМ МЕТОДУ">
          {[
            ['1', 'Оцінка Sj', 'Визначення функціональної спроможності за 6 сферами (0–10)'],
            ['2', 'Розрахунок ІКПj', 'Перетворення у шкалу кризовості: ІКПj = 1 − Sj/10'],
            ['3', 'Матриця A', 'Задання коефіцієнтів взаємовпливів між кризами'],
            ['4', 'Шахова дошка', 'Побудова матриці Kij — теплова карта каскадів'],
            ['5', 'Ksystem', 'Зважений системний індекс та ранжування організацій'],
          ].map(([n, title, desc]) => (
            <div key={n} style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
              <div style={{
                width: 24, height: 24, borderRadius: 6, flexShrink: 0,
                background: 'rgba(124,58,237,0.25)',
                border: '1px solid rgba(124,58,237,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
                color: 'var(--purple-light)',
              }}>{n}</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{title}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }}>{desc}</div>
              </div>
            </div>
          ))}
        </Card>
      </div>

      <div style={{ textAlign: 'center', paddingTop: 8 }}>
        <button className="btn-primary" onClick={onStart} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          Перейти до введення даних <ArrowRight size={15} />
        </button>
      </div>
    </div>
  )
}
