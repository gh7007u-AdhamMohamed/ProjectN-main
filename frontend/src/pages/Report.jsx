import React, { useState, useRef } from 'react'
import NavbarR from '../components/NavbarR'
import axios from 'axios'

/* ─── tiny print helper ────────────────────────────────────────────────── */
const printSection = (id) => {
  const el = document.getElementById(id)
  if (!el) return
  const win = window.open('', '_blank', 'width=900,height=700')
  win.document.write(`
    <!DOCTYPE html><html><head>
    <meta charset="utf-8"/>
    <title>Print</title>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700&family=Sora:wght@300;400;600;700;800&display=swap" rel="stylesheet"/>
    <style>
      *{box-sizing:border-box;margin:0;padding:0}
      body{font-family:'Sora',sans-serif;background:#fff;color:#0d1b2a;padding:32px;-webkit-print-color-adjust:exact;print-color-adjust:exact}
      .print-root{max-width:800px;margin:0 auto}
      .brand-bar{background:#0d1b2a;color:#fff;padding:18px 28px;border-radius:12px 12px 0 0;display:flex;justify-content:space-between;align-items:center;margin-bottom:0}
      .brand-bar .title{font-size:20px;font-weight:800;letter-spacing:-0.5px}
      .brand-bar .meta{font-family:'IBM Plex Mono',monospace;font-size:11px;opacity:.65;text-align:right;line-height:1.6}
      .accent-stripe{height:4px;background:linear-gradient(90deg,#2e86ab,#00c6ae,#f4a261);margin-bottom:28px;border-radius:0 0 4px 4px}
      .kpi-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:28px}
      .kpi{border:1.5px solid #e8eef4;border-radius:10px;padding:16px 20px}
      .kpi .lbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:#6b7e94;margin-bottom:4px}
      .kpi .val{font-family:'IBM Plex Mono',monospace;font-size:22px;font-weight:700;color:#0d1b2a}
      .kpi .sub{font-size:10px;color:#6b7e94;margin-top:2px}
      .kpi.primary{background:#0d1b2a;border-color:#0d1b2a}
      .kpi.primary .lbl,.kpi.primary .val,.kpi.primary .sub{color:#fff}
      .kpi.primary .lbl{opacity:.6}
      .kpi.primary .sub{opacity:.5}
      .section-title{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#6b7e94;margin-bottom:10px;padding-bottom:6px;border-bottom:1.5px solid #e8eef4}
      table{width:100%;border-collapse:collapse;margin-bottom:28px;font-size:13px}
      thead tr{background:#0d1b2a;color:#fff}
      thead th{padding:10px 14px;font-weight:600;font-size:11px;letter-spacing:.5px;text-transform:uppercase;text-align:left}
      thead th:last-child,thead th:nth-child(3),thead th:nth-child(4){text-align:right}
      tbody tr:nth-child(even){background:#f8fafc}
      tbody tr{border-bottom:1px solid #e8eef4}
      tbody td{padding:9px 14px;vertical-align:top}
      tbody td:last-child,tbody td:nth-child(3),tbody td:nth-child(4){text-align:right;font-family:'IBM Plex Mono',monospace;font-weight:600}
      .receipt-num{font-family:'IBM Plex Mono',monospace;font-size:11px;color:#2e86ab;font-weight:700}
      .badge{display:inline-block;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px}
      .badge-approved{background:#d4edda;color:#155724}
      .badge-pending{background:#fff3cd;color:#856404}
      .badge-purchased{background:#d1ecf1;color:#0c5460}
      .items-sub{margin-top:6px}
      .items-sub table{margin-bottom:0;font-size:11px}
      .items-sub thead tr{background:#1e3a5f}
      .items-sub thead th{padding:6px 10px;font-size:10px}
      .items-sub tbody td{padding:5px 10px;background:transparent}
      .items-sub tbody tr{background:transparent!important;border-color:#eef2f6}
      .total-row{background:#0d1b2a!important;color:#fff}
      .total-row td{color:#fff;font-family:'IBM Plex Mono',monospace;font-weight:700;font-size:14px;padding:12px 14px}
      .footer{text-align:center;font-size:10px;color:#a0adb8;margin-top:24px;padding-top:16px;border-top:1px solid #e8eef4;font-family:'IBM Plex Mono',monospace}
      @media print{body{padding:16px}.kpi-grid{grid-template-columns:repeat(3,1fr)}}
    </style>
    </head><body>
    <div class="print-root">${el.innerHTML}</div>
    </body></html>
  `)
  win.document.close()
  win.focus()
  setTimeout(() => { win.print(); win.close() }, 600)
}

