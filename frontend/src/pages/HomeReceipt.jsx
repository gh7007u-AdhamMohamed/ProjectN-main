import React, { useEffect } from 'react'
import { useState } from 'react'
import NavbarR from '../components/NavbarR'
import { PlusIcon, SearchIcon, Trash2Icon, PencilIcon, ClipboardList } from 'lucide-react'
import axios from 'axios'
import PaymentCard from '../components/PaymentCard'
import { useNavigate } from 'react-router-dom';

const ReceiptsPage = () => {

const [receipt, setReceipt] = useState([]);
const role = sessionStorage.getItem('role') 
const [showModal, setShowModal] = useState(false)
const [searchQuery, setSearchQuery] = useState('')
const [formData, setFormData] = useState({
  name: '',
  description: '',
  amount: '',
  category: '',
  date: ''
})
const navigate = useNavigate();
const filteredReceipts = receipt.filter((item) =>
  item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
  item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
  item.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
  item.receiptNumber?.toString().includes(searchQuery)
)
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
  const [walletRefresh, setWalletRefresh] = useState(0)
  
const handleUpdate = async () => {
  setWalletRefresh(walletRefresh + 1)
  const res = await axios.get("http://localhost:5000/api/receipt/")
  setReceipt(res.data)
}
  
const handleDelete = async (id)=>{
  try{
    const token = sessionStorage.getItem("token"); 
    await axios.delete(`http://localhost:5000/api/receipt/${id}`, {
      headers: {
        Authorization: `Bearer ${token}` 
      }
    });
    setReceipt(receipt.filter((r)=>r._id!==id))
  }catch (err) {
    console.log(err)
    alert("Failed to delete receipt")
  }
}
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
<NavbarR 
  onAddClick={() => setShowModal(true)} 
  searchQuery={searchQuery} 
  onSearch={setSearchQuery} 
  walletRefresh={walletRefresh}  // 👈 add this
/>  
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
          onChange={(e) => setFormData({ ...formData, description: e.target.value 
            
          })}
        />
        <input
          type='number'
         
          placeholder='Amount'
          className='input input-bordered w-full'
          value={formData.amount}
          onChange={(e) =>{
            const val=e.target.value
            if (val >= 0) {
              setFormData({ ...formData, amount: val });
         }}}
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

<PaymentCard receipt={filteredReceipts} onDelete={handleDelete} onUpdate={handleUpdate} />


  <button 
      onClick={() => navigate("/report")} 
      className="fixed bottom-10 right-10 z-50 btn btn-secondary btn-circle size-16 shadow-lg"
    >
      <ClipboardList size={28} />
    </button>      </div>
    </div>
  )
}

export default ReceiptsPage
