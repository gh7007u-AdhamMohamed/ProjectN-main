import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CreateFile from './pages/CreateFile'
//import { toast } from 'react-hot-toast'
const App = () => {
  return (
    //  themes: ["light", "dark", "forest", "cupcake", "bumblebee", "emerald", "corporate", "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula"],

    <div data-theme="forest" >
  <Routes>
    <Route path='/' element={<HomePage />} />
    <Route path='/create-file' element={<CreateFile />} />

  </Routes>

    </div>
  )
}

export default App