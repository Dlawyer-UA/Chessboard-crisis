import { FileJson, FileText, Printer } from 'lucide-react'
import { exportJSON, exportCSV, printReport } from '../data/export.js'

export default function ExportBar({ companies, matrixA }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '10px 16px',
      background: 'rgba(124,58,237,0.06)',
      border: '1px solid rgba(124,58,237,0.15)',
      borderRadius: 12,
      marginBottom: 24,
      flexWrap: 'wrap',
    }}>
      <span style={{ fontSize: 12, color: 'var(--text-muted)', marginRight: 4, fontFamily: 'var(--font-mono)' }}>
        Експорт →
      </span>
      <button
        className="btn-ghost"
        onClick={() => exportJSON(companies, matrixA)}
        style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', fontSize: 12 }}
        title="Завантажити JSON"
      >
        <FileJson size={13} /> JSON
      </button>
      <button
        className="btn-ghost"
        onClick={() => exportCSV(companies, matrixA)}
        style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', fontSize: 12 }}
        title="Завантажити CSV"
      >
        <FileText size={13} /> CSV
      </button>
      <button
        className="btn-ghost"
        onClick={() => printReport(companies, matrixA)}
        style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', fontSize: 12 }}
        title="Друк / Зберегти PDF"
      >
        <Printer size={13} /> PDF / Друк
      </button>
      <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 4 }}>
        Дані зберігаються автоматично між сесіями
      </span>
    </div>
  )
}
