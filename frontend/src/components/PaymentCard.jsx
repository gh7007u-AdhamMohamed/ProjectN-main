import React, { useState } from 'react'
import { PencilIcon, Trash2Icon, CheckIcon, XIcon, ShoppingCartIcon, Undo2Icon } from 'lucide-react'
import axios from 'axios'

const PaymentCard = ({ receipt, onDelete, onUpdate }) => {
  const role = sessionStorage.getItem('role')
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})
  const [loadingId, setLoadingId] = useState(null)

  const handleEditClick = (item) => {
    setEditingId(item._id)
    setEditData({
      receiptNumber: item.receiptNumber,
      name: item.name,
      description: item.description,
      amount: item.amount,
      category: item.category,
      date: new Date(item.date).toISOString().split('T')[0]
    })
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditData({})
  }

  const handleSave = async (id) => {
    try {
      const token = sessionStorage.getItem("token")
      await axios.put(`http://localhost:5000/api/receipt/${id}`, editData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      onUpdate()
      setEditingId(null)
    } catch (err) {
      console.log(err)
      alert('Failed to update receipt')
    }
  }

  const handleToggle = async (item) => {
    setLoadingId(item._id)
    const token = sessionStorage.getItem("token")
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

  const handleApprovalToggle = async (item) => {
    const token = sessionStorage.getItem("token")
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
    <div className='grid grid-cols-1 gap-4'>
      {receipt.map((item) => {
        const isEditing = editingId === item._id
        const isPurchased = item.purchased
        const isApproved = item.approvalStatus === "approved"
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
            {/* Header: Receipt ID & Approval Badge */}
            <div className="flex items-center justify-between border-b border-base-200 pb-2">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-base-content/50">#</span>
                  <input
                    type="text"
                    className="input input-bordered input-sm w-32 font-mono font-extrabold text-primary"
                    value={editData.receiptNumber}
                    onChange={(e) => setEditData({ ...editData, receiptNumber: e.target.value })}
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
                    {isApproved ? 'Approved' : 'Pending'}
                  </button>
                ) : (
                  <span className={`badge border-none rounded-full h-8 px-4 font-bold text-xs uppercase tracking-wide ${badgeColorClasses.replace('hover:bg-emerald-200', '').replace('hover:bg-orange-200', '')}`}>
                    {isApproved ? 'Approved' : 'Pending'}
                  </span>
                )}
              </div>
            </div>

            {/* Body: Details & Amount */}
            <div className="flex flex-col md:flex-row justify-between gap-4">

              {/* Info Section */}
              <div className="flex-1 flex flex-col gap-2">
                {isEditing ? (
                  <div className="grid grid-cols-1 gap-2">
                    <input
                      type="text"
                      placeholder="Name/Title"
                      className="input input-bordered input-sm w-full font-bold text-primary"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    />
                    <textarea
                      placeholder="Description"
                      className="textarea textarea-bordered textarea-sm w-full leading-tight"
                      rows={2}
                      value={editData.description}
                      onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    />
                  </div>
                ) : (
                  <>
                    <h3 className="text-lg font-bold text-primary">{item.name}</h3>
                    <p className="text-sm text-base-content/70 leading-relaxed">
                      {item.description || 'No description provided.'}
                    </p>
                  </>
                )}
              </div>

              {/* Amount & Date Section */}
              <div className="flex flex-col md:items-end justify-center gap-2 min-w-[150px]">
                {isEditing ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-base-content/50">EGP</span>
                      <input
                        type="number"
                        className="input input-bordered input-sm w-full"
                        value={editData.amount}
                        onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
                      />
                    </div>
                    <input
                      type="date"
                      className="input input-bordered input-sm w-full"
                      value={editData.date}
                      onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                    />
                  </div>
                ) : (
                  <>
                    <p className="text-2xl font-black text-primary font-mono tracking-tight">
                      {Number(item.amount || 0).toLocaleString()} <span className="text-sm font-bold text-base-content/50">EGP</span>
                    </p>
                    <p className="text-xs font-medium text-base-content/50 bg-base-200 px-2 py-1 rounded-md">
                      {new Date(item.date).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Actions Footer */}
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
                      onClick={() => handleToggle(item)}
                      disabled={isLoading}
                      className={`btn btn-sm shadow-sm ${
                        isPurchased ? 'btn-warning text-warning-content' : 'btn-success text-success-content'
                      }`}
                    >
                      {isLoading ? (
                        <span className="loading loading-spinner loading-xs"></span>
                      ) : isPurchased ? (
                        <Undo2Icon className="size-4" />
                      ) : (
                        <ShoppingCartIcon className="size-4" />
                      )}
                      {isPurchased ? 'Undo Purchase' : 'Mark Purchased'}
                    </button>

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