import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CreateFile from './pages/CreateFile'
import { LoginPage } from './pages/LoginPage'
import HomeReceipt from './pages/HomeReceipt'
import ProtectedRoute from './components/ProtectedRoute'
import { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <div data-theme="forest" className="min-h-screen">
      <Toaster position="top-right"
        toastOptions={{
          style: {
            background: '#1b2818', 
            color: '#fff',
            border: '1px solid #324d2c',
          },
          success: {
            iconTheme: {
              primary: '#21ad06', 
              secondary: '#fff',
            },
          },}}
     />

      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/receipts' element={<ProtectedRoute><HomeReceipt /></ProtectedRoute>} />
        <Route path='/home' element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path='/create-file' element={<ProtectedRoute><CreateFile /></ProtectedRoute>} />
      </Routes>
    </div>
  )
}

export default App