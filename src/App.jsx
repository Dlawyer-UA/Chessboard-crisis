import { useState, useEffect } from 'react'
import {
  PRESET_COMPANIES, DEFAULT_A,
  loadState, saveState,
} from './data/model.js'
import Header from './components/Header.jsx'
import TabNav from './components/TabNav.jsx'
import PageMethod from './components/PageMethod.jsx'
import PageInput from './components/PageInput.jsx'
import PageBoard from './components/PageBoard.jsx'
import PageRanking from './components/PageRanking.jsx'
import PageMatrixA from './components/PageMatrixA.jsx'

const TABS = [
  { id: 'method',  label: 'Методологія' },
  { id: 'input',   label: 'Вхідні дані' },
  { id: 'board',   label: 'Шахова дошка' },
  { id: 'ranking', label: 'Ранжування' },
  { id: 'matrix',  label: 'Матриця A' },
]

function initCompanies() {
  return PRESET_COMPANIES.map(c => ({ ...c, S: [...c.S] }))
}

export default function App() {
  const [tab, setTab] = useState('method')

  // restore or init
  const saved = loadState()
  const [companies, setCompanies] = useState(saved?.companies || initCompanies())
  const [matrixA,   setMatrixA]   = useState(saved?.matrixA   || DEFAULT_A.map(r => [...r]))
  const [activeBoard, setActiveBoard] = useState(0)

  // persist
  useEffect(() => {
    saveState({ companies, matrixA })
  }, [companies, matrixA])

  function updateS(compIdx, sphIdx, val) {
    setCompanies(prev => {
      const next = prev.map(c => ({ ...c, S: [...c.S] }))
      next[compIdx].S[sphIdx] = val
      return next
    })
  }

  function addCompany(name) {
    setCompanies(prev => [...prev, { id: `custom_${Date.now()}`, name, S: [5,5,5,5,5,5] }])
  }

  function removeCompany(idx) {
    setCompanies(prev => prev.filter((_, i) => i !== idx))
    if (activeBoard >= idx && activeBoard > 0) setActiveBoard(activeBoard - 1)
  }

  function renameCompany(idx, name) {
    setCompanies(prev => prev.map((c, i) => i === idx ? { ...c, name } : c))
  }

  function updateA(i, j, val) {
    setMatrixA(prev => {
      const next = prev.map(r => [...r])
      next[i][j] = val
      return next
    })
  }

  function resetAll() {
    setCompanies(initCompanies())
    setMatrixA(DEFAULT_A.map(r => [...r]))
  }

  const props = { companies, matrixA, updateS, addCompany, removeCompany, renameCompany, updateA, resetAll, activeBoard, setActiveBoard }

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      {/* Glow blobs */}
      <div className="glow-blob" style={{ width: 600, height: 600, top: -200, left: -200, background: 'rgba(124,58,237,0.12)' }} />
      <div className="glow-blob" style={{ width: 400, height: 400, bottom: 0, right: -100, background: 'rgba(20,184,166,0.08)' }} />

      <Header onReset={resetAll} />

      <TabNav tabs={TABS} active={tab} onSelect={setTab} />

      <main style={{ maxWidth: 1140, margin: '0 auto', padding: '0 20px 80px' }}>
        {tab === 'method'  && <PageMethod  onStart={() => setTab('input')} />}
        {tab === 'input'   && <PageInput   {...props} onNext={() => setTab('board')} />}
        {tab === 'board'   && <PageBoard   {...props} />}
        {tab === 'ranking' && <PageRanking {...props} />}
        {tab === 'matrix'  && <PageMatrixA {...props} />}
      </main>
    </div>
  )
}
