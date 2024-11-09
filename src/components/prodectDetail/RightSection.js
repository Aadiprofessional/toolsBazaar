import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useCart } from "../CartContext";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebaseConfig";
import "./RightSection.css"; // Import the CSS file
import CallIcon from "../../assets/Call.png"; // Import Call.png image

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

  const handleAddToCart = async () => {
    if (!currentUser) {
      toast.error("Please log in to add items to the cart.");
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
          attribute2Id  = product.attribute2Id,
          attribute3Id  = product.attribute3Id,
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
      <div className="help-section">
        <img src={CallIcon} alt="Call Icon" className="call-icon" />
        <p className="call-text">
          <strong>Need help? Call on +91 9924686611</strong>
        </p>
      </div>
    </div>
  );
};

export default RightSection;
