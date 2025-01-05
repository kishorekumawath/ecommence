import React from 'react'
import { Title } from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

function About() {
  return (
    <div className='px-10'>
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={"ABOUT"} text2={"  US"} />
      </div>

      <div className='my-10 flex flex-col justify-center items-center md:flex-row gap-16'>
        <img className='w-full md:max-w-[456px] rounded-lg' src={assets.about_img} alt="" />
        <div className='felx flex-col justify-center gap-6 md:w-2/4  text-gray-600'>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis impedit quasi sunt eligendi mollitia nesciunt quae commodi temporibus, accusamus voluptatum tenetur rerum ipsa id in assumenda vitae ab voluptas ipsam?</p>
          <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptates nam fuga consectetur inventore, porro beatae minus impedit! Dignissimos, ratione obcaecati? Accusamus, magni in consequuntur pariatur quo similique recusandae nulla iure!</p>
          <b className='text-gray-800 '> Our Mission</b>
          <p>Our mission at Forever is to empower customer with choice, Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quas perspiciatis fugiat facere corporis ut maiores itaque voluptatum, iure doloremque beatae officiis recusandae atque, pariatur similique vel reprehenderit totam, quia unde.</p>
        </div>
      </div>

      <div className='text-xl py-4'>
        <Title text1={"WHY"} text2={" CHOOSE US"} />
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className=' border px-5 md:px-8 py-5 sm:py-10 flex flex-col gap-5'>
          <b className='text-lg'>Quality Assurance:</b>
          <p className='text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit repellat assumenda sed dolorum provident delectus laudantium vero eos nostrum eveniet corrupti necessitatibus, odio facilis mollitia in perferendis quos! Doloremque, deleniti.</p>
        </div>
        <div className=' border px-5 md:px-8 py-5 sm:py-10 flex flex-col gap-5'>
          <b className='text-lg'>Convenience:</b>
          <p className='text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit repellat assumenda sed dolorum provident delectus laudantium vero eos nostrum eveniet corrupti necessitatibus, odio facilis mollitia in perferendis quos! Doloremque, deleniti.</p>
        </div>
        <div className=' border px-5 md:px-8 py-5 sm:py-10 flex flex-col gap-5'>
          <b className='text-lg'>Exceptional Customer Service:</b>
          <p className='text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit repellat assumenda sed dolorum provident delectus laudantium vero eos nostrum eveniet corrupti necessitatibus, odio facilis mollitia in perferendis quos! Doloremque, deleniti.</p>
        </div>
      </div>

<NewsletterBox/>
    </div>
  )
}

export default About
