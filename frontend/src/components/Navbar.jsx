import React from 'react'
import { Plus } from 'lucide-react';

const Navbar = () => {
  return (
    <header className='bg-base-300 border-b border-base-content/10'>
        <div className='mx-auto max-w-6xl p-4'>
        <div className='flex items-center justify-between'>
        <h1 className='  font-bold text-base'>File System Manager</h1>
         <Plus className='text-3xl font-semibold  shadow-sm'/>
        </div>



        </div>
        
        
        
        
    </header>
  )
}

export default Navbar