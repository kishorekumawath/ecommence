import React, { useEffect, useState } from 'react';
import { useCartContext } from '../context/CartContext';
import { Title } from '../components/Title';
import { useCollections } from '../context/CollectionsContext';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';

function Cart() {
  const { cartItems ,updateQuantity,navigate,cartItemsData,setCartItemsData} = useCartContext();
  const {fetchSpecificProduct} = useCollections();
  // const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCartData = async () => {
      setLoading(true);
      setError(null);
      const tempData = [];
      
      try {
        // Process items sequentially to maintain order
        for (const items in cartItems) {
          for (const item in cartItems[items]) {
            if(cartItems[items][item] > 0) {
            try {
              const productData = await fetchSpecificProduct(items);
              if (productData) {
                tempData.push({
                  itemId: items,
                  size: item,
                  quantity: cartItems[items][item],
                  product: productData
                });
              }
            } catch (productError) {
              console.error(`Error fetching product ${items}:`, productError);
              // Continue with other products even if one fails
            }
          }
          }
        }
        setCartItemsData(tempData);
      
      } catch (error) {
        console.error('Error loading cart data:', error);
        setError('Failed to load cart items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadCartData();
    console.log(cartItems);
  }, [cartItems]);

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  return (
    <div className='border-t pt-14 px-10'>
      <div>
        <Title text1={"YOUR"} text2={"CART"} />
      </div>
      <div className='px-2 mt-5'>
        {cartItemsData.length > 0 ? (
          cartItemsData.map((item, index) => (
            <div key={index} className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'>
              <div className='flex items-start gap-6'>
                <img src={item.product.image} alt="" className='w-16 sm:w-20' />
                <div>
                  <p className='text-lg font-medium'>{item.product.name}</p>
                  <div className='flex items-center gap-5 mt-2'>
                  <p className='px-2 sm:px-3 sm:py-1 border bg-slate-50'>{item.size}</p>
                  <p className='text-xs text-gray-500'>Quantity: {item.quantity}</p>
                  </div>
                 
                </div>
              </div>
              <input onChange={(e)=>e.target.value ===''|| e.target.value === '0'?null:updateQuantity(item.itemId,item.size,Number(e.target.value))} type='number' min={1} defaultValue={item.quantity} className='border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1' />
              <img onClick={()=>updateQuantity(item.itemId,item.size,0)} className='w-4 mr-4 sm:w-5 cursor-pointer' src={assets.bin_icon} alt="" />
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            Your cart is empty
          </div>
        )}
      </div>

      <div className='flex justify-end my-20'>
        <div className='w-full sm:w-[450px]'>
          <CartTotal/>

          <div className='w-full text-end mt-5'>
          <button onClick={()=>navigate('/place-order')} className='bg-black text-white px-10 py-3 text-sm'>Checkout</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;