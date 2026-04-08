import { RotateCcw } from 'lucide-react'

export default function Header({ onReset }) {
  return (
    <header style={{
      borderBottom: '1px solid rgba(139,92,246,0.15)',
      background: 'rgba(13,6,24,0.85)',
      backdropFilter: 'blur(20px)',
      position: 'sticky', top: 0, zIndex: 100,
      padding: '0 20px',
    }}>
      <div style={{ maxWidth: 1140, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 62 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #7c3aed, #14b8a6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18,
          }}>♟</div>
          <div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 13, fontWeight: 600,
              color: 'var(--text-primary)',
              letterSpacing: '0.04em',
              lineHeight: 1.2,
            }}>
              ШАХОВА ДОШКА КРИЗ
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
              CRISIS DIAGNOSTIC SYSTEM · v1.0
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 10,
            color: 'var(--text-muted)',
            borderRight: '1px solid var(--border)',
            paddingRight: 14, marginRight: 6,
            lineHeight: 1.5,
          }}>
            Козловський Д.О.<br />
            <span style={{ color: 'rgba(139,92,246,0.6)' }}>Дис. дослідження, 2025</span>
          </div>
          <button
            className="btn-ghost"
            onClick={onReset}
            title="Скинути до значень з дисертації"
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px' }}
          >
            <RotateCcw size={13} />
            <span>Скинути</span>
          </button>
        </div>
      </div>
    </header>
  )
}
