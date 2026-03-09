import React, { useEffect } from 'react'
import { useState } from 'react'
import NavbarR from '../components/NavbarR'
import { PlusIcon, SearchIcon, Trash2Icon, PencilIcon } from 'lucide-react'
import axios from 'axios'
const ReceiptsPage = () => {
  const role = sessionStorage.getItem('role') 
const [receipt, setReceipt] = useState([]);
const [showModal, setShowModal] = useState(false)
const [formData, setFormData] = useState({
  name: '',
  description: '',
  amount: '',
  category: '',
  date: ''
})
  useEffect(() => {
    // Define the async function inside useEffect
    const fetchNotes = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/receipt/");
        console.log(res.data);
        setReceipt(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchNotes();
  }, []);
const handleAddReceipt = async () => {
  try {

    await axios.post('http://localhost:5000/api/receipt/', formData)

    setShowModal(false) 
  
    const res = await axios.get('http://localhost:5000/api/receipt/')
    setReceipt(res.data)

  } catch (err) {
    console.log(err)
    alert('Failed to add receipt')
  }
}
  
  return (
    <div className='min-h-screen'>
       <NavbarR onAddClick={() => setShowModal(true)} />
   {showModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
          <div className='bg-base-100 border border-base-300 rounded-2xl p-6 w-full max-w-md'>

            <h2 className='text-2xl font-extrabold text-primary font-mono mb-4'>
              New Payment Order
            </h2>

            <div className='flex flex-col gap-3'>
        <input
          type='text'
          placeholder='Name'
          className='input input-bordered w-full'
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type='text'
          placeholder='Description'
          className='input input-bordered w-full'
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        <input
          type='number'
          placeholder='Amount'
          className='input input-bordered w-full'
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        />
        <input
          type='text'
          placeholder='Category'
          className='input input-bordered w-full'
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        />
        <input
          type='date'
          className='input input-bordered w-full'
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        />
            </div>

            <div className='flex gap-3 mt-5'>
              <button onClick={handleAddReceipt} className='btn btn-primary flex-1'>
              Add
              </button>
              <button onClick={() => setShowModal(false)} className='btn btn-ghost flex-1'>Cancel</button>
            </div>

          </div>
        </div>
      )}
      <div className='w-full px-6 mt-6'>

        {/* ===== CARDS GRID ===== */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {receipt.map((receipt) => (

            <div
             
              className='bg-base-100 border border-base-300 rounded-2xl p-5 flex flex-col gap-3 shadow-md'
            >

              {/* TOP ROW: receipt number + category */}
              <div className='flex items-center justify-between'>
                <span className='text-xs font-mono text-base-content/50'>
                  #{receipt.receiptNumber}
                </span>
                <div className='flex items-center gap-2'>


                {/* Approval status badge */}
                <span
                    className={`badge badge-outline text-xs ${
                    receipt.approvalStatus === "approved"
                        ? "badge-success"   // green
                        : receipt.approvalStatus === "rejected"
                        ? "badge-error"     // red
                        : "badge-ghost"     // white/gray for pending
                    }`}
                >
                    {receipt.approvalStatus}
                </span>
                </div>
              </div>

            {/* MIDDLE: name + description */}
            <div className="flex items-center justify-between gap-3">
            {/* Left: name + description stacked */}
            <div className="flex flex-col break-words overflow-hidden">
                <h3 className="text-sm font-extrabold text-primary font-mono tracking-tight">
                {receipt.name}
                </h3>
                <p className="text-sm text-base-content/60 break-words ">
                {receipt.description}
                </p>
            </div>

            </div>

              {/* BOTTOM ROW: amount + date + buttons */}
              <div className='flex items-center justify-between mt-2'>

                <div>
                  {/* Amount */}
                  <p className='text-1xl font-bold text-primary'>
                     {receipt.amount.toLocaleString()}  EGP
                  </p>
                  {/* Date */}
                  <p className='text-xs text-base-content/50 mt-1'>
                    {new Date(receipt.date).toLocaleDateString()}
                  </p>
                </div>

                {/* Admin only: Edit + Delete */}
                {role === 'admin' && (
                  <div className='flex gap-2'>
                    <button className='btn btn-sm btn-ghost'>
                      <PencilIcon className='size-4' />
                    </button>
                    <button className='btn btn-sm btn-ghost text-error'>
                      <Trash2Icon className='size-4' />
                    </button>
                  </div>
                )}

              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default ReceiptsPage
