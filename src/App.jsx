import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
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
import { NewAuthProvider, useAuth } from "./context/NewAuthContext";

import Profile from "./pages/Profile";
import {
  PrivacyPolicy,
  ReturnPolicy,
  ShippingPolicy,
  TermsOfService,
} from "./components/PolicyComponents";

import SuccessPage from "./pages/SuccessPage";
import ScrollToTop from "./components/ScrollTop";
import Wishlist from "./pages/Wishlist";
import { WishlistProvider } from "./context/WhislistContext";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

import { GoogleOAuthProvider } from "@react-oauth/google";
import BottomNavBar from "./components/BottomNavbar";

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Redirect to login if no user
  if (!user) {
    return (
      <Navigate
        to={`/login?returnTo=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  return children;
};

const GoogleAuthWrapper = ({ children }) => {
  const clientId = import.meta.env.VITE_OAUTH_CLIENT_ID;
  return (
    <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>
  );
};

function App() {
  return (
    <BrowserRouter>
      <GoogleAuthWrapper>
        <NewAuthProvider>
          <WishlistProvider>
            <CollectionsProvider>
              <CartProvider>
                <ScrollToTop /> {/* Scroll restoration feature */}
                <Navbar />
                <BottomNavBar/>
                <SearchBar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route
                    path="/collection/:categoryName/:subCategoryName"
                    element={<Collection />}
                  />
                  <Route path="/contact" element={<Contact />} />

                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route
                    path="/successPage/:qiKinkOrderId"
                    element={<SuccessPage />}
                  />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route
                    path="/place-order"
                    element={
                      <ProtectedRoute>
                        <PlaceOrder />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/product/:productId" element={<Product />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/return" element={<ReturnPolicy />} />
                  <Route path="/shipping" element={<ShippingPolicy />} />
                  <Route path="/terms" element={<TermsOfService />} />
                  {/* Define other routes here */}
                  <Route path="/404" element={<NotFound />} />
                  <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
                    
                <Footer />
                
              </CartProvider>
            </CollectionsProvider>
          </WishlistProvider>
        </NewAuthProvider>
      </GoogleAuthWrapper>
    </BrowserRouter>
  );
}

export default App;
