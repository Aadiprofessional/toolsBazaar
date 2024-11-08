import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import mobileLogo from "../assets/mobile-logo.png";
import searchIcon from "../assets/search.png";
import cartIcon from "../assets/cart.png";
import humanIcon from "../assets/human.png";
import navIcon from "../assets/nav2.png";
import DropdownMenu from "./navBar/DropdownMenu";
import LeftSlider from "./LeftSlider";
import { auth, firestore } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import playstoreIcon from "../assets/Playstore.png";
import appstoreIcon from "../assets/Appstore.png"; 
import "./TaskBar.css";
import axios from "axios";
import { Select } from "antd";
import { useCart } from "./CartContext"; // Import the useCart hook

const TaskBar = ({ onSearch, onLogout }) => {
  const navigate = useNavigate();
  const { cart } = useCart(); // Access the cart from the context
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(humanIcon);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [uid, setUid] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;
    setIsAuthenticated(!!user);
    if (user) {
      setUid(user.uid);
      fetchUserProfileImage(user.uid);
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
      if (user) {
        setUid(user.uid);
        fetchUserProfileImage(user.uid);
      }
    });

    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      unsubscribe();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    // Fetch data on screen load
    fetchProductSuggestions();
  }, []);

  const fetchUserProfileImage = async (uid) => {
    try {
      const userDocRef = doc(firestore, "users", uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists() && userDoc.data().profileImage) {
        setProfileImage(userDoc.data().profileImage);
      } else {
        setProfileImage(humanIcon);
      }
    } catch (error) {
      console.error("Error fetching user profile image:", error);
      setProfileImage(humanIcon);
    }
  };

  const fetchProductSuggestions = async () => {
    try {
      const response = await axios.get(
        `https://toolsbazaar-server-1036279390366.asia-south1.run.app/searchItems`
      );
      setSuggestions(response.data || []);
    } catch (error) {
      console.error("Error fetching product suggestions:", error);
    }
  };

  const handleSuggestionClick = (product) => {
    console.log('Product object:', product); // Log the product object

    if (product) {
      console.log('Attribute 1:', product.attribute1);
      console.log('Attribute 2:', product.attribute2);
      console.log('Attribute 3:', product.attribute3);

      navigate(
        `/product/${product.mainId}/${product.categoryId}/${product.productId}/${product.attribute1}/${product.attribute2}/${product.attribute3}`, // Pass attribute IDs
        {
          state: {
            product: {
              ...product,
              image: product.image,
              main: product.main,
              product: product.product,
              category: product.category,
              attribute1D: product.attribute1, // Include attribute1D
              attribute2D: product.attribute2, // Include attribute2D
              attribute3D: product.attribute3  // Include attribute3D
            },
          },
        }
      );
    } else {
      console.error('Product object is undefined');
    }
  };


  const handleLoginClick = () => navigate("/login");
  const handleCart = () => navigate("/Cart");
  const handleLogoClick = () => navigate("/");
  const handleNavClick = () => {
    setIsSliderOpen(true);
  };

  const cartItemCount = cart.length; // Get the cart item count

  return (
    <div className="task-bar">
      <div className="left-sectionTask">
        {isMobileView && (
          <img
            src={navIcon}
            alt="Navigation"
            className="nav-icon"
            onClick={handleNavClick}
          />
        )}
        <img
          src={isMobileView ? mobileLogo : logo}
          alt="Logo"
          className="logoTask"
          onClick={handleLogoClick}
        />
        <div className="search-containerTask">
          <Select
            style={{ width: "100%" }}
            showSearch
            placeholder="Search Products"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={suggestions.map((product) => ({
              value: product.productId,
              label: product.product,
              product,
            }))}
            onSelect={(value, option) => handleSuggestionClick(option.product)}
          />
        </div>
      </div>
      <div className="right-section">
       
        {isAuthenticated || isMobileView ? (
        <div className="profile-dropdown-wrapper">
        <div
          className="category-container"
          onClick={() => {
            if (isAuthenticated) {
              setDropdownVisible(!dropdownVisible);
            } else {
              handleLoginClick();
            }
          }}
        >
          <img src={profileImage} alt="User" className="nav-icon profile-image" />
        </div>
      
        {dropdownVisible && (
          <div className="dropdown-menu-container">
            <DropdownMenu categories={categories} onClose={() => setDropdownVisible(false)} />
          </div>
        )}
      </div>
      
        ) : (
          <button className="login-button" onClick={handleLoginClick}>
            Login / Register
          </button>
        )}
        <div className="cart-container">
          <button className="cart-button" onClick={handleCart}>
            <img src={cartIcon} alt="Cart" className="icon" />
            <div className="cart-text">Cart</div>
            {cartItemCount > 0 && (
              <div className="cart-item-count">{cartItemCount}</div> // Display item count
            )}
          </button>
        </div>
        <div className="storeContainer">
          <div className="storeIcons">
            <img src={playstoreIcon} alt="Play Store" className="storeIcon" />
            <div className="storeSeparator"></div>
            <img src={appstoreIcon} alt="App Store" className="storeIcon" />
          </div>
          <div className="downloadText">Download the APP!</div>
        </div>

      </div>

      <LeftSlider
        isOpen={isSliderOpen}
        onClose={() => setIsSliderOpen(false)}
      />
    </div>
  );
};

const categories = [
  "Abrasives",
  "Adhesives Sealants and Tape",
  "Agriculture Garden & Landscaping",
];

export default TaskBar;
