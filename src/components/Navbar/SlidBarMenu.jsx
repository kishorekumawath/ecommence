// import React, { useState } from 'react'
// import { Link, NavLink } from 'react-router-dom'
// import { assets } from '../../assets/assets'
// function SlidBarMenu({menuVisible, setMenuVisible,CollectionsData, IsLoading}) {

//     const [visibleCollections, setVisibleCollections] = useState(false)
//     const [expandedSubcategories, setExpandedSubcategories] = useState({});

//   const toggleSubcategories = (index) => {
//     setExpandedSubcategories((prev) => ({
//       ...prev,
//       [index]: !prev[index], // Toggle the specific subcategory
//     }));
//   };

//   return (
//     <div className={`fixed top-0 right-0 bottom-0 z-50 bg-white transition-all duration-500 ${menuVisible ? "w-80" : "w-0"}`}>

//     <div onClick={() => setMenuVisible(false)} className={`w-10 h-10 bg-orange-300 cursor-pointer gap-4 flex items-center justify-center group rounded-r-full my-2`}>
//       <img src={assets.cancel} alt="" className='h-3 group-hover:rotate-90 duration-300 ' />
//     </div>
//     <div className='bg-white text-center text-gray-400'>
//       <NavLink onClick={()=>setMenuVisible(false)} className='block hover:bg-gray-100 hover:text-black bg-gray-50 p-2 my-1 transition-colors duration-500' to='/'>HOME</NavLink>
//       <div onClick={() => setVisibleCollections(!visibleCollections)} className={`flex flex-row justify-between  px-5 hover:bg-gray-100 hover:text-black cursor-pointer ${visibleCollections?"bg-gray-100 text-black":"bg-gray-50"}  p-2 my-1 transition-colors duration-500 select-none`}>
//         <p>COLLECTIONS</p>
//         <p >{visibleCollections ? "-" : "+"}</p>
//       </div>
//       <div className={`transition-all duration-500 ${visibleCollections ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
//         {Array(4)
//           .fill()
//           .map((_, index) => (
//             <div key={index}>
//               <div
//                onClick={()=>toggleSubcategories(index)}
//                 className={`flex flex-row justify-between px-5 cursor-pointer hover:bg-gray-100 hover:text-black ${expandedSubcategories[index]?"bg-gray-100 text-black":"bg-gray-50"} p-2 transition-colors duration-500 select-none`}>
//                 <p>Category</p>
//                 <img
//                   src={assets.arrow_right}
//                   height="10px"
//                   width="20px"
//                   alt="arrow"
//                   className={`transition-transform duration-300 ${
//                     expandedSubcategories[index] ? 'rotate-90' : ''
//                   }`}
//                 />
//               </div>
//               <div
//               className={`transition-all duration-500 ${
//                 expandedSubcategories[index]
//                   ? 'max-h-screen opacity-100'
//                   : 'max-h-0 opacity-0'
//               } overflow-hidden`}
//               >
//                 {Array(2)
//                   .fill()
//                   .map((_, subindex) => (
//                     <div
//                       key={subindex}
//                       className="flex flex-row items-center px-2 m-2 mx-5 rounded-full hover:bg-gray-100 hover:text-black bg-gray-50 p-2 transition-colors duration-500 select-none"
//                     >
//                       <img src={assets.p_img1} alt="" className='h-8 w-8 rounded-full mr-4' />

//                       <p>Sub Category</p>

//                     </div>
//                   ))}
//               </div>
//             </div>

//           ))}
//       </div>
//       <NavLink onClick={()=>setMenuVisible(false)} className='block hover:bg-gray-100 hover:text-black bg-gray-50 p-2 my-1 transition-colors duration-500' to='/about'>ABOUT</NavLink>
//       <NavLink onClick={()=>setMenuVisible(false)} className='block hover:bg-gray-100 hover:text-black bg-gray-50 p-2 my-1  transition-colors duration-500' to='/contact'>CONTACT</NavLink>
//       <NavLink onClick={()=>setMenuVisible(false)} className='block hover:bg-gray-100 hover:text-black bg-gray-50 p-2 my-1 transition-colors duration-500' to='/'>My Profile</NavLink>
//     </div>
//   </div>
//   )
// }

