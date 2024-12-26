import React, { useState,useEffect } from 'react'
import { assets } from '../../assets/assets'
import { Link, NavLink } from 'react-router-dom'
import SlidBarMenu from './SlidBarMenu'
import Topbar from './Topbar'

function Navbar() {
  const [menuVisible, setMenuVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true);
  const [CollectionsData,setCollectionsData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:9000/api/v1/subcategories",{method:'get',
          headers:{
            'Content-Type':'application/json',
            'Accept':'application/json'
          }
        });

        // console.log ("Data : ",response.data);
         const result = await response.json(); // Assuming the API returns JSON data.
        
        setCollectionsData(result.data); // Adjust `data` based on the API's response structure.
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    fetchData();
  }, []); 

  return (
    <div className=' flex items-center justify-between py-5 font-medium px-10 '>

      {/* LOGO Icon */}
      <Link to={'/'}><img src={assets.logo} className='w-36' /></Link>


      {/* Top Menu Items */}
      <Topbar CollectionsData={CollectionsData} isLoading={isLoading}/>

      {/* Right side */}
      <div className='flex items-center gap-6'>

        {/* Search Icon */}
        <img src={assets.search_icon} alt="" className='w-5 cursor-pointer' />

        {/* Profile Icon */}
        <img src={assets.profile_icon} alt="" className='w-5 cursor-pointer' />

        {/* Cart Icon */}
        <Link to='/cart' className='relative'>
          <img src={assets.cart_icon} alt="" className='w-5 min-w-5' />
          <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px] '>10</p>
        </Link>

        {/* SlideBarMenu */}
        <img onClick={() => setMenuVisible(true)} src={assets.menu_icon} className='w-5 cursor-pointer sm:hidden' alt="" />
        <SlidBarMenu menuVisible={menuVisible} setMenuVisible={setMenuVisible} CollectionsData={CollectionsData} isLoading={isLoading}/>
      </div>
    </div>

  )
}

export default Navbar
