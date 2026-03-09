import React from 'react'
import { Link } from "react-router-dom";
import { useState } from 'react'
import { PlusIcon, SearchIcon } from 'lucide-react';

const Navbar = ({onAddClick} ) => {
    const [search, setSearch] = useState('')
  
  return (
    <header className='bg-base-300 border-b border-base-content/10'>
      
        <div className='mx-auto max-w-6xl p-4'>
        <div className='flex items-center justify-between'>
        <h1 className='text-3xl  font-extrabold text-primary font-mono tracking-tight '>Payment Orders</h1>
         {/* Search */}
         
                  <div className='flex items-center gap-2 bg-base-100 border border-base-300 rounded-xl px-4 py-2 w-96'>
                    <SearchIcon className='size-4 text-primary' />
                    <input
                      type='text'
                      placeholder='Search receipts...'
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className='bg-transparent outline-none w-full text-sm'
                    />
                  </div>
        <div className='flex items-center gap-4'>
          <button onClick={onAddClick} className="btn btn-primary">
          <PlusIcon className='size-5' />
          <span className="ml-2">Add Payment Order</span>
        </button>
        </div>
         
        </div>



        </div>
        
        
        
        
    </header>
  )
}

export default Navbar