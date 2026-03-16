import React, { useState } from 'react'
import {
  PencilIcon, Trash2Icon, CheckIcon, XIcon,
  ShoppingCartIcon, Undo2Icon, PlusIcon
} from 'lucide-react'
import axios from 'axios'
import BASE_URL from '../config' 
import toast, { Toaster } from 'react-hot-toast'

const PaymentCard = ({ receipt, onDelete, onUpdate }) => {
  const role = sessionStorage.getItem('role')
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})       // { receiptNumber, name, date }
  const [editItems, setEditItems] = useState([])      // [{ _id?, count, description, price }]
  const [newItem, setNewItem] = useState({ count: '', description: '', price: '' })
  const [loadingId, setLoadingId] = useState(null)
const handlePrint = (item) => {
  const win = window.open('', '_blank', 'width=800,height=600')
win.document.write(`
  <!DOCTYPE html><html><head>
  <meta charset="utf-8"/>
  <title>امر صرف #${item.receiptNumber}</title>
  <style>
    @page { size: A5; margin: 10mm; }
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Segoe UI',sans-serif;background:#fff;color:#0d1b2a;padding:16px;-webkit-print-color-adjust:exact;print-color-adjust:exact;font-size:12px}
    .header{background:#0d1b2a;color:#fff;padding:14px 20px;border-radius:10px 10px 0 0;display:flex;justify-content:space-between;align-items:center}
    .header .title{font-size:16px;font-weight:800}
    .header .meta{font-size:10px;opacity:.6;text-align:right;line-height:1.8}
    .stripe{height:3px;background:linear-gradient(90deg,#2e86ab,#00c6ae,#f4a261);margin-bottom:16px}
    .info-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px}
    .info-box{border:1px solid #e8eef4;border-radius:6px;padding:8px 12px}
    .info-box .lbl{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:#6b7e94;margin-bottom:2px}
    .info-box .val{font-size:13px;font-weight:600;color:#0d1b2a}
    .section-title{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#6b7e94;margin-bottom:6px;padding-bottom:5px;border-bottom:1.5px solid #e8eef4}
    table{width:100%;border-collapse:collapse;font-size:11px;direction:rtl}
    thead tr{background:#0d1b2a}
    thead th{padding:7px 10px;font-weight:600;font-size:10px;color:#fff;text-align:right}
    thead th:last-child{text-align:left}
    tbody tr:nth-child(even){background:#f8fafc}
    tbody tr{border-bottom:1px solid #e8eef4}
    tbody td{padding:7px 10px;text-align:right}
    tbody td:last-child{text-align:left;font-weight:700;color:#1e3a5f}
    .total-row{background:#0d1b2a!important}
    .total-row td{color:#fff!important;font-weight:700;font-size:12px;padding:8px 10px}
    .signature-box{margin-top:24px}
    .footer{text-align:center;font-size:9px;color:#a0adb8;margin-top:16px;padding-top:10px;border-top:1px solid #e8eef4}
  </style>
  </head><body>

    <div class="header">
      <div class="title">🧾 امر صرف</div>
      <div class="meta">
        رقم الامر: #${item.receiptNumber}<br/>
        ${new Date(item.date).toLocaleDateString('ar-EG', { day:'2-digit', month:'long', year:'numeric' })}
      </div>
    </div>
    <div class="stripe"></div>

    <div class="info-grid">
      <div class="info-box">
        <div class="lbl">لصالح</div>
        <div class="val">${item.name}</div>
      </div>
      <div class="info-box">
        <div class="lbl">الإجمالي</div>
        <div class="val">${Number(item.amount || 0).toLocaleString()} EGP</div>
      </div>
    </div>

    <div class="section-title">تفاصيل الاصناف</div>
    <table>
      <thead>
        <tr>
          <th>الصنف</th>
          <th>العدد</th>
          <th>السعر</th>
          <th>الإجمالي</th>
        </tr>
      </thead>
      <tbody>
        ${(item.items || []).map(it => `
          <tr>
            <td>${it.description}</td>
            <td>${it.count}</td>
            <td>${Number(it.price).toLocaleString()} EGP</td>
            <td>${(it.count * it.price).toLocaleString()} EGP</td>
          </tr>
        `).join('')}
        <tr class="total-row">
          <td colspan="3" style="text-align:right;font-size:10px">الإجمالي الكلي</td>
          <td>${Number(item.amount || 0).toLocaleString()} EGP</td>
        </tr>
      </tbody>
    </table>

    <div class="signature-box">
      <div style="margin-top:24px;text-align:left;font-size:11px">(　　　　　　　　) :التوقيع</div>
      <div style="margin-top:10px;text-align:left;font-size:11px;font-weight:700">قائد الوحدة عميد / أحمد ابرهيم أبو الخير</div>
    </div>


  </body></html>
`)
  win.document.close()
  win.focus()
  setTimeout(() => { win.print(); win.close() }, 500)
}
  const handleEditClick = (item) => {
    setEditingId(item._id)
    setEditData({
      receiptNumber: item.receiptNumber,
      name: item.name,
      date: new Date(item.date).toISOString().split('T')[0],
    })
    setEditItems((item.items || []).map(i => ({ ...i })))
    setNewItem({ count: '', description: '', price: '' })
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditData({})
    setEditItems([])
  }

  const handleRemoveEditItem = (index) => {
    setEditItems(prev => prev.filter((_, i) => i !== index))
  }

  const handleAddEditItem = () => {
    if (!newItem.count || !newItem.description || !newItem.price) return
    setEditItems(prev => [
      ...prev,
      { count: Number(newItem.count), description: newItem.description, price: Number(newItem.price) }
    ])
    setNewItem({ count: '', description: '', price: '' })
  }

  const editTotal = editItems.reduce((s, i) => s + Number(i.count) * Number(i.price), 0)

  const handleSave = async (id) => {
    try {
      const token = sessionStorage.getItem('token')
      await axios.put(
        `${BASE_URL}/api/receipt/${id}`,
        { name: editData.name, date: editData.date, items: editItems },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      onUpdate()
      setEditingId(null)
    } catch (err) {
      console.log(err)
      alert('Failed to update receipt')
    }
  }

  // ── Purchase toggle ──────────────────────────────────────────────
  const handleToggle = async (item) => {
    setLoadingId(item._id)
    const token = sessionStorage.getItem('token')
    try {
      if(!item.purchased)
        {
      const walletRes = await axios.get(`${BASE_URL}/api/receipt/wallet`, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
    })
        const balance = walletRes.data?.totalBalance || 0
    if (balance - item.amount < 0) {
      toast.error(`الرصيد غير كافي — الرصيد الحالي: ${balance.toLocaleString()} EGP`, {
        id: 'insufficient-balance', 
      });
      return
    }
      }



      await axios.patch(
       `${BASE_URL}/api/receipt/${item._id}/purchase`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (onUpdate) onUpdate()
    } catch (err) {
      alert(err.message)
    } finally {
      setLoadingId(null)
    }
  }

  const handleApprovalToggle = async (item) => {
    const token = sessionStorage.getItem('token')
    try {
      await axios.patch(
        `${BASE_URL}/api/receipt/${item._id}/approval`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (onUpdate) onUpdate()
    } catch (err) {
      alert(err.message)
    }
  }

  if (!receipt || receipt.length === 0) {
    return (
      <div className="text-center p-10 text-base-content/50 bg-base-100 rounded-2xl border border-base-300 border-dashed">
        No payment orders found.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {receipt.map((item) => {
        const isEditing = editingId === item._id
        const isPurchased = item.purchased
        const isApproved = item.approvalStatus === 'approved'
        const isLoading = loadingId === item._id

        const badgeColorClasses = isApproved
          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
          : 'bg-orange-100 text-orange-800 hover:bg-orange-200'

        const borderIndicator = isPurchased
          ? 'border-l-success'
          : isApproved ? 'border-l-info' : 'border-l-warning'

        return (
          <div
            key={item._id}
            className={`relative max-w-4xl mx-auto w-full bg-base-100 border border-base-300 border-l-4 rounded-2xl p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-all duration-200 ${borderIndicator} ${isPurchased ? 'opacity-80 bg-base-200/50' : ''}`}
          >
            {/* ── Header ── */}
            <div className="flex items-center justify-between border-b border-base-200 pb-2">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-base-content/50">#</span>
                  <span className="font-mono font-extrabold text-primary">{editData.receiptNumber}</span>
                  <span className="font-mono font-extrabold text-primary">{item.name}</span>
                  <input
                    type="text"
                    className="input input-bordered input-sm w-40 font-bold text-primary"
                    placeholder="Name"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-56">
                  <span className="text-sm font-mono font-semibold text-base-content/60 bg-base-200 px-2 py-1 rounded-md">
                    #{item.receiptNumber}
                  </span>
                  <span className="text-sm font-mono font-semibold text-base-content bg-base-200 px-2 py-1 rounded-md">لصالح: {item.name}</span>
                  {isPurchased && (
                    <span className="badge badge-sm badge-success font-semibold">Purchased</span>
                  )}
                </div>
              )}

              <div>
                {role === 'superUser' ? (
                  <button
                    onClick={() => handleApprovalToggle(item)}
                    className={`badge border-none rounded-full h-8 px-4 font-bold text-xs uppercase tracking-wide transition-colors ${badgeColorClasses}`}
                  >
                    {isApproved ? 'تم التصديق' : 'لم يتم التصديق'}
                  </button>
                ) : (
                  <span className={`badge border-none rounded-full h-8 px-4 font-bold text-xs uppercase tracking-wide ${badgeColorClasses.replace('hover:bg-emerald-200', '').replace('hover:bg-orange-200', '')}`}>
                    {isApproved ? 'تم التصديق' : 'لم يتم التصديق'}
                  </span>
                )}
              </div>
            </div>

            {/* ── Body ── */}
            <div className="flex flex-col md:flex-row justify-between gap-4">

              {/* Items list */}
              <div className="flex-1 flex flex-col gap-2">

                {isEditing ? (
                  <div className="flex flex-col gap-2" dir="rtl">
                    {/* Column headers */}
                    <div className="grid grid-cols-[2fr_1fr_1.5fr_auto] gap-2 text-xs font-bold text-base-content/60 px-2">
                      <span>الصنف</span>
                      <span className="text-center">العدد</span>
                      <span className="text-center">السعر</span>
                      
                      <span />
                    </div>

                    {/* Existing / edited items */}
                    {editItems.map((ei, index) => (
                      <div key={index} className="grid grid-cols-[2fr_1fr_1.5fr_auto] gap-2 items-center bg-base-200/40 border border-base-200/60 rounded-lg px-2 py-1">
                        <input
                          className="input input-bordered input-xs w-full"
                          value={ei.description}
                          onKeyDown={(e) => {
                              if (e.key === '-' || e.key === 'e') {
                                e.preventDefault();
                              }
                            }}
                          onChange={(e) => {
                            const updated = [...editItems]
                            updated[index].description = e.target.value
                            setEditItems(updated)
                          }}
                        />
                        <input
                          type="number"
                          className="input input-bordered input-xs w-full text-center"
                          value={ei.count}
                           min="1"

                          onKeyDown={(e) => {
                              if (e.key === '-' || e.key === 'e') {
                                e.preventDefault();
                              }
                            }}
                          onChange={(e) => {
                            
                            const updated = [...editItems]
                            updated[index].count = e.target.value
                            setEditItems(updated)
                          }}
                        />
                        <input
                          type="number"
                          className="input input-bordered input-xs w-full text-end"
                          value={ei.price}
                           min="1"
                          onKeyDown={(e) => {
                        if (e.key === '-' || e.key === 'e') {
                          e.preventDefault();
                        }
                      }}
                          onChange={(e) => {
                            const updated = [...editItems]
                            updated[index].price = e.target.value
                            setEditItems(updated)
                          }}
                        />
                        {/* × delete button */}
                        <button
                          className="btn btn-xs btn-circle btn-ghost hover:bg-error/10 hover:text-error"
                          onClick={() => handleRemoveEditItem(index)}
                          title="Remove item"
                        >
                          <XIcon className="size-3" />
                        </button>
                      </div>
                    ))}

                    {/* Add new item row */}
                    <div className="grid grid-cols-[2fr_1fr_1.5fr_auto] gap-2 items-center mt-1">
                      <input
                        className="input input-bordered input-xs w-full"
                        placeholder="الصنف"
                        value={newItem.description}
                        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                      />
                      <input
                        type="number"
                        className="input input-bordered input-xs w-full text-center"
                        placeholder="العدد"
                       min="1"
                        value={newItem.count}
                        onKeyDown={(e) => {
                        if (e.key === '-' || e.key === 'e') {
                          e.preventDefault();
                        }
                      }}
                        onChange={(e) => setNewItem({ ...newItem, count: e.target.value })}
                      />
                      <input
                        type="number"
                        className="input input-bordered input-xs w-full text-end"
                        placeholder="السعر"
                         min="1"
                        value={newItem.price}
                        onKeyDown={(e) => {
                        if (e.key === '-' || e.key === 'e') {
                          e.preventDefault();
                        }
                      }}
                        onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                      />
                      <button
                        className="btn btn-xs btn-circle btn-primary"
                        onClick={handleAddEditItem}
                        title="Add item"
                      >
                        <PlusIcon className="size-3" />
                      </button>
                    </div>

                    {/* Running total */}
                    <div className="text-end text-sm font-bold text-primary mt-1 px-2">
                      الإجمالي: {editTotal.toLocaleString()} EGP
                    </div>
                  </div>
                ) : (
                      <div className="flex flex-col gap-1.5" dir="rtl">
                        <div className="grid grid-cols-[2fr_1fr_1fr_1.5fr] gap-3 text-xs font-bold text-base-content/60 px-4 mb-1">
                          <span className="text-start">الصنف</span>
                          <span className="pr-[10px]">العدد</span>
                          <span className=" pr-[68px]">السعر</span>
                         <span className="text-end">الإجمالي</span>

                        </div>
                    {(item.items || []).map((line, index) => (
                      <div
                        key={line._id || index}
                        className="grid grid-cols-[2fr_1fr_1.5fr_1fr] gap-3 text-sm bg-base-200/40 hover:bg-base-200 border border-base-200/60 px-4 py-2 rounded-lg transition-all items-center"
                      >
                        <span className="font-semibold text-base-content text-start truncate" title={line.description}>
                          {line.description}
                        </span>
                        <span className="pr-[19px] text-base-content/70 font-medium">{line.count}</span>
                        <span className="text-center text-base-content/70 font-medium">{Number(line.price).toLocaleString()} EGP</span>
                        <span className="text-end text-base-content/70 font-bold text-primary">
                          {(Number(line.count) * Number(line.price)).toLocaleString()} EGP
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Amount & Date */}

              <div className="flex flex-col md:items-end justify-center gap-2 min-w-[150px]">
                
                {isEditing ? (
                  <input
                    type="date"
                    className="input input-bordered input-sm w-full"
                    value={editData.date}
                    onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                  />
                ) : (

                  <>
                    <p className="text-2xl font-black text-primary font-mono tracking-tight">
                      {Number(item.amount || 0).toLocaleString()}{' '}
                      <span className="text-sm font-bold text-base-content/50">EGP</span>
                    </p>
                    <p className="text-xs font-medium text-base-content/50 bg-base-200 px-2 py-1 rounded-md">
                      {new Date(item.date).toLocaleDateString(undefined, {
                        year: 'numeric', month: 'short', day: 'numeric',
                      })}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* ── Actions Footer ── */}
{role !== 'admin' && (
  <button
    onClick={() => handlePrint(item)}
    className="btn btn-sm btn-ghost hover:bg-base-200 gap-1 ml-auto"
  >
    🖨 طباعة
  </button>
)}

            {role === 'admin' && (
              <div className="flex justify-end gap-2 pt-2 border-t border-base-200 mt-2">
                {isEditing ? (
                  <>
                    <button className="btn btn-sm btn-ghost hover:bg-base-200" onClick={handleCancel}>
                      <XIcon className="size-4" /> Cancel
                    </button>
                    <button className="btn btn-sm btn-success text-success-content" onClick={() => handleSave(item._id)}>
                      <CheckIcon className="size-4" /> Save Changes
                    </button>
                  </>
                ) : (
                  <>
                      <button
                        onClick={() => handlePrint(item)}
                        className="btn btn-sm btn-ghost hover:bg-base-200 gap-1"
                      >
                        🖨 طباعة
                      </button>
                    {isApproved && (
                      <button
                        onClick={() => handleToggle(item)}
                        disabled={isLoading}
                        className={`btn btn-sm shadow-sm ${isPurchased ? 'btn-warning text-warning-content' : 'btn-success text-success-content'}`}
                      >
                        {isLoading ? (
                          <span className="loading loading-spinner loading-xs" />
                        ) : isPurchased ? (
                          <Undo2Icon className="size-4" />
                        ) : (
                          <ShoppingCartIcon className="size-4" />
                        )}
                        {isPurchased ? 'الغاء عمليه الدفع' : 'تم الدفع'}
                      </button>
                    )}
                    {!isPurchased && (
                      <div className="flex gap-2 ml-2 border-l border-base-300 pl-2">
                        <button
                          className="btn btn-sm btn-square btn-ghost hover:bg-info/10 hover:text-info transition-colors"
                          onClick={() => handleEditClick(item)}
                          title="Edit"
                        >
                          <PencilIcon className="size-4" />
                        </button>
                        <button
                          className="btn btn-sm btn-square btn-ghost hover:bg-error/10 hover:text-error transition-colors"
                          onClick={() => onDelete(item._id)}
                          title="Delete"
                        >
                          <Trash2Icon className="size-4" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default PaymentCard