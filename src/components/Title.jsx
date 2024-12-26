import React from 'react'

export function Title({ text1, text2 }) {
  return (
    <div className='inline-flex gap-2 items-center mb-3'>
      <p className='text-gray-500'>{text1}<span className='text-gray-700 font-medium'>{text2}</span></p>
      <p className='w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700'></p>
    </div>
  )
}




export function ProductTitle({ name, price }) {
  return (

    <div className=' px-2 py-1 text-black  w-full rounded-b-lg bg-gray/30 pb-2'>
      <p className="text-base sm:text-lg lg:text-xl font-semibold mb-1 ">{name}</p>
      <p className="text-xs sm:text-sm lg:text-base text-black bg-orange-300 w-fit px-1.5 py-0.5 rounded-full font-medium ">
        ${price}
      </p>
    </div>
  )
}

