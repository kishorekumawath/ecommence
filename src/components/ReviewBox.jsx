import React from 'react'
import { assets } from '../assets/assets'

function ReviewBox({review}) {
    const filledStars = Math.floor(Number(review.rating))
    const dullStars = 5 - filledStars;
  return (
    <div className="flex gap-4">
    <img src={assets.p_img1} alt="" className="w-10 h-10 rounded-full" />
    <div className="flex flex-col gap-1">
      <p className="font-semibold">{review.comment}</p>

      <div className="flex items-center gap-1">
        {
            Array(filledStars).fill().map((_, index) => (
              <img key={index} src={assets.star_icon} alt="" className="w-4" />
            ))
        }
        {
            Array(dullStars).fill().map((_, index) => (
              <img key={index} src={assets.star_dull_icon} alt="" className="w-4" />
            ))
        }

      </div>
      <p>{review.rating}</p>
    </div>
  </div>
  )
}

export default ReviewBox
