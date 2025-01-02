import React from 'react'
import { Title } from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { useCartContext } from '../context/CartContext';

function PlaceOrder() {
  const [paymentMethod, setPaymentMethod] = React.useState("COD");
  const {navigate}  = useCartContext();

  return (
    <div className='flex flex-col md:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] p-10' >
      {/* Left Side */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={"ORDER"} text2={"  INFORMATION"} />
        </div>

        <div className='p-5 border border-gray-300 rounded-lg flex gap-3 flex-col'>
          <Title text1={"CONTACT"} text2={"  INFORMATION"} />
          <div className='flex gap-3'>
            <input className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder='First Name' />
            <input className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder='Last Name' />
          </div>

          <div className='flex gap-3'>
            <input className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="email" placeholder='Email Address' />
            <input className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="number" placeholder='Phone Number' />

          </div>
        </div>


        <div className='p-5 border border-gray-300 rounded-lg flex gap-3 flex-col'>
            <Title text1={"DELIVERY"} text2={"  INFORMATION"} />
          <input className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder='Street' />

          <div className='flex gap-3'>
            <input className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder='City' />
            <input className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder='State' />
          </div>

          <div className='flex gap-3'>
            <input className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="number" placeholder='Zip Code' />
            <input className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder='Country' />
          </div>
        </div>


      </div>


      {/* Right Side */}  
      <div className='mt-8'>
      <div className='mt-8 min-w-80'>
        <CartTotal/>
      </div>

      <div className='mt-12'>
        <Title text1={"PAYMENT"} text2={"METHOD"}/>
        <div className='flex gap-3 flex-col lg:flex-row'>
          <div className='flex flex-col sm:flex-row gap-3'>
            <div onClick={()=>setPaymentMethod('stripe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full  ${paymentMethod ==='stripe'?'bg-orange-300' :''}`}></p>
              <img className="h-5 mx-4" src={assets.stripe_logo} alt="" />
            </div>

            <div onClick={()=>setPaymentMethod('razorpay')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${paymentMethod ==='razorpay'?'bg-orange-300' :''}`}></p>
              <img className="h-5 mx-4" src={assets.razorpay_logo} alt="" />
            </div>

            <div onClick={()=>setPaymentMethod('COD')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${paymentMethod ==='COD'?'bg-orange-300' :''}`}></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
            </div>

          </div>

         
        </div>
        <div className='w-full text-end mt-8'>
            <button onClick={()=>navigate('/orders')}className='bg-orange-300 text-black px-16 py-3 text-sm rounded-md'>PLACE ORDER</button>
          </div>
      </div>
      </div>

    </div>
  )
}

export default PlaceOrder
