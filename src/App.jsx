import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

function App() {

  return (
    <BrowserRouter>
      <CollectionsProvider>
        <Navbar />
        <SearchBar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/collection/:categoryName/:subCategoryName" element={<Collection />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/product/:productId" element={<Product />} />
        </Routes>
        <Footer />
      </CollectionsProvider>
    </BrowserRouter>
  );
}

export default App;