/* ─── Receipt Report ───────────────────────────────────────────────────── */
const ReceiptReport = () => {
  const [range, setRange]   = useState({ start: '', end: '' })
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [sum, setSum]         = useState(0)

  const handleSearch = async () => {
    if (!range.start || !range.end) return
    setLoading(true)
    try {
      const res = await axios.get('http://localhost:5000/api/receipt/report', {
        params: { receipeNumber: range.start, endNumber: range.end }
      })
      setSum(res.data.totalAmount)
      setResults(res.data.data)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const purchased = results.filter(r => r.purchased)
  const approved  = results.filter(r => r.approvalStatus === 'approved')

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input type="number" placeholder="Start #" className="input input-bordered w-full font-mono"
          value={range.start} onChange={e => setRange({ ...range, start: e.target.value })} />
        <input type="number" placeholder="End #" className="input input-bordered w-full font-mono"
          value={range.end} onChange={e => setRange({ ...range, end: e.target.value })} />
        <button onClick={handleSearch} disabled={loading} className="btn btn-primary px-8 shrink-0">
          {loading ? <span className="loading loading-spinner loading-sm"/> : 'Generate'}
        </button>
        {results.length > 0 && (
          <button onClick={() => printSection('receipt-print')} className="btn btn-outline btn-secondary shrink-0 gap-2">
            🖨 Print
          </button>
        )}
      </div>

      {/* Empty state */}
      {results.length === 0 && !loading && (
        <div className="text-center py-20 rounded-2xl border-2 border-dashed border-base-300 text-base-content/30 italic">
          Enter a range and click Generate
        </div>
      )}

      {/* ── Printable area ── */}
      {results.length > 0 && (
        <div id="receipt-print">
          {/* Brand bar */}
          <div className="brand-bar">
            <div className="title">🧾 Receipt Report</div>
            <div className="meta">
              Range #{range.start} — #{range.end}<br/>
              {new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'long', year:'numeric' })}
            </div>
          </div>
          <div className="accent-stripe"/>

          {/* KPIs */}
          <div className="kpi-grid">
            <div className="kpi primary">
              <div className="lbl">Total Amount</div>
              <div className="val">{sum.toLocaleString()}</div>
              <div className="sub">Egyptian Pound</div>
            </div>
            <div className="kpi">
              <div className="lbl">Orders Found</div>
              <div className="val">{results.length}</div>
              <div className="sub">receipts in range</div>
            </div>
            <div className="kpi">
              <div className="lbl">Purchased</div>
              <div className="val">{purchased.length}</div>
              <div className="sub">{approved.length} approved</div>
            </div>
          </div>

          {/* Section title */}
          <div className="section-title">Order Details</div>

          {/* Table */}
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {results.map((item, idx) => (
                <React.Fragment key={item._id}>
                  <tr>
                    <td>
                      <span className="receipt-num">#{item.receiptNumber}</span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{item.name}</td>
                    <td>{new Date(item.date).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })}</td>
                    <td>{(item.amount || 0).toLocaleString()} <span style={{fontSize:10,opacity:.5}}>EGP</span></td>
                    <td>
                      <span className={`badge ${item.approvalStatus === 'approved' ? 'badge-approved' : 'badge-pending'}`}>
                        {item.approvalStatus}
                      </span>
                      {item.purchased && <span className="badge badge-purchased" style={{marginLeft:4}}>Purchased</span>}
                    </td>
                  </tr>

                  {/* Items sub-table */}
                  {(item.items || []).length > 0 && (
                    <tr>
                      <td/>
                      <td colSpan={4}>
                        <div className="items-sub">
                          <table>
                            <thead>
                              <tr>
                                <th>Item</th>
                                <th>Qty</th>
                                <th>Unit Price</th>
                                <th>Line Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {item.items.map((it, i) => (
                                <tr key={i}>
                                  <td>{it.description}</td>
                                  <td style={{textAlign:'right'}}>{it.count}</td>
                                  <td style={{textAlign:'right'}}>{Number(it.price).toLocaleString()} EGP</td>
                                  <td style={{textAlign:'right'}}>{(it.count * it.price).toLocaleString()} EGP</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}

              {/* Total row */}
              <tr className="total-row">
                <td colSpan={3} style={{textAlign:'right', letterSpacing:'1px', textTransform:'uppercase', fontSize:11}}>Grand Total</td>
                <td>{sum.toLocaleString()} EGP</td>
                <td/>
              </tr>
            </tbody>
          </table>

          <div className="footer">
            ProjectN · Exported {new Date().toLocaleString('en-GB')} · {results.length} records
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Wallet Report ────────────────────────────────────────────────────── */
const WalletReport = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleFetch = async () => {
    setLoading(true)
    try {
      const token = sessionStorage.getItem('token')
      const headers = { Authorization: `Bearer ${token}` }

      const [walletRes, historyRes] = await Promise.all([
        axios.get('http://localhost:5000/api/receipt/wallet', { headers }),
        axios.get('http://localhost:5000/api/receipt/history', { headers }),
      ])
      setData({ wallet: walletRes.data, history: historyRes.data })
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const history = data?.history || []
  const wallet   = data?.wallet
  const added    = history.filter(h => h.type === 'addMoney').reduce((s, h) => s + h.amount, 0)
  const spent    = history.filter(h => h.type === 'purchase').reduce((s, h) => s + h.amount, 0)
  const resets   = history.filter(h => h.type === 'reset').length

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="flex gap-3">
        <button onClick={handleFetch} disabled={loading} className="btn btn-primary px-8">
          {loading ? <span className="loading loading-spinner loading-sm"/> : 'Load Wallet Report'}
        </button>
        {data && (
          <button onClick={() => printSection('wallet-print')} className="btn btn-outline btn-secondary gap-2">
            🖨 Print
          </button>
        )}
      </div>

      {!data && !loading && (
        <div className="text-center py-20 rounded-2xl border-2 border-dashed border-base-300 text-base-content/30 italic">
          Click Load to generate wallet report
        </div>
      )}

      {data && (
        <div id="wallet-print">
          <div className="brand-bar">
            <div className="title">💰 Wallet Report</div>
            <div className="meta">
              {new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'long', year:'numeric' })}<br/>
              {history.length} transactions
            </div>
          </div>
          <div className="accent-stripe"/>

          {/* KPIs */}
          <div className="kpi-grid">
            <div className="kpi primary">
              <div className="lbl">Current Balance</div>
              <div className="val">{(wallet?.totalBalance || 0).toLocaleString()}</div>
              <div className="sub">Egyptian Pound</div>
            </div>
            <div className="kpi">
              <div className="lbl">Total Added</div>
              <div className="val">{added.toLocaleString()}</div>
              <div className="sub">across {history.filter(h=>h.type==='addMoney').length} deposits</div>
            </div>
            <div className="kpi">
              <div className="lbl">Total Spent</div>
              <div className="val">{spent.toLocaleString()}</div>
              <div className="sub">{resets} reset{resets !== 1 ? 's' : ''}</div>
            </div>
          </div>

          <div className="section-title">Transaction History</div>

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Type</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Receipt Ref</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h, idx) => (
                <tr key={h._id}>
                  <td style={{fontFamily:'monospace', fontSize:11, opacity:.6}}>{idx + 1}</td>
                  <td>
                    <span className={`badge ${
                      h.type === 'addMoney'  ? 'badge-approved' :
                      h.type === 'purchase'  ? 'badge-purchased' :
                      'badge-pending'
                    }`}>
                      {h.type === 'addMoney' ? '+ Add Money' : h.type === 'purchase' ? '− Purchase' : '⟳ Reset'}
                    </span>
                  </td>
                  <td>{new Date(h.date || h.createdAt).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })}</td>
                  <td style={{
                    fontFamily:'monospace', fontWeight:700,
                    color: h.type === 'addMoney' ? '#155724' : h.type === 'purchase' ? '#721c24' : '#856404'
                  }}>
                    {h.type === 'addMoney' ? '+' : h.type === 'purchase' ? '−' : ''}
                    {(h.amount || 0).toLocaleString()} EGP
                  </td>
                  <td style={{fontFamily:'monospace', fontSize:11, opacity:.5}}>
                    {h.receiptId ? `ref: ${h.receiptId}` : '—'}
                  </td>
                </tr>
              ))}

              <tr className="total-row">
                <td colSpan={3} style={{textAlign:'right', letterSpacing:'1px', textTransform:'uppercase', fontSize:11}}>Current Balance</td>
                <td>{(wallet?.totalBalance || 0).toLocaleString()} EGP</td>
                <td/>
              </tr>
            </tbody>
          </table>

          <div className="footer">
            ProjectN · Exported {new Date().toLocaleString('en-GB')} · {history.length} transactions
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Page ─────────────────────────────────────────────────────────────── */
const Report = () => {
  const [tab, setTab] = useState('receipts')

  return (
    <>
      <style>{`
        /* ── shared print styles injected into the live page too ── */
        .brand-bar{background:#0d1b2a;color:#fff;padding:18px 28px;border-radius:12px 12px 0 0;display:flex;justify-content:space-between;align-items:center}
        .title{font-size:18px;font-weight:800;letter-spacing:-.5px}
        .meta{font-family:'IBM Plex Mono',monospace;font-size:11px;opacity:.55;text-align:right;line-height:1.6}
        .accent-stripe{height:4px;background:linear-gradient(90deg,#2e86ab,#00c6ae,#f4a261);margin-bottom:24px;border-radius:0 0 4px 4px}
        .kpi-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:24px}
        .kpi{border:1.5px solid oklch(var(--b3));border-radius:10px;padding:16px 20px;background:oklch(var(--b1))}
        .kpi .lbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;opacity:.5;margin-bottom:4px}
        .kpi .val{font-family:'IBM Plex Mono',monospace;font-size:22px;font-weight:700}
        .kpi .sub{font-size:10px;opacity:.45;margin-top:2px}
        .kpi.primary{background:#0d1b2a!important;border-color:#0d1b2a}
        .kpi.primary .lbl,.kpi.primary .val,.kpi.primary .sub{color:#fff!important}
        .section-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;opacity:.4;margin-bottom:10px;padding-bottom:6px;border-bottom:1.5px solid oklch(var(--b3))}
        table{width:100%;border-collapse:collapse;margin-bottom:24px;font-size:13px}
        thead tr{background:#0d1b2a}
        thead th{padding:10px 14px;font-weight:600;font-size:11px;letter-spacing:.5px;text-transform:uppercase;text-align:left;color:#fff}
        thead th:last-child,thead th:nth-child(4),thead th:nth-child(3){text-align:right}
        tbody tr:nth-child(even){background:oklch(var(--b2))}
        tbody tr{border-bottom:1px solid oklch(var(--b3))}
        tbody td{padding:9px 14px;vertical-align:top}
        tbody td:last-child,tbody td:nth-child(4),tbody td:nth-child(3){text-align:right;font-family:'IBM Plex Mono',monospace;font-weight:600}
        .receipt-num{font-family:'IBM Plex Mono',monospace;font-size:11px;color:#2e86ab;font-weight:700}
        .badge{display:inline-block;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px}
        .badge-approved{background:#d4edda;color:#155724}
        .badge-pending{background:#fff3cd;color:#856404}
        .badge-purchased{background:#d1ecf1;color:#0c5460}
        .items-sub table{font-size:11px;margin-bottom:0}
        .items-sub thead tr{background:#1e3a5f}
        .items-sub thead th{padding:6px 10px;font-size:10px}
        .items-sub tbody td{padding:5px 10px}
        .items-sub tbody tr{background:transparent!important;border-color:oklch(var(--b3))}
        .total-row{background:#0d1b2a!important}
        .total-row td{color:#fff!important;font-family:'IBM Plex Mono',monospace;font-weight:700;font-size:14px;padding:12px 14px}
        .footer{text-align:center;font-size:10px;opacity:.35;margin-top:20px;padding-top:14px;border-top:1px solid oklch(var(--b3));font-family:'IBM Plex Mono',monospace}
        @media print{.no-print{display:none!important}}
      `}</style>

      <NavbarR />

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">

        {/* Page header */}
        <div>
          <h1 className="text-3xl font-black tracking-tight">Reports</h1>
          <p className="text-base-content/40 text-sm mt-1">Generate & print financial reports</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-base-200 p-1 rounded-xl w-fit no-print">
          {[['receipts','🧾 Receipt Report'],['wallet','💰 Wallet Report']].map(([k,l]) => (
            <button key={k} onClick={() => setTab(k)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab===k ? 'bg-base-100 shadow text-primary' : 'text-base-content/50 hover:text-base-content'}`}>
              {l}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-base-100 rounded-2xl border border-base-300 p-6 shadow-sm">
          {tab === 'receipts' ? <ReceiptReport /> : <WalletReport />}
        </div>

      </div>
    </>
  )
}

export default Report