import React from 'react'

const FilesView = ({ folder }) => {
  return (
    <div>
          <div className='items-center p-4 rounded-xl border w-[600px] bg-base-100 border-base-300'>
          <h2 className='text-xl font-bold text-primary'>Projects     {folder.path}</h2>
        </div>
    </div>
  )
}

export default FilesView