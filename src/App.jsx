import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Cart from "./pages/Cart";
import Collection from "./pages/Collection";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Orders from "./pages/Orders";
import Product from "./pages/Product";
import Navbar from "./components/Navbar/Navbar";
import { CollectionsProvider } from "./context/CollectionsContext";
import Footer from "./components/Footer";
import SearchBar from "./components/Navbar/SearchBar";
import { CartProvider } from "./context/CartContext";
import PlaceOrder from "./pages/PlaceOrder";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Signup from "./pages/signup";

const ProtectedRoute = ({ element, }) => {
  const { user ,isLoading} = useAuth();
  if (isLoading) return <p>Loading...</p>;
  if (!user) {
    return <Navigate to="/signup" />;
  }
  return <>{element}</>;
}

function App() {

  return (
    <BrowserRouter>
  

      <AuthProvider>
      
      <CollectionsProvider>
      <CartProvider>
        <Navbar />
        <SearchBar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/collection/:categoryName/:subCategoryName" element={<Collection />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/orders" element={<Orders />} />
          
          <Route path="/place-order"element={<ProtectedRoute><PlaceOrder />  </ProtectedRoute>} />
         
          <Route path="/product/:productId" element={<Product />} />

        </Routes>
        <Footer />
        </CartProvider>
      </CollectionsProvider>
      </AuthProvider>
     
    </BrowserRouter>
  );
}

export default App;