// export default SlidBarMenu
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { assets } from "../../assets/assets";

function SlidBarMenu({
  menuVisible,
  setMenuVisible,
  CollectionsData,
  IsLoading,
}) {
  const [visibleCollections, setVisibleCollections] = useState(false);
  const [expandedSubcategories, setExpandedSubcategories] = useState({});

  const toggleSubcategories = (category) => {
    setExpandedSubcategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  return (
    <div
      className={`fixed top-0 right-0 bottom-0 z-50 bg-white transition-all duration-500 ${
        menuVisible ? "w-80" : "w-0"
      }`}
    >
      <div
        onClick={() => setMenuVisible(false)}
        className="w-10 h-10 bg-orange-300 cursor-pointer gap-4 flex items-center justify-center group rounded-r-full my-2"
      >
        <img
          src={assets.cancel}
          alt=""
          className="h-3 group-hover:rotate-90 duration-300"
        />
      </div>

      <div className="bg-white text-center text-gray-400">
        <NavLink
          onClick={() => setMenuVisible(false)}
          className="block hover:bg-gray-100 hover:text-black bg-gray-50 p-2 my-1 transition-colors duration-500"
          to="/"
        >
          HOME
        </NavLink>

        <div
          onClick={() => setVisibleCollections(!visibleCollections)}
          className={`flex flex-row justify-between px-5 hover:bg-gray-100 hover:text-black cursor-pointer ${
            visibleCollections ? "bg-gray-100 text-black" : "bg-gray-50"
          } p-2 my-1 transition-colors duration-500 select-none`}
        >
          <p>COLLECTIONS</p>
          <p>{visibleCollections ? "-" : "+"}</p>
        </div>

        <div
          className={`transition-all duration-500 ${
            visibleCollections
              ? "max-h-screen opacity-100"
              : "max-h-0 opacity-0"
          } overflow-hidden`}
        >
          {IsLoading ? (
            <div className="p-4">Loading...</div>
          ) : (
            CollectionsData &&
            Object.entries(CollectionsData).map(([category, items], index) => (
              <div key={category}>
                <div
                  onClick={() => toggleSubcategories(category)}
                  className={`flex flex-row justify-between px-5 cursor-pointer hover:bg-gray-100 hover:text-black ${
                    expandedSubcategories[category]
                      ? "bg-gray-100 text-black"
                      : "bg-gray-50"
                  } p-2 transition-colors duration-500 select-none`}
                >
                  <p>{category}</p>
                  <img
                    src={assets.arrow_right}
                    height="10px"
                    width="20px"
                    alt="arrow"
                    className={`transition-transform duration-300 ${
                      expandedSubcategories[category] ? "rotate-90" : ""
                    }`}
                  />
                </div>

                <div
                  className={`transition-all duration-500 ${
                    expandedSubcategories[category]
                      ? "max-h-screen opacity-100"
                      : "max-h-0 opacity-0"
                  } overflow-hidden`}
                >
                  {items.map((item, subindex) => (
                    <div
                      key={subindex}
                      className="flex flex-row items-center px-2 m-2 mx-5 rounded-full hover:bg-gray-100 hover:text-black bg-gray-50 p-2 transition-colors duration-500 select-none"
                    >
                      <img
                        src={item.thumbnail || assets.p_img1}
                        alt=""
                        className="h-8 w-8 rounded-full mr-4"
                      />
                      <p className="line-clamp-1">{item.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        <NavLink
          onClick={() => setMenuVisible(false)}
          className="block hover:bg-gray-100 hover:text-black bg-gray-50 p-2 my-1 transition-colors duration-500"
          to="/about"
        >
          ABOUT
        </NavLink>
        <NavLink
          onClick={() => setMenuVisible(false)}
          className="block hover:bg-gray-100 hover:text-black bg-gray-50 p-2 my-1 transition-colors duration-500"
          to="/contact"
        >
          CONTACT
        </NavLink>
        <NavLink
          onClick={() => setMenuVisible(false)}
          className="block hover:bg-gray-100 hover:text-black bg-gray-50 p-2 my-1 transition-colors duration-500"
          to="/"
        >
          My Profile
        </NavLink>
      </div>
    </div>
  );
}

export default SlidBarMenu;
