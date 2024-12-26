import React from 'react'
import Hero from '../components/Hero'
import LatestCollections from '../components/LatestCollections'
import Collections from '../components/collections'
import OurPolicy from '../components/OurPolicy'
import NewsletterBox from '../components/NewsletterBox'

function Home() {
  return (
    <div>
      <Hero/>
      <LatestCollections/>
      <Collections/>
      <OurPolicy/>
      <NewsletterBox/>
    </div>
  )
}

export default Home
