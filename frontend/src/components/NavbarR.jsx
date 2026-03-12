import React, { useState } from 'react'
import { useEffect } from 'react'
import { PlusIcon, SearchIcon, XIcon, WalletIcon, RefreshCwIcon } from 'lucide-react'
import axios from 'axios'
import toast from "react-hot-toast";

const NavbarR = ({ onAddClick, searchQuery, onSearch,walletRefresh  }) => {
  const [addLoading, setAddLoading] = useState(false)
const [addAmount, setAddAmount] = useState("") 
  const [walletBalance, setWalletBalance] = useState(null)
  const [walletLoading, setWalletLoading] = useState(false)
  const [walletError, setWalletError] = useState(null)
  const [role, setRole] = useState(null);
  const [resetLoading, setResetLoading] = useState(false)
const handleAddBalance = async () => {
  if (!addAmount || addAmount <= 0) return alert("Enter a valid amount")
  
  setAddLoading(true)
  try {
    const token = sessionStorage.getItem("token")
    await axios.post("http://localhost:5000/api/receipt/wallet", 
      { amount: Number(addAmount) },  
      { headers: { Authorization: `Bearer ${token}` } }
    )
    setWalletBalance(prev => prev + Number(addAmount))  
    setAddAmount("")  // clear the input
  } catch (err) {
    alert("Failed to add balance")
  } finally {
    setAddLoading(false)
  }
}
const handleResetWallet = async () => {
  if (!window.confirm("Reset wallet to $0.00?")) return  // safety confirmation
  setResetLoading(true)
  try {
    const token = sessionStorage.getItem("token")
    await axios.post("http://localhost:5000/api/receipt/wallet/reset", {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    setWalletBalance(0)  // update the display instantly
  } catch (err) {
    alert("Failed to reset wallet")
  } finally {
    setResetLoading(false)
  }
}
useEffect(() => {
    handleWallet();
}, [walletRefresh]);

  const handleWallet = async () => {
    setWalletLoading(true)
    setWalletError(null)
    try {
    const currentRole = sessionStorage.getItem('role');
    setRole(currentRole);
      const token = sessionStorage.getItem("token")
      const { data } = await axios.get("http://localhost:5000/api/receipt/wallet", {
        headers: { Authorization: `Bearer ${token}` }
      })
    setWalletBalance(data.totalBalance ?? 0) 
     } catch (err) {
      setWalletError(`Failed to load${err}`)
    } finally {
      setWalletLoading(false)
    }
  }
  useEffect(() => {
    handleWallet();
  }, []);
  return (
    <header className='bg-base-300 border-b border-base-content/10'>
      <div className='mx-auto max-w-6xl p-4'>
        <div className='flex items-center justify-between'>

          <h1 className='text-3xl font-extrabold text-primary font-mono tracking-tight'>
            Payment Orders
          </h1>

          {/* Search */}
          <div className='flex items-center gap-2 bg-base-100 border border-base-300 rounded-xl px-4 py-2 w-96'>
            <SearchIcon className='size-4 text-primary' />
            <input
              type='text'
              placeholder='Search receipts...'
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className='bg-transparent outline-none w-full text-sm'
            />
            {searchQuery && (
              <button onClick={() => onSearch('')}>
                <XIcon className='size-4 text-base-content/40 hover:text-base-content' />
              </button>
            )}
          </div>

          <div className='flex items-center gap-4'>
            {role === "admin"&&(
              
           
            <div className='flex items-center gap-2 bg-base-100 border border-base-300 rounded-xl px-4 py-2'>
              <button
                    onClick={handleResetWallet}
                    disabled={resetLoading}
                    className='btn btn-xs btn-error ml-2'
                  >
                    {resetLoading ? "Resetting..." : "Reset"}
                  </button>
              <WalletIcon className='size-4 text-primary' />
              
              {walletBalance !== null ? (
                <span className='text-sm font-semibold text-base-content'>
                  ${typeof walletBalance === 'number' ? walletBalance.toFixed(2) : walletBalance}
                </span>
              ) : walletError ? (
                <span className='text-sm text-error'>{walletError}</span>
              ) : (
                <span className='text-sm text-base-content/40'>--</span>
              )}
                <input
                  type="string"
                  placeholder="Amount"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  className="input input-xs w-10 border border-base-300"
                />
                <button
                  onClick={handleAddBalance}
                  disabled={addLoading}
                  className="btn btn-xs btn-success"
                >
                  {addLoading ? "Adding..." : "+ Add"}
                </button>
            </div>
            )}
            {role!=="superUser"&&
            <button onClick={onAddClick} className='btn btn-primary'>
              <PlusIcon className='size-5' />
              <span className='ml-2'>Add Payment Order</span>
            </button>
}
          </div>
        </div>
      </div>
    </header>
  )
}

export default NavbarR