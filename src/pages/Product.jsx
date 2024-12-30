
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { assets, products } from '../assets/assets';
import { useCollections } from '../context/CollectionsContext';
import { useCartContext } from '../context/CartContext';

function Product() {

  const { productId } = useParams();
  const [product, setProduct] = useState({});
  const {fetchSpecificProduct} = useCollections();

  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [productColor,setProductColor] = useState('bg-red-500');

  const {addToCart} = useCartContext();

  const fetchProductData = async () => {
   fetchSpecificProduct(productId).then((data) => {
    setProduct(data);
    setImage(data.image);
   })
  }

 useEffect(() => {
  fetchProductData();
 },[])

  return (
    <div className='border-t-2  pt-10 px-10 transition-opacity ease-in duration-500 opacity-100 '>
      <div className='flex-1 flex flex-col gap-3 sm:flex-row '>
        {/* ---------------- product images ----------------- */}
        <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal w-[10vw] '>
          {
            product?.addImages?.map((img, index) => (
              <img onClick={() => setImage(img)} src={img} key={index} className='w-[50%] sm:w-[100%] sm:mb-3 flex-shrink-0 cursor-pointer' />
            ))
          }
        </div>

        <div className='w-full sm:w-[40%]'>
          <img className='w-full h-auto' src={image} alt="" />
        </div>

        {/* ---------------- product information ------------------ */}
        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{product.name}</h1>
          <div className='flex items-center gap-1 mt-2'>
            <img src={assets.star_icon} alt="" className='w-3 ' />
            <img src={assets.star_icon} alt="" className='w-3 ' />
            <img src={assets.star_icon} alt="" className='w-3 ' />
            <img src={assets.star_icon} alt="" className='w-3 ' />
            <img src={assets.star_dull_icon} alt="" className='w-3 ' />
            <p className='pl-2'>{112}</p>
          </div>
          <p className='mt-5 text-3xl font-medium'>{`$ ${product.price}`}</p>
          <p className='mt-5 text-gray-500 md:w-4/5'>{product.description}</p>
          <div className='flex  gap-4 my-8'>
            {
              product?.size?.map((item, index) => (
                <button onClick={() => setSize(item)} key={index} className={`border bg-gray-100 py-2 px-4 rounded-md ${item === size ? 'border-orange-400 bg-orange-300 text-black' : ''}`}>{item}</button>
              ))
            }
          </div>
          <p className='mt-5 text-gray-500 md:w-4/5'>Select Color</p>
          <div className='flex  gap-4 my-4'>
            {
              Array(4).fill().map((e, index) => {
                const colors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500"]; // Define your colors
                return (
                  <button
                    onClick={() => { }}
                    key={index}
                    className={`border ${colors[index % colors.length]} py-4 px-4 rounded-md ${productColor===e}`}
                  ></button>
                );
              })
            }
          </div>

          <button onClick={()=>addToCart(product._id,size)} className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700'>ADD TO CART</button>
          <hr className='mt-8 sm:w-4/5' />
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
            <p>100% Orignal product</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div> 
      </div> 

      {/* ------------------ Description & review sections  --------------------*/}
      <div className='mt-20'>
        <div className='flex'>
          <b className='border px-5 py-3 text-sm'>Description</b>
          <p className='border px-5 py-3 text-sm'>Reviews</p>
        </div>
        <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
          <p>An e-commerce website is an online platformthat failitates the buying and selling products </p>
          <p>E-commerce websites typically display products or servies along with detailed information of products</p>
        </div>
      </div>


    </div>
  ) 
}

export default Product

