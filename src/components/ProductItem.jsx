
import { useContext } from 'react';
import { Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContex';
import { ProductTitle } from './Title';
import { IconButton } from './icons';
import { assets } from '../assets/assets';


export function ProductItem({ id, name, image, price }) {
  const { currency } = useContext(ShopContext);
  return (
    <Link className='text-gray-700 cursor-pointer' to={`/product/${id}`}>
      <div className='overflow-hidden'>
        <img className='hover:scale-110 transition ease-in-out' src={image[0]} alt="" />
        <p className='pt-3 pb-1 text-sm'>{name}</p>
        <p className='text-sm font-medium'>{currency}{price}</p>
      </div>
    </Link>
  )
}

export function ProductItemDesign2({ id, name, image, price, }) {
  return (
    <Link to={`/product/${id}`}>
      <div className='w-52 sm:w-64 lg:w-72  bg-gray-50 rounded-lg group relative flex-shrink-1 overflow-hidden'>
        <img src={image} alt="" className='rounded-lg group-hover:scale-110 transition ease-in-out' />
        <div className="flex justify-end absolute top-4 left-5 right-5  ">
          <IconButton iconPath={assets.cart_icon} />
        </div>
        <ProductTitle name={name} price={price} />
      </div>
    </Link>
  )
}




export function CollectionCategoryItem({title,img}) {
  return (
    <div
      className="relative h-40 group  bg-gray-300 rounded-lg flex-shrink-0 hover:ring-2 hover:ring-gray-300 transition-all cursor-pointer"
    >

      <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-lg">
        <img src={img} alt="" className='object-cover h-full w-full group-hover:scale-125 transition ease-in-out ' />
      </div>

      <div className='absolute inset-0 hover:bg-black/30 rounded-lg hover:backdrop-blur-sm transition-all ease-in-out'>

      </div>
      <p className="absolute  top-1/2 backdrop-blur-sm px-4 py-1 rounded-full bg-black/30  left-1/2 -translate-x-1/2 text-white text-sm lg:text-md  opacity-0 translate-y-2 group-hover:opacity-100 group-hover:-translate-y-1/2 transition-all ease-out duration-300 select-none ">
        {title}
      </p>

    </div>
  )
}

