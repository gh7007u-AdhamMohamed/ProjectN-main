import React, { useEffect } from 'react'
import { useState } from 'react'
import NavbarR from '../components/NavbarR'
import { PlusIcon, SearchIcon, Trash2Icon, PencilIcon } from 'lucide-react'
import axios from 'axios'
const ReceiptsPage = () => {
  const role = sessionStorage.getItem('role') 
const [receipt, setReceipt] = useState([]);

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

  
  return (
    <div className='min-h-screen'>
      <NavbarR/>

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
                  {/* Category badge */}
                 <span className='badge badge-primary badge-outline text-xs'>
                    {receipt.category}
                </span>

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
              <div>
                <h3 className='text-sm font-extrabold text-primary font-mono tracking-tight'>
                  {receipt.name}
                </h3>
                <p className='text-sm text-base-content/60 mt-1 overflow-hidden break-words '>
                  {receipt.description}
                </p>
              </div>

              {/* BOTTOM ROW: amount + date + buttons */}
              <div className='flex items-center justify-between mt-2'>

                <div>
                  {/* Amount */}
                  <p className='text-1xl font-bold text-primary'>
                    ${receipt.amount.toLocaleString()}
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
