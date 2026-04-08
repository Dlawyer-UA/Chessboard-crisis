export default function TabNav({ tabs, active, onSelect }) {
  return (
    <nav style={{
      borderBottom: '1px solid var(--border)',
      background: 'rgba(21,13,38,0.9)',
      backdropFilter: 'blur(12px)',
      position: 'sticky', top: 62, zIndex: 99,
      padding: '0 20px',
      overflowX: 'auto',
    }}>
      <div style={{ maxWidth: 1140, margin: '0 auto', display: 'flex' }}>
        {tabs.map(t => (
          <button
            key={t.id}
            className={`btn-tab ${active === t.id ? 'active' : ''}`}
            onClick={() => onSelect(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
