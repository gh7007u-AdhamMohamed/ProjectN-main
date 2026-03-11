import React, { useState } from 'react'
import { PencilIcon, Trash2Icon, CheckIcon, XIcon, ShoppingCartIcon } from 'lucide-react'
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

  return (
    <div className='grid grid-cols-1 gap-4'>
      {receipt.map((item) => {
        const isEditing = editingId === item._id
        const isPurchased = item.purchased
        const isApproved = item.approvalStatus === "approved"
        const isLoading = loadingId === item._id

        return (
          <div
            key={item._id}
            className='hover:bg-base-200 hover:border-primary/40 max-w-4xl mx-auto w-full bg-base-100 border border-base-300 rounded-2xl p-5 flex flex-col gap-3 shadow-md'
          >
            {/* Header */}
            <div className='flex items-center justify-between'>
              {isEditing ? (
                <input
                  type='text'
                  className='input input-bordered input-sm w-full font-mono font-extrabold text-primary'
                  value={editData.receiptNumber}
                  onChange={(e) => setEditData({ ...editData, receiptNumber: e.target.value })}
                />
              ) : (
                <span className='text-xs font-mono text-base-content/50'>
                  #{item.receiptNumber}
                </span>
              )}

<div>
  {role === 'superUser' ? (
    <button
      onClick={() => handleApprovalToggle(item)}
      className={`badge badge-lg border-none rounded-full cursor-pointer h-10 px-6 font-medium transition-colors ${
        isApproved 
          ? 'bg-emerald-100 text-emerald-800' // Soft Sage/Moss
          : 'bg-orange-100 text-orange-800'    // Soft Autumn Leaf/Amber
      }`}
    >
      {isApproved ? 'approved' : 'pending'}
    </button>
  ) : (
    <span className={`badge badge-lg border-none rounded-full h-10 px-6 font-medium ${
      isApproved 
        ? 'bg-emerald-100 text-emerald-800' 
        : 'bg-orange-100 text-orange-800'
    }`}>
      {isApproved ? 'approved' : 'pending'}
    </span>
  )}
</div>
            </div>

            {/* Name & Description */}
            <div className='flex flex-col gap-1'>
              {isEditing ? (
                <>
                  <input
                    type='text'
                    className='input input-bordered input-sm w-full font-mono font-extrabold text-primary'
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  />
                  <input
                    type='text'
                    className='input input-bordered input-sm w-full text-sm'
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  />
                </>
              ) : (
                <>
                  <h3 className='text-sm font-extrabold text-primary font-mono'>{item.name}</h3>
                  <p className='text-sm text-base-content/60'>{item.description}</p>
                </>
              )}
            </div>

            {/* Amount & Date */}
            <div className='flex items-center justify-between mt-2'>
              <div className='flex flex-col gap-1'>
                {isEditing ? (
                  <>
                    <input
                      type='number'
                      className='input input-bordered input-sm w-32'
                      value={editData.amount}
                      onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
                    />
                    <input
                      type='date'
                      className='input input-bordered input-sm w-36'
                      value={editData.date}
                      onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                    />
                  </>
                ) : (
                  <>
                    <p className='text-lg font-bold text-primary'>
                      {item.amount?.toLocaleString()} EGP
                    </p>
                    <p className='text-xs text-base-content/50'>
                      {new Date(item.date).toLocaleDateString()}
                    </p>
                  </>
                )}
              </div>

              {role === 'admin' && (
                <div className='flex gap-2'>
                  {isEditing ? (
                    <>
                      <button className='btn btn-sm btn-success' onClick={() => handleSave(item._id)}>
                        <CheckIcon className='size-4' />
                      </button>
                      <button className='btn btn-sm btn-ghost' onClick={handleCancel}>
                        <XIcon className='size-4' />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleToggle(item)}
                        disabled={isLoading}
                        className={`btn btn-sm ${isPurchased ? 'btn-error' : 'btn-success'}`}
                      >
                        <ShoppingCartIcon className='size-4' />
                        {isLoading ? '...' : isPurchased ? 'Unpurchase' : 'Purchase'}
                      </button>
                      {!isPurchased && (
                        <button className='btn btn-sm btn-ghost' onClick={() => handleEditClick(item)}>
                          <PencilIcon className='size-4' />
                        </button>
                      )}
                      {!isPurchased && (
                        <button className='btn btn-sm btn-ghost text-error' onClick={() => onDelete(item._id)}>
                          <Trash2Icon className='size-4' />
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default PaymentCard