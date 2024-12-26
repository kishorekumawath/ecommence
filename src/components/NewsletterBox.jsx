import React from 'react'

function NewsletterBox() {

    const onSubmitHandler = (event)=>{
        event.preventDefault();
    }
  return (
    <div className=' text-center mt-8 px-32'>
      <p className='text-2xl font-medium text-gray-800 mb-2'> Subscrible Now & get <span className='text-orange-300'>20% off</span></p>
      <p className='text-gray-500'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ullam accusamus veritatis quae, aliquid, distinctio vel, vero doloribus tempore ea asperiores numquam explicabo quia ducimus quo natus nesciunt eos ut veniam.</p>
      <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3'>
        <input className='w-full sm:flex-1 outline-none' type="email" placeholder='Enter Your Email' />
        <button type='submit' className='bg-orange-300 text-black text-xs px-10 py-4 font-semibold'> Subscrible</button>
      </form>
    </div>
  )
}

export default NewsletterBox
