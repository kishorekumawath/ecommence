import React from 'react'
import { Title } from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

function Contact() {
  return (
    <div className='px-10'>
      <div className='text-center text-2xl pt-10 border-t'>
        <Title text1={"CONTACT"} text2={" US"} />
      </div>
      <div className='my-10 flex flex-col justify-center items-center md:flex-row gap-10 mb-28'>
      <img className='w-[40vw] h-[40vw] rounded-lg' src={assets.contact_img} alt="" />
      <div className='flex flex-col justify-center items-start gap-6'>
        <p className='font-semibold text-xl text-gray-600'>Our Store</p>
        <p className='text-gray-500'>54833/3 address <br /> new colony, india </p>
        <p className='text-gray-500'>Tel: 1234567890 <br /> Email: servive@gmail.com</p>
        <p className='font-semibold text-xl text-gray-600'>Careers at Forever</p>
        <p  className='text-gray-500'>Learn more about our teams and job openings...</p>
        <button className='border border-black px-8 py-4 text-sm hover:bg-orange-300  transition-all duration-500'>Explore Jobs</button>
      </div>
      </div>

      <NewsletterBox/>
    </div>
  )
}

export default Contact
