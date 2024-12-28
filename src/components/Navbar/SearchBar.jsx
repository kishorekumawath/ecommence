import React, { useEffect, useState } from 'react'
import { useCollections } from '../../context/CollectionsContext';
import { assets } from '../../assets/assets';
import { useLocation } from 'react-router-dom';

function SearchBar() {
  const { search, setSearch, showSearch, setShowSearch } = useCollections();
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes('/collection')) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [location])

  return showSearch && visible? (
    <div className='border-t border-b bg-gray-50 text-center p-5'>
      <div className='inline-flex w-7/12 items-center justify-center border border-gray-400 p-4 rounded-full'>
        <input value={search} onChange={(e) => setSearch(e.target.value)} className='flex-1 outline-none bg-inherit text-sm ' type="text" placeholder=' Search' />
        <img className='w-4' src={assets.search_icon} alt='' />
      </div>
      <img onClick={() => setShowSearch(false)} className='inline w-3 cursor-pointer ml-5' src={assets.cross_icon} alt="" />
    </div>
  ) : null
}

export default SearchBar
