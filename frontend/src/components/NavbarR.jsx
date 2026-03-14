import React, { useState, useEffect } from 'react';
import { PlusIcon, SearchIcon, XIcon, WalletIcon, RefreshCwIcon } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'
import { UserPlusIcon, InfoIcon } from 'lucide-react'
const NavbarR = ({ onAddClick, searchQuery, onSearch, walletRefresh }) => {
  const [addLoading, setAddLoading] = useState(false);
  const [addAmount, setAddAmount] = useState('');
  const [walletBalance, setWalletBalance] = useState(null);
  const [walletLoading, setWalletLoading] = useState(false);
  const [walletError, setWalletError] = useState(null);
  const [role, setRole] = useState(null);
  const [resetLoading, setResetLoading] = useState(false);

  // Fetch wallet and role
  const handleWallet = async () => {
    setWalletLoading(true);
    setWalletError(null);
    try {
      const currentRole = sessionStorage.getItem('role');
      setRole(currentRole);
      
      const token = sessionStorage.getItem('token');
      const { data } = await axios.get('http://localhost:5000/api/receipt/wallet', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWalletBalance(data.totalBalance ?? 0);
    } catch (err) {
      setWalletError('Failed to load wallet');
    } finally {
      setWalletLoading(false);
    }
  };

  // Triggers on mount AND whenever walletRefresh changes
  useEffect(() => {
    handleWallet();
  }, [walletRefresh]);

  const handleAddBalance = async () => {
    const amount = Number(addAmount);
    if (!amount || amount <= 0) return toast.error('Enter a valid amount');

    setAddLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/receipt/wallet',
        { amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWalletBalance((prev) => prev + amount);
      setAddAmount(''); // clear the input
      toast.success('Balance added successfully!');
    } catch (err) {
      toast.error('Failed to add balance');
    } finally {
      setAddLoading(false);
    }
  };

  const handleResetWallet = async () => {
    if (!window.confirm('Are you sure you want to reset the wallet to 0.00?')) return;

    setResetLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/receipt/wallet/reset',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWalletBalance(0);
      toast.success('Wallet reset to 0.00');
    } catch (err) {
      toast.error('Failed to reset wallet');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <header className="bg-base-200 border-b border-base-300 sticky top-0 z-50 shadow-sm">
      <div className="mx-auto max-w-7xl p-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo / Title */}
          <h1 className="text-2xl md:text-3xl font-extrabold text-primary font-mono tracking-tight flex items-center gap-2">
            Payment Orders
          </h1>

          {/* Search Bar */}
          <div className="w-full md:max-w-md flex items-center gap-2 bg-base-100 border border-base-300 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-primary/50 transition-all">
            <SearchIcon className="size-4 text-base-content/50" />
            <input
              type="text"
              placeholder="Search receipts..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="bg-transparent outline-none w-full text-sm placeholder:text-base-content/40"
            />
            {searchQuery && (
              <button onClick={() => onSearch('')} className="hover:bg-base-200 p-1 rounded-full transition-colors">
                <XIcon className="size-4 text-base-content/50 hover:text-base-content" />
              </button>
            )}
          </div>

          {/* Actions Container */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 w-full md:w-auto">
            
            {/* Admin Wallet Controls */}
            {role === 'admin' && (
              <div className="flex items-center bg-base-100 border border-base-300 rounded-xl p-1 shadow-sm overflow-hidden">
                
                {/* Balance Display */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-base-200/50 rounded-lg">
                  <WalletIcon className="size-4 text-primary" />
                  {walletBalance !== null ? (
                    <span className="text-sm font-bold text-base-content">
                      {Number(walletBalance).toFixed(2)}
                    </span>
                  ) : walletError ? (
                    <span className="text-sm text-error">Error</span>
                  ) : (
                    <span className="text-sm text-base-content/40 loading loading-dots loading-xs"></span>
                  )}
                </div>

                {/* Add Funds */}
                <div className="flex items-center gap-1 px-2 border-l border-base-200 ml-1">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                    className="input input-sm w-20 px-2 border-base-300 focus:outline-none focus:border-primary"
                  />
                  <button
                    onClick={handleAddBalance}
                    disabled={addLoading || !addAmount}
                    className="btn btn-sm btn-success text-success-content"
                  >
                    {addLoading ? <span className="loading loading-spinner loading-xs"></span> : '+ Add'}
                  </button>
                </div>

                {/* Reset Wallet */}
                <div className="border-l border-base-200 pl-2 pr-1">
                  <button
                    onClick={handleResetWallet}
                    disabled={resetLoading}
                    className="btn btn-sm btn-ghost text-error hover:bg-error/10 px-2"
                    title="Reset Wallet"
                  >
                    <RefreshCwIcon className={`size-4 ${resetLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>

              </div>
            )}

            {/* Add Payment Order Button */}
            {role !== 'superUser' && (
              <button onClick={onAddClick} className="btn btn-primary btn-sm md:btn-md rounded-xl shadow-sm">
                <PlusIcon className="size-5" />
                <span className="hidden sm:inline ml-1">أضافه أمر صرف</span>
              </button>
            )}
            
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavbarR;