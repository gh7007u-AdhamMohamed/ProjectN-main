import React, { useEffect } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'
import toast from 'react-hot-toast'
import FolderItem from '../components/FolderItem'
import FilesView from '../components/FilesView'

const HomePage = () => {
  const [selectedFolder, setSelectedFolder] = React.useState(null)

  const [folders,setfolders]=React.useState([])
  const [loading,setloading]=React.useState(false)
  useEffect(() => {
  const fetchFolders = async ()=>{
    try{
      setloading(true)
      const res=await axios.get("http://localhost:5000/api/file/folders")
      console.log(res.data)
      setfolders(res.data)
    }catch(err){
      console.log(err)
      toast.error("Failed to fetch folders")}
      finally{
        setloading(false)
      }
  }
  fetchFolders()
  }, [])
 return (
    <div className='min-h-screen'>
       <Navbar />
        <div className='mx-auto max-w-6xl p-4 mt-6'>
          {loading && <div className='text-center text-primary py-10'>Loading folders...</div>}

        <div className='flex gap-6 '>
        <div className='items-center p-4 rounded-xl border w-80 bg-base-100 border-base-300 '>
   
        <div className='flex flex-col gap-3 w-48 '>
        <h2 className='text-3xl  font-extrabold text-primary font-mono tracking-tight'>Main Folders</h2>
      {folders.map((folder) => (
        <FolderItem
          key={folder._id}
          folder={folder}
          isSelected={selectedFolder?._id === folder._id}
          onClick={() => setSelectedFolder(folder)}
        />
        ))}
       


        </div>

        </div>
         {selectedFolder && (
         <FilesView folder={selectedFolder} />
        )}

        </div>
                


      </div>
    </div>
  )
}

export default HomePage