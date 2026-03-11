import React, { useState } from 'react'
import { useEffect } from 'react'
import { PlusIcon, SearchIcon, XIcon, WalletIcon, RefreshCwIcon } from 'lucide-react'
import axios from 'axios'

const NavbarR = ({ onAddClick, searchQuery, onSearch,walletRefresh  }) => {
  const [walletBalance, setWalletBalance] = useState(null)
  const [walletLoading, setWalletLoading] = useState(false)
  const [walletError, setWalletError] = useState(null)
  const [role, setRole] = useState(null);

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
              <button
                onClick={handleWallet}
                disabled={walletLoading}
                className='ml-1 hover:text-primary transition-colors'
                title='Refresh wallet'
              >
                <RefreshCwIcon className={`size-3.5 text-base-content/50 ${walletLoading ? 'animate-spin' : ''}`} />
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