import React from "react";
import {
  BrowserRouter as Router,
  Routes, 
  Route, 
  Navigate, 
  useNavigate
} from "react-router-dom";

import TaskBar from "./components/TaskBar";
import LoginPage from "./screens/LoginPage";
import LandingPage from "./screens/LandingPage";
import ProductDetail from "./screens/ProductDetail";
import AllCategories from "./screens/AllCategories";
import RegisterPage from "./screens/RegisterPage";
import { CartProvider } from "./components/CartContext";
import CartScreen from "./screens/Cartscreen";
import { ToastContainer } from 'react-toastify';
import ProfileScreen from "./screens/MyProfile";
import ContactScreen from "./screens/Contactus";
import OrderPlacedScreen from "./screens/PlaceOrder";
import OrderHistory from "./screens/OrderHistory";
import AddressScreen from "./screens/AddressScreen";
import './styles/global.css';
import Blogs from "./components/Blogs/Blogs";
import BlogsInfo from "./components/Blogs/BlogsInfo";
import SubCategory from "./screens/SubCategory";
import SubCategory2 from "./screens/SubCategory copy";
import FAQScreen from "./screens/faq";
function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated");
    if (storedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (credentials) => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("phoneNumber", credentials.phoneNumber);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("phoneNumber");
  };

  return (
    <Router>
      <ToastContainer />
      <CartProvider>
        <Routes>
          <Route path="/" element={<LandingPageWrapper />} />
          <Route
            path="/login"
            element={<LoginPageWrapper onLogin={handleLogin} />}
          />
          <Route path="/Cart" element={<CartScreen />} />
          <Route path="/product/:mainId/:categoryId/:productId/:attribute1D/:attribute2D/:attribute3D" element={<ProductDetail />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/Contact" element={<ContactScreen />} />
          <Route path="/OrderPlaced" element={<OrderPlacedScreen />} />
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/faqs" element={<FAQScreen />} />
          
          <Route path="/Address" element={<AddressScreen/>}/>
          <Route path="/subcategories" element={<SubCategory />}/>
          <Route path="/subcategory2" element={<SubCategory2 />} />
          <Route path="/blogs" element={<Blogs/>}/>
          <Route path="/blogs/:id" element={<BlogsInfo/>}/>
          <Route
            path="/landing"
            element={
              isAuthenticated ? (
                <>
                  <TaskBar
                    onSearch={(query) => console.log("Search query:", query)}
                    onLogout={handleLogout}
                  />
                  <LandingPage />
                </>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          
          <Route path="/AllCategories" element={<AllCategories />} />
        </Routes>
      </CartProvider>
    </Router>
  );
}

function LandingPageWrapper() {
  const navigate = useNavigate();

  React.useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated");
    if (storedAuth === "true") {
      navigate("/landing");
    }
  }, [navigate]);

  return <LandingPage onLogin={() => navigate("/login")} />;
}

function LoginPageWrapper({ onLogin }) {
  const navigate = useNavigate();

  const handleLoginAndRedirect = (credentials) => {
    onLogin(credentials);
    navigate("/landing");
  };

  return <LoginPage onLogin={handleLoginAndRedirect} />;
}

export default App;
