import { useState } from 'react'
import { Plus, Trash2, Edit3, Check, ArrowRight } from 'lucide-react'
import { SPHERES_FULL, calcIKP, calcKsystem, getCrisisLevel } from '../data/model.js'

function IKPBadge({ ikp }) {
  const lvl = getCrisisLevel(ikp)
  return (
    <span className="chip" style={{ background: `${lvl.color}22`, color: lvl.color, border: `1px solid ${lvl.color}44` }}>
      {lvl.label}
    </span>
  )
}

function SphereSlider({ sphere, value, onChange }) {
  const ikp = 1 - value / 10
  const lvl = getCrisisLevel(ikp)
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{sphere}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: lvl.color }}>
            ІКП {ikp.toFixed(2)}
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700,
            color: 'var(--purple-light)', minWidth: 28, textAlign: 'right',
          }}>{value.toFixed(1)}</span>
        </div>
      </div>
      <div style={{ position: 'relative' }}>
        <input
          type="range" min="0" max="10" step="0.1"
          value={value}
          onChange={e => onChange(parseFloat(e.target.value))}
          style={{
            '--fill': `${value * 10}%`,
            background: `linear-gradient(to right, ${lvl.color} var(--fill), var(--bg-3) var(--fill))`,
            borderRadius: 2,
          }}
        />
      </div>
    </div>
  )
}

function CompanyCard({ company, idx, onUpdateS, onRemove, onRename, isPreset }) {
  const [editing, setEditing] = useState(false)
  const [tempName, setTempName] = useState(company.name)

  const ikp = calcIKP(company.S)
  const ksys = calcKsystem(ikp)
  const lvl = getCrisisLevel(ksys)

  return (
    <div className="glass-card" style={{ padding: '22px 24px' }}>
      {/* Card header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ flex: 1 }}>
          {editing ? (
            <div style={{ display: 'flex', gap: 6 }}>
              <input
                value={tempName}
                onChange={e => setTempName(e.target.value)}
                style={{
                  background: 'var(--bg-3)', border: '1px solid var(--border-strong)',
                  borderRadius: 7, padding: '5px 10px', color: 'var(--text-primary)',
                  fontFamily: 'var(--font-body)', fontSize: 13, flex: 1,
                }}
                autoFocus
                onKeyDown={e => { if (e.key === 'Enter') { onRename(idx, tempName); setEditing(false) } }}
              />
              <button className="btn-ghost" style={{ padding: '5px 10px' }}
                onClick={() => { onRename(idx, tempName); setEditing(false) }}>
                <Check size={13} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{company.name}</span>
              {!isPreset && (
                <button onClick={() => setEditing(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2 }}>
                  <Edit3 size={12} />
                </button>
              )}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <IKPBadge ikp={ksys} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: lvl.color }}>
            {ksys.toFixed(3)}
          </span>
          {!isPreset && (
            <button
              onClick={() => onRemove(idx)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 3 }}
              title="Видалити"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Sliders */}
      <div>
        {SPHERES_FULL.map((sp, si) => (
          <SphereSlider
            key={sp}
            sphere={sp}
            value={company.S[si]}
            onChange={v => onUpdateS(idx, si, v)}
          />
        ))}
      </div>
    </div>
  )
}

export default function PageInput({ companies, updateS, addCompany, removeCompany, renameCompany, onNext }) {
  const [newName, setNewName] = useState('')

  function handleAdd() {
    const name = newName.trim() || `Організація ${companies.length + 1}`
    addCompany(name)
    setNewName('')
  }

  return (
    <div style={{ paddingTop: 36 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6, letterSpacing: '-0.01em' }}>
            Вхідні дані — Sj
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Оцініть функціональну спроможність за кожною сферою (0 = критичний стан, 10 = висока спроможність)
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Нова організація..."
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            style={{
              background: 'var(--bg-3)', border: '1px solid var(--border)',
              borderRadius: 10, padding: '8px 14px',
              color: 'var(--text-primary)', fontFamily: 'var(--font-body)',
              fontSize: 13, width: 200,
            }}
          />
          <button className="btn-ghost" onClick={handleAdd} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Plus size={14} /> Додати
          </button>
          <button className="btn-primary" onClick={onNext} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            Шахова дошка <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Summary row */}
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8, marginBottom: 24 }}>
        {companies.map((c, i) => {
          const ikp = calcIKP(c.S)
          const ks = calcKsystem(ikp)
          const lvl = getCrisisLevel(ks)
          return (
            <div key={c.id} style={{
              flexShrink: 0,
              background: 'var(--bg-card)', border: `1px solid ${lvl.color}33`,
              borderRadius: 10, padding: '10px 16px',
              minWidth: 160,
            }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 140 }}>{c.name}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700, color: lvl.color }}>{ks.toFixed(3)}</div>
              <div style={{ fontSize: 10, color: lvl.color, marginTop: 2 }}>{lvl.label}</div>
            </div>
          )
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 16 }}>
        {companies.map((c, i) => (
          <CompanyCard
            key={c.id}
            company={c}
            idx={i}
            onUpdateS={updateS}
            onRemove={removeCompany}
            onRename={renameCompany}
            isPreset={i < 4}
          />
        ))}
      </div>
    </div>
  )
}
