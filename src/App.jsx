import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Cart from './pages/Cart'
import Collection from './pages/Collection'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Orders from './pages/Orders'
import Product from './pages/Product'
import Navbar from './components/Navbar/Navbar'
import ShopContextProvider from './context/ShopContex'
import Footer from './components/Footer'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>

      <ShopContextProvider>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/collection' element={<Collection />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/login' element={<Login />} />
          <Route path='/orders' element={<Orders />} />
          <Route path='/product/:productId' element={<Product />} />
        </Routes>
        <Footer />
      </ShopContextProvider>
    </BrowserRouter>
  )
}

export default App
