import { React, useState } from 'react'

export function IconButton({ iconPath ,onClick}) {
  return (
    <div onClick={onClick} className="bg-white p-2 md:p-3 rounded-full transition-transform duration-300 transform hover:scale-125">
      <img
        src={iconPath}
        alt=""
        className="h-3 w-3 md:h-5 md:w-5 "
      />
    </div>
  )
}







