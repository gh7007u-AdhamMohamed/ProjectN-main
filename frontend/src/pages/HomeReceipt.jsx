import React, { useEffect, useState } from 'react'
import NavbarR from '../components/NavbarR'
import { PlusIcon, ClipboardList } from 'lucide-react'
import axios from 'axios'
import PaymentCard from '../components/PaymentCard'
import { useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import { io } from 'socket.io-client'

import { UserPlusIcon, InfoIcon } from 'lucide-react'

// ↓ paste here, above ReceiptsPage
const FlexButtons = () => {
  const navigate = useNavigate()
  const role = sessionStorage.getItem('role')
  return (
   <div className="fixed bottom-10 left-10 z-50 flex flex-col gap-3">
  <button
    onClick={() => navigate('/about')}
    className="btn btn-circle size-14 shadow-lg bg-base-300 hover:bg-base-200 border border-base-300 tooltip tooltip-right flex items-center justify-center"
    data-tip="About"
  >
    <InfoIcon size={22} />
  </button>
  {role === 'admin' && (
    <button
      onClick={() => navigate('/register')}
      className="btn btn-circle size-14 shadow-lg btn-primary tooltip tooltip-right flex items-center justify-center"
      data-tip="Register User"
    >
      <UserPlusIcon size={22} />
    </button>
  )}
</div>
  )
}


const ReceiptsPage = () => {
  const [receipt, setReceipt] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [walletRefresh, setWalletRefresh] = useState(0)
  const role = sessionStorage.getItem('role')
  const navigate = useNavigate()

  // ── New-receipt form state ──────────────────────────────────────
  const [formHeader, setFormHeader] = useState({ name: '', date: '' })
  const [formItems, setFormItems] = useState([])           // confirmed rows
  const [newRow, setNewRow] = useState({ count: '', description: '', price: '' })

  // ── Derived ─────────────────────────────────────────────────────
  const formTotal = formItems.reduce((s, i) => s + Number(i.count) * Number(i.price), 0)

  const filteredReceipts = receipt.filter((item) =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.receiptNumber?.toString().includes(searchQuery) ||
    (item.items || []).some(i => i.description?.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // ── Fetch ────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/receipt/')
        setReceipt(res.data)
      } catch (err) {
        console.log(err)
      }
    }
    fetchReceipts()
  }, [])

  // ── Socket ───────────────────────────────────────────────────────
  useEffect(() => {
    const socket = io('http://localhost:5000')
    socket.on('newReceipt', (r) => {
      setReceipt(prev => [r, ...prev])
      document.title = '🔔 تم اصدار امر صرف!'
    })
    socket.on('approvalUpdated', (updated) => {
      setReceipt(prev => prev.map(r => r._id === updated._id ? updated : r))
      document.title = '🔔 الموافقه علي امر صرف!'
    })
    window.addEventListener('focus', () => { document.title = 'Your App Name' })
    return () => socket.disconnect()
  }, [])

  // ── Handlers ─────────────────────────────────────────────────────
  const handleUpdate = async () => {
    setWalletRefresh(c => c + 1)
    const res = await axios.get('http://localhost:5000/api/receipt/')
    setReceipt(res.data)
  }

  const handleDelete = async (id) => {
    try {
      const token = sessionStorage.getItem('token')
      await axios.delete(`http://localhost:5000/api/receipt/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setReceipt(prev => prev.filter(r => r._id !== id))
    } catch (err) {
      console.log(err)
      alert('Failed to delete receipt')
    }
  }

  const handleAddRow = () => {
    if (!newRow.count || !newRow.description || !newRow.price) return
    setFormItems(prev => [...prev, {
      count: Number(newRow.count),
      description: newRow.description,
      price: Number(newRow.price),
    }])
    setNewRow({ count: '', description: '', price: '' })
  }

  const handleRemoveRow = (index) => {
    setFormItems(prev => prev.filter((_, i) => i !== index))
  }

  const handleAddReceipt = async () => {
    if (!formItems.length) { toast.error('أضف عناصر أولاً'); return }
    if (!formHeader.name)  { toast.error('أدخل اسم الطلب');  return }
    if (!formHeader.date)  { toast.error('اختر التاريخ');     return }
    try {
      await axios.post('http://localhost:5000/api/receipt/', {
        name: formHeader.name,
        date: formHeader.date,
        items: formItems,
      })
      setShowModal(false)
      setFormHeader({ name: '', date: '' })
      setFormItems([])
      const res = await axios.get('http://localhost:5000/api/receipt/')
      setReceipt(res.data)
    } catch (err) {
      console.log(err)
      alert('Failed to add receipt')
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setFormHeader({ name: '', date: '' })
    setFormItems([])
    setNewRow({ count: '', description: '', price: '' })
  }

  return (
    
    <div className="min-h-screen">
      <Toaster position="top-center" />
      <NavbarR
        onAddClick={() => setShowModal(true)}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        walletRefresh={walletRefresh}
      />

      {/* ── Modal ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-base-100 border border-base-300 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-extrabold text-primary font-mono mb-4">
              أمر صرف جديد
            </h2>

            <div className="flex flex-col gap-3">
              {/* Name */}
              <input
                type="text"
                placeholder="Name"
                className="input input-bordered w-full"
                value={formHeader.name}
                onChange={(e) => setFormHeader({ ...formHeader, name: e.target.value })}
              />

              {/* Item input row */}
              <div className="flex gap-2" dir="rtl">
                <input
                  type="number"
                  placeholder="العدد"
                  className="input input-bordered w-1/4"
                  value={newRow.count}
                  onChange={(e) => setNewRow({ ...newRow, count: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="الصنف"
                  className="input input-bordered w-full"
                  value={newRow.description}
                  onChange={(e) => setNewRow({ ...newRow, description: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="السعر"
                  className="input input-bordered w-1/4"
                  value={newRow.price}
                  onChange={(e) => setNewRow({ ...newRow, price: e.target.value })}
                />
                <button className="btn btn-primary btn-square" onClick={handleAddRow}>
                  <PlusIcon className="size-4" />
                </button>
              </div>

              {/* Confirmed items preview */}
              {formItems.length > 0 && (
                <div className="flex flex-col gap-1 mt-1" dir="rtl">
                  <div className="grid grid-cols-[2fr_1fr_1.5fr_auto] gap-2 text-xs font-bold text-base-content/60 px-2">
                    <span>الصنف</span><span className="text-center">العدد</span>
                    <span className="text-end">السعر</span><span />
                  </div>
                  {formItems.map((fi, idx) => (
                    <div key={idx} className="grid grid-cols-[2fr_1fr_1.5fr_auto] gap-2 items-center bg-base-200/40 border border-base-200/60 rounded-lg px-2 py-1 text-sm">
                      <span className="font-semibold truncate">{fi.description}</span>
                      <span className="text-center text-base-content/70">{fi.count}</span>
                      <span className="text-end font-bold text-primary">{Number(fi.price).toLocaleString()} EGP</span>
                      <button
                        className="btn btn-xs btn-circle btn-ghost hover:bg-error/10 hover:text-error"
                        onClick={() => handleRemoveRow(idx)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <div className="text-end text-sm font-bold text-primary px-2 mt-1">
                    الإجمالي: {formTotal.toLocaleString()} EGP
                  </div>
                </div>
              )}

              {/* Date */}
              <input
                type="date"
                className="input input-bordered w-full"
                value={formHeader.date}
                onChange={(e) => setFormHeader({ ...formHeader, date: e.target.value })}
              />
            </div>

            <div className="flex gap-3 mt-5">
              <button onClick={handleAddReceipt} className="btn btn-primary flex-1">Add</button>
              <button onClick={closeModal} className="btn btn-ghost flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full px-6 mt-6">
        <PaymentCard receipt={filteredReceipts} onDelete={handleDelete} onUpdate={handleUpdate} />
        <FlexButtons />
        <button
          onClick={() => navigate('/report')}
          className="fixed bottom-10 right-10 z-50 btn btn-secondary btn-circle size-16 shadow-lg"
        >
          <ClipboardList size={28} />
        </button>
      </div>
    </div>
  )
}

export default ReceiptsPage