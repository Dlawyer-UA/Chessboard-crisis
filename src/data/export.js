import {
  calcIKP, calcKsystem, calcKMatrix, calcColSums, calcRowSums,
  getCrisisLevel, SPHERES_FULL, SPHERES_SHORT, WEIGHTS,
} from './model.js'

// ── JSON export ──────────────────────────────────────────────────────────────
export function exportJSON(companies, matrixA) {
  const data = {
    exportedAt: new Date().toISOString(),
    method: 'Шахова дошка криз',
    author: 'Козловський Д.О., 2025',
    matrixA,
    companies: companies.map(c => {
      const ikp    = calcIKP(c.S)
      const ksys   = calcKsystem(ikp)
      const K      = calcKMatrix(ikp, matrixA)
      const colS   = calcColSums(K)
      const rowS   = calcRowSums(K)
      const lvl    = getCrisisLevel(ksys)
      return {
        name: c.name,
        S: Object.fromEntries(SPHERES_FULL.map((sp, i) => [sp, c.S[i]])),
        IKP: Object.fromEntries(SPHERES_FULL.map((sp, i) => [sp, ikp[i]])),
        Ksystem: ksys,
        level: lvl.label,
        matrixK: K,
        sigmaCols: Object.fromEntries(SPHERES_SHORT.map((sp, i) => [sp, colS[i]])),
        sigmaRows: Object.fromEntries(SPHERES_SHORT.map((sp, i) => [sp, rowS[i]])),
      }
    }),
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  download(blob, `chess-crisis-export-${timestamp()}.json`)
}

// ── CSV export ───────────────────────────────────────────────────────────────
export function exportCSV(companies, matrixA) {
  const rows = []

  // Header
  rows.push(['Показник', ...companies.map(c => c.name)].join(';'))

  // IKP
  SPHERES_FULL.forEach((sp, i) => {
    rows.push([
      `ІКП — ${sp}`,
      ...companies.map(c => calcIKP(c.S)[i].toFixed(4)),
    ].join(';'))
  })

  // Ksystem
  rows.push([
    'Ksystem',
    ...companies.map(c => calcKsystem(calcIKP(c.S)).toFixed(4)),
  ].join(';'))

  // Level
  rows.push([
    'Рівень кризовості',
    ...companies.map(c => getCrisisLevel(calcKsystem(calcIKP(c.S))).label),
  ].join(';'))

  // Empty row
  rows.push('')

  // Matrix A
  rows.push('Матриця взаємовпливів A')
  rows.push([' ', ...SPHERES_SHORT].join(';'))
  matrixA.forEach((row, i) => {
    rows.push([SPHERES_SHORT[i], ...row.map(v => v.toFixed(2))].join(';'))
  })

  const bom  = '\uFEFF'
  const blob = new Blob([bom + rows.join('\n')], { type: 'text/csv;charset=utf-8' })
  download(blob, `chess-crisis-export-${timestamp()}.csv`)
}

// ── Print / PDF ──────────────────────────────────────────────────────────────
export function printReport(companies, matrixA) {
  const rows = companies.map(c => {
    const ikp  = calcIKP(c.S)
    const ksys = calcKsystem(ikp)
    const K    = calcKMatrix(ikp, matrixA)
    const colS = calcColSums(K)
    const rowS = calcRowSums(K)
    const lvl  = getCrisisLevel(ksys)
    return { c, ikp, ksys, K, colS, rowS, lvl }
  })

  const cell = (v, diag = false) => {
    const t = v / 10
    const bg = diag ? '#7c3aed33'
      : t <= 0.2 ? '#22c55e22'
      : t <= 0.4 ? '#84cc1622'
      : t <= 0.6 ? '#eab30822'
      : t <= 0.8 ? '#f9731622'
      : '#ef444422'
    const col = diag ? '#c4b5fd'
      : t <= 0.2 ? '#16a34a'
      : t <= 0.4 ? '#4d7c0f'
      : t <= 0.6 ? '#92400e'
      : t <= 0.8 ? '#c2410c'
      : '#991b1b'
    return `<td style="background:${bg};color:${col};font-weight:700;text-align:center;padding:6px 8px;border-radius:4px;font-family:monospace;font-size:11px">${v.toFixed(1)}</td>`
  }

  const ikpColor = v =>
    v <= 0.2 ? '#16a34a' : v <= 0.4 ? '#65a30d' : v <= 0.6 ? '#b45309' : v <= 0.8 ? '#c2410c' : '#991b1b'

  let html = `<!DOCTYPE html><html lang="uk"><head><meta charset="UTF-8"/>
<title>Шахова дошка криз — Звіт</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=Manrope:wght@400;600;700&display=swap');
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Manrope',sans-serif;background:#fff;color:#1a1a2e;padding:32px;font-size:13px;line-height:1.5}
  h1{font-size:22px;font-weight:700;color:#1a1a2e;margin-bottom:4px}
  h2{font-size:15px;font-weight:700;color:#3730a3;margin:28px 0 12px;border-bottom:2px solid #e0e7ff;padding-bottom:6px}
  h3{font-size:13px;font-weight:700;color:#1a1a2e;margin:18px 0 8px}
  .meta{font-family:'IBM Plex Mono',monospace;font-size:10px;color:#6b7280;margin-bottom:24px}
  .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px}
  .kcard{background:#f5f3ff;border:1px solid #c4b5fd;border-radius:10px;padding:14px}
  .kcard .label{font-size:10px;color:#7c3aed;font-family:'IBM Plex Mono',monospace;font-weight:600;margin-bottom:4px}
  .kcard .val{font-size:28px;font-weight:700;line-height:1}
  .kcard .lv{font-size:11px;margin-top:4px;font-weight:600}
  table{border-collapse:separate;border-spacing:3px;width:100%;margin-bottom:16px}
  th{font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:600;padding:4px 8px;text-align:center;color:#6b7280;background:#f9fafb}
  td{padding:5px 7px;border-radius:4px}
  .section{page-break-inside:avoid}
  .sigma-row{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px}
  .sigma-chip{background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:6px 12px;text-align:center;min-width:90px}
  .sigma-chip .sl{font-size:9px;color:#6b7280;font-family:'IBM Plex Mono',monospace}
  .sigma-chip .sv{font-size:15px;font-weight:700;color:#16a34a;font-family:'IBM Plex Mono',monospace}
  .ikp-row{display:flex;align-items:center;gap:10px;margin-bottom:6px}
  .ikp-label{font-size:11px;color:#374151;width:180px;flex-shrink:0}
  .ikp-track{flex:1;height:8px;background:#f3f4f6;border-radius:4px;overflow:hidden}
  .ikp-fill{height:100%;border-radius:4px}
  .ikp-val{font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:700;min-width:36px;text-align:right}
  footer{margin-top:40px;border-top:1px solid #e5e7eb;padding-top:12px;font-size:10px;color:#9ca3af;font-family:'IBM Plex Mono',monospace}
  @media print{body{padding:16px}@page{margin:16mm}}
</style></head><body>`

  html += `<h1>♟ Шахова дошка криз — Звіт діагностики</h1>
<div class="meta">Метод: Шахова дошка криз · Автор: Козловський Д.О. · ${new Date().toLocaleDateString('uk-UA', { year: 'numeric', month: 'long', day: 'numeric' })}</div>`

  // Summary table
  html += `<h2>Зведена таблиця ранжування</h2>
<table><thead><tr><th>Ранг</th><th style="text-align:left">Організація</th><th>Ksystem</th><th>Рівень кризи</th>
${SPHERES_SHORT.map(s => `<th>${s}</th>`).join('')}
</tr></thead><tbody>`

  const sorted = rows.slice().sort((a,b) => b.ksys - a.ksys)
  sorted.forEach(({ c, ikp, ksys, lvl }, ri) => {
    html += `<tr>
      <td style="text-align:center;font-weight:700;font-size:16px;color:#9ca3af">${ri+1}</td>
      <td style="font-weight:600;color:#1a1a2e;padding:6px 8px">${c.name}</td>
      <td style="text-align:center;font-family:monospace;font-weight:700;font-size:14px;color:${lvl.color}">${ksys.toFixed(3)}</td>
      <td style="text-align:center;font-size:11px;font-weight:600;color:${lvl.color};background:${lvl.color}15;border-radius:6px;padding:4px 8px">${lvl.label}</td>
      ${ikp.map(v => `<td style="text-align:center;font-family:monospace;font-size:10px;font-weight:600;color:${ikpColor(v)}">${v.toFixed(2)}</td>`).join('')}
    </tr>`
  })
  html += `</tbody></table>`

  // Individual boards
  rows.forEach(({ c, ikp, ksys, K, colS, rowS, lvl }) => {
    html += `<div class="section"><h2>${c.name}</h2>
<div class="grid">
  <div class="kcard"><div class="label">KSYSTEM</div><div class="val" style="color:${lvl.color}">${ksys.toFixed(3)}</div><div class="lv" style="color:${lvl.color}">${lvl.label}</div></div>
  <div class="kcard" style="background:#f0f9ff;border-color:#7dd3fc"><div class="label" style="color:#0369a1">НАЙБІЛЬШИЙ ТИСК</div><div class="val" style="color:#0369a1;font-size:14px">${SPHERES_SHORT[colS.indexOf(Math.max(...colS))]}</div><div class="lv" style="color:#0369a1">Σj = ${Math.max(...colS).toFixed(1)}</div></div>
  <div class="kcard" style="background:#fef9ec;border-color:#fcd34d"><div class="label" style="color:#b45309">ГОЛОВНИЙ ТРИГЕР</div><div class="val" style="color:#b45309;font-size:14px">${SPHERES_SHORT[rowS.indexOf(Math.max(...rowS))]}</div><div class="lv" style="color:#b45309">Σi = ${Math.max(...rowS).toFixed(1)}</div></div>
</div>`

    // Matrix
    html += `<h3>Матриця Kij (шахова дошка)</h3>
<table><thead><tr><th style="text-align:left">Джерело / Прояв</th>${SPHERES_SHORT.map(s => `<th>${s}</th>`).join('')}<th style="color:#0891b2">Σi</th></tr>
<tr><td style="font-size:9px;font-family:monospace;color:#9ca3af">ІКПi →</td>
${ikp.map(v => `<td style="text-align:center;font-family:monospace;font-size:10px;font-weight:700;color:${ikpColor(v)}">${v.toFixed(2)}</td>`).join('')}<td></td></tr>
</thead><tbody>`
    K.forEach((row, i) => {
      html += `<tr><td style="font-size:11px;font-weight:500;color:#374151;padding:5px 8px">${SPHERES_FULL[i]}</td>
        ${row.map((v, j) => cell(v, i===j)).join('')}
        <td style="text-align:center;font-family:monospace;font-weight:700;color:#0891b2">${rowS[i].toFixed(1)}</td></tr>`
    })
    html += `<tr><td style="font-size:10px;font-family:monospace;font-weight:700;color:#0891b2">Σj</td>
      ${colS.map(s => `<td style="text-align:center;font-family:monospace;font-weight:700;color:#0891b2;background:#e0f2fe;border-radius:4px">${s.toFixed(1)}</td>`).join('')}<td></td></tr>`
    html += `</tbody></table>`

    // IKP bars
    html += `<h3>Профіль ІКП</h3>`
    SPHERES_FULL.forEach((sp, i) => {
      const v = ikp[i]; const col = ikpColor(v)
      html += `<div class="ikp-row">
        <div class="ikp-label">${sp}</div>
        <div class="ikp-track"><div class="ikp-fill" style="width:${v*100}%;background:${col}"></div></div>
        <div class="ikp-val" style="color:${col}">${v.toFixed(2)}</div>
      </div>`
    })
    html += `</div>`
  })

  html += `<footer>Шахова дошка криз · Козловський Д.О. · Дисертаційне дослідження, 2025 · Сформовано: ${new Date().toLocaleString('uk-UA')}</footer></body></html>`

  const win = window.open('', '_blank')
  if (win) {
    win.document.write(html)
    win.document.close()
    setTimeout(() => win.print(), 800)
  }
}

// ── helpers ──────────────────────────────────────────────────────────────────
function download(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a   = document.createElement('a')
  a.href    = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function timestamp() {
  return new Date().toISOString().slice(0, 10)
}
