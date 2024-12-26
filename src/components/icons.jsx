import { React, useState } from 'react'

export function IconButton({ iconPath }) {
  return (
    <div className="bg-white p-3 rounded-full transition-transform duration-300 transform hover:scale-125">
      <img
        src={iconPath}
        alt=""
        className="h-5 w-5 "
      />
    </div>
  )
}







