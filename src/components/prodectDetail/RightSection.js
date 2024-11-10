import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useCart } from "../CartContext";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebaseConfig";
import "./RightSection.css"; // Import the CSS file
import CallIcon from "../../assets/Call.png"; // Import Call.png image
import MailIcon from "../../assets/email.png";
import WhatsAppIcon from "../../assets/social.png"

const RightSection = ({
  product,
  productName,
  attribute1,
  attribute2,
  attribute3,
  mainId,
  productId,
  categoryId,
  selectedAttribute1,
  selectedAttribute2,
  selectedAttribute3,
  attribute1Id,
  attribute2Id,
  attribute3Id
  
}) => {
  const [quantity, setQuantity] = useState(product?.minCartValue || 1);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const price = parseFloat(product?.price || 0);
  const additionalDiscount = product?.additionalDiscount || 0;
  const discountedPrice = price - (price * (additionalDiscount / 100));

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (product?.minCartValue) {
      setQuantity(product.minCartValue);
    }
  }, [product]);

  const increaseQuantity = () => {
    if (quantity < product.inventory) { // Check if current quantity is less than inventory
      setQuantity((prevQuantity) => Number(prevQuantity) + 1);
    } else {
      toast.info(`Only ${product.inventory} items available in stock. Cannot increase quantity further.`);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > product?.minCartValue) {
      setQuantity(quantity - 1);
    } else {
      toast.info(`Minimum quantity is ${product?.minCartValue}. Cannot decrease further.`);
    }
  };
console.log('asd',product);

  const handleAddToCart = async () => {
    if (!currentUser) {
      toast.error("Please log in to add items to the cart.");
      navigate("/login"); // Navigate to /login if the user is not logged in
      return;
    }
  
    if (product) {
      setIsLoading(true);
      try {
        await addToCart(
          product,
          Number(quantity),
          productName,
          attribute1,
          attribute2,
          attribute3,
          mainId,
          categoryId,
          productId,
          attribute1Id = product.attribute1Id,
          attribute2Id = product.attribute2Id,
          attribute3Id = product.attribute3Id,
          selectedAttribute1 = selectedAttribute1,
          selectedAttribute2 = selectedAttribute2,
          selectedAttribute3 = selectedAttribute3,
          
        );
        toast.success("Product added to cart successfully!");
      } finally {
        setIsLoading(false);
      }
    }
  };
  const handlePhoneCall = () => {
    window.open('tel:+919924686611');
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/919924686611');
  };

  const handleEmail = () => {
    window.open('mailto:ecomrtepl@gmail.com');
  };
  
  if (!productName) {
    return <div></div>;
  }

  return (
    <div className="right-sectionProduct">
      <div className="white-boxProduct">
        <h2 className="price-textProduct">₹{discountedPrice.toFixed(2)}</h2>
        <span className="gst-inclusive-text">(GST inclusive price)</span>
        <p className="gst-extra-text">₹{price.toFixed(2)}</p>
        <hr className="dividerRight" />
        <p className="update-quantity-text">Update Quantity</p>
        <div className="quantity-container">
          <button
            className="quantity-buttonProduct"
            onClick={decreaseQuantity}
            disabled={quantity === (product?.minCartValue || 1)}
          >
            -
          </button>
          <span className="quantity-display">{quantity}</span>
          <button className="quantity-buttonProduct" onClick={increaseQuantity}>
            +
          </button>
          <span className="min-order-text">
            Minimum Order Quantity: {product?.minCartValue || "N/A"}
          </span>
        </div>
      </div>

      <div className="white-boxProduct">
        <div className="buttons-container">
          {/* Conditionally render Add to Cart button or Out of Stock text */}
          {product?.outOfStock ? (
            <p className="out-of-stock-text">Out of Stock</p>
          ) : (
            <button
              className="add-to-cart-button"
              onClick={handleAddToCart}
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add to Cart"}
            </button>
          )}
        </div>
      </div>
      <div className="white-boxProduct contact-section">
      <p className="contact-heading"><strong>Connect with Us</strong></p>
      <p className="contact-subtext">
        Have a question or want to place an order? Reach out through any of the following options:
      </p>
      <div className="help-section" onClick={handlePhoneCall}>
        <img src={CallIcon} alt="Call Icon" className="call-icon" />
        <p className="call-text"><strong>Helpline Number:</strong> +91 9924686611</p>
      </div>
      <div className="help-section" onClick={handleWhatsApp}>
        <img src={WhatsAppIcon} alt="WhatsApp Icon" className="call-icon" />
        <p className="call-text"><strong>WhatsApp:</strong> +91 9924686611</p>
      </div>
      <div className="help-section" onClick={handleEmail}>
        <img src={MailIcon} alt="Mail Icon" className="call-icon" />
        <p className="call-text"><strong>Email:</strong> ecomrtepl@gmail.com</p>
      </div>
      <p className="contact-hours">(Mon-Sun: 9am-6pm)</p>
    </div>
    </div>
  );
};

export default RightSection;
