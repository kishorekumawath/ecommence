import React from 'react'

function MenuItem({name}) {
  return (
    <div className="flex flex-col items-center gap-1 ">
           <p>{name}</p>
           <hr className={`w-2/4 border-none h-[3px] bg-orange-300 hidden rounded`} />
    </div>
  )
}

export default MenuItem
