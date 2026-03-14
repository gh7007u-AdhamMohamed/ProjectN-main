import React, { useState } from 'react'
import {
  PencilIcon, Trash2Icon, CheckIcon, XIcon,
  ShoppingCartIcon, Undo2Icon, PlusIcon
} from 'lucide-react'
import axios from 'axios'

const PaymentCard = ({ receipt, onDelete, onUpdate }) => {
  const role = sessionStorage.getItem('role')
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})       // { receiptNumber, name, date }
  const [editItems, setEditItems] = useState([])      // [{ _id?, count, description, price }]
  const [newItem, setNewItem] = useState({ count: '', description: '', price: '' })
  const [loadingId, setLoadingId] = useState(null)

  // ── Enter edit mode ──────────────────────────────────────────────
  const handleEditClick = (item) => {
    setEditingId(item._id)
    setEditData({
      receiptNumber: item.receiptNumber,
      name: item.name,
      date: new Date(item.date).toISOString().split('T')[0],
    })
    // clone items so we can mutate locally
    setEditItems((item.items || []).map(i => ({ ...i })))
    setNewItem({ count: '', description: '', price: '' })
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditData({})
    setEditItems([])
  }

  // ── Delete an item row in edit mode ─────────────────────────────
  const handleRemoveEditItem = (index) => {
    setEditItems(prev => prev.filter((_, i) => i !== index))
  }

  // ── Add a new item row in edit mode ─────────────────────────────
  const handleAddEditItem = () => {
    if (!newItem.count || !newItem.description || !newItem.price) return
    setEditItems(prev => [
      ...prev,
      { count: Number(newItem.count), description: newItem.description, price: Number(newItem.price) }
    ])
    setNewItem({ count: '', description: '', price: '' })
  }

  const editTotal = editItems.reduce((s, i) => s + Number(i.count) * Number(i.price), 0)

  // ── Save ─────────────────────────────────────────────────────────
  const handleSave = async (id) => {
    try {
      const token = sessionStorage.getItem('token')
      await axios.put(
        `http://localhost:5000/api/receipt/${id}`,
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
      await axios.patch(
        `http://localhost:5000/api/receipt/${item._id}/purchase`,
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

  // ── Approval toggle ──────────────────────────────────────────────
  const handleApprovalToggle = async (item) => {
    const token = sessionStorage.getItem('token')
    try {
      await axios.patch(
        `http://localhost:5000/api/receipt/${item._id}/approval`,
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
                  <input
                    type="text"
                    className="input input-bordered input-sm w-40 font-bold text-primary"
                    placeholder="Name"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono font-semibold text-base-content/60 bg-base-200 px-2 py-1 rounded-md">
                    #{item.receiptNumber}
                  </span>
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
                      <span className="text-end">السعر</span>
                      <span />
                    </div>

                    {/* Existing / edited items */}
                    {editItems.map((ei, index) => (
                      <div key={index} className="grid grid-cols-[2fr_1fr_1.5fr_auto] gap-2 items-center bg-base-200/40 border border-base-200/60 rounded-lg px-2 py-1">
                        <input
                          className="input input-bordered input-xs w-full"
                          value={ei.description}
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
                        value={newItem.count}
                        onChange={(e) => setNewItem({ ...newItem, count: e.target.value })}
                      />
                      <input
                        type="number"
                        className="input input-bordered input-xs w-full text-end"
                        placeholder="السعر"
                        value={newItem.price}
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
                  /* ── Display mode ── */
                  <div className="flex flex-col gap-1.5" dir="rtl">
                    <div className="grid grid-cols-[2fr_1fr_1.5fr] gap-3 text-xs font-bold text-base-content/60 px-4 mb-1">
                      <span className="text-start">الصنف</span>
                      <span className="text-center">العدد</span>
                      <span className="text-end">السعر</span>
                    </div>
                    {(item.items || []).map((line, index) => (
                      <div
                        key={line._id || index}
                        className="grid grid-cols-[2fr_1fr_1.5fr] gap-3 text-sm bg-base-200/40 hover:bg-base-200 border border-base-200/60 px-4 py-2 rounded-lg transition-all items-center"
                      >
                        <span className="font-semibold text-base-content text-start truncate" title={line.description}>
                          {line.description}
                        </span>
                        <span className="text-center text-base-content/70 font-medium">{line.count}</span>
                        <span className="text-end font-bold text-primary">{Number(line.price).toLocaleString()} EGP</span>
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