import React, { useEffect } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'
import toast from 'react-hot-toast'
import Sidebar from '../components/Sidebar'

const HomePage = () => {
  const [files,setfiles]=React.useState([])
  const [loading,setloading]=React.useState(false)
  useEffect(() => {
  const fetchFiles = async ()=>{
    try{
      const res=await axios.get("http://localhost:5000/api/file")
      console.log(res.data)
      setfiles(res.data)
    }catch(err){
      console.log(err)
      toast.error("Failed to fetch files")}
      finally{
        setloading(false)
      }
  }
  fetchFiles()
  }, [])
  return (
    <div className='min-h-screen'>
      <Navbar />
      
      <div className='mx-auto max-w-6xl p-4 mt-6'>
        {loading&&<div className='text-center text-primary py-10'>Loading files...</div>}
      

       {files.length>}
      </div>
      </div>
  )
}

export default HomePage