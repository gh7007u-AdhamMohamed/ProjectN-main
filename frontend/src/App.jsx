import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CreateFile from './pages/CreateFile'
//import { toast } from 'react-hot-toast'
const App = () => {
  return (
    <div data-theme="bumblebee" >
  <Routes>
    <Route path='/' element={<HomePage />} />
    <Route path='/create-file' element={<CreateFile />} />

  </Routes>

    </div>
  )
}

export default App