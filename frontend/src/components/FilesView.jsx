import React from 'react'

const FilesView = ({ folder }) => {
  return (
    <div>
          <div className='items-center p-4 rounded-xl border w-[600px] h-[500px] bg-base-100 border-base-300'>
          <h2 className='text-2xl font-bold text-primary'>Project {folder.name}</h2>
          <h3 className='text-lg font-medium text-secondary'>{folder.path}</h3>
          <div className='flex gap-4'>
            <h3 className='text-lg font-medium text-secondary'>{folder.name}</h3>
            <h3 className='text-lg font-medium text-secondary'>{folder.name}</h3>
            <h3 className='text-lg font-medium text-secondary'>{folder.name}</h3>
            <h3 className='text-lg font-medium text-secondary'>{folder.name}</h3>
          </div>
        </div>
    </div>
  )
}

export default FilesView