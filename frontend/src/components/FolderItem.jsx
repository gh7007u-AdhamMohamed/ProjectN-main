import React from "react";
import { Folder } from "lucide-react";

const FolderItem = ({ folder, onClick, isSelected }) => {
  return (
    <div
      onClick={onClick}
      className={` ml-4 flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all duration-200 border pl-10 w-64
        ${isSelected 
          ? 'bg-primary text-primary-content border-primary' 
          : 'bg-base-100 border-base-300 hover:bg-base-200 hover:border-primary/40'
        }`}
    >
      {/* Folder Icon */}
      <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary-content/20' : 'bg-primary/10'}`}>
        <Folder size={40} className={isSelected ? 'text-primary-content' : 'text-primary'} />
      </div>

      {/* Folder Name */}
      <span className="font-medium  truncate text-3xl capitalize">{folder.name}</span>
    </div>
  );
};

export default FolderItem;