import React, { useEffect } from 'react'
import { Title } from '../components/Title'
import { ProductItem, ProductItemDesign2 } from '../components/ProductItem'
import { assets } from '../assets/assets'
import { useWishlist } from '../context/WhislistContext'
import { use } from 'react'
import { useAuth } from '../context/AuthContext'

function Wishlist() {
  const {wishlistItems,fetchWishlist}=useWishlist();
  const {user }=useAuth();



  useEffect(()=>{

    console.log("User",user);
    fetchWishlist(user);
  },[])
  console.log(wishlistItems)
  return (
    <div className='px-10'>
    <div className='flex justify-between text-3xl'>
      <Title text1={"WISH"} text2={"LIST"}/>
      <div className='w-8 h-8 bg-black rounded-full text-white text-sm felx items-center justify-center'><p>5</p></div>
    </div>

    <div className='grid grid-cols-4 gap-5 '>
        <ProductItemDesign2 id={"eee"} name={"Product 1"} image={assets.p_img1} price={100} like={true}/>
    </div>
    </div>

  )
}

export default Wishlist
