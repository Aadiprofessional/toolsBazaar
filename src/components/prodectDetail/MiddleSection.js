import React, { useState, useEffect, useRef } from "react";
import { toast } from 'react-toastify';
import { useCart } from "../CartContext";
import { auth } from "../../firebaseConfig";
import './MiddleSection.css';

const MiddleSection = ({
  product,
  selectedAttribute1,
  setSelectedAttribute1,
  selectedAttribute2,
  setSelectedAttribute2,
  selectedAttribute3,
  setSelectedAttribute3,
  mainId,
  categoryId,
  productId,
  productName,
  product1,
  attribute1D,
  attribute2D,
  attribute3D,
}) => {
  const [expanded, setExpanded] = useState(false);
  const descriptionRef = useRef(null);
  const [quantity, setQuantity] = useState(product1?.minCartValue || 1);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const { addToCart } = useCart();
  const price = parseFloat(product1?.price || 0);
  const [isInitialRender, setIsInitialRender] = useState(true); 
  const additionalDiscount = product1?.additionalDiscount || 0;
  const discountedPrice = price - (price * (additionalDiscount / 100));


  const { data, attribute1, attribute2, attribute3 } = product || {};
  const attribute1Options = data ? Object.keys(data[attribute1] || {}) : [];
  const attribute2Options = selectedAttribute1
    ? Object.keys(data[attribute1][selectedAttribute1]?.[attribute2] || {})
    : [];
  const attribute3Options = selectedAttribute2
    ? Object.keys(
        data[attribute1][selectedAttribute1]?.[attribute2]?.[selectedAttribute2] || {}
      )
    : [];
  const selectedData =
    product.data?.[product.attribute1]?.[selectedAttribute1]?.[product.attribute2]?.[selectedAttribute2]?.[selectedAttribute3] || {};

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

  // Set selected attributes only on initial render
  useEffect(() => {
    if (isInitialRender) {
      if (attribute1D && attribute1Options.includes(attribute1D)) {
        setSelectedAttribute1(attribute1D);
      } else if (attribute1Options.length > 0) {
        setSelectedAttribute1(attribute1Options[0]);
      }

      if (attribute2D && attribute2Options.includes(attribute2D)) {
        setSelectedAttribute2(attribute2D);
      } else if (attribute2Options.length > 0) {
        setSelectedAttribute2(attribute2Options[0]);
      }

      if (attribute3D && attribute3Options.includes(attribute3D)) {
        setSelectedAttribute3(attribute3D);
      } else if (attribute3Options.length > 0) {
        setSelectedAttribute3(attribute3Options[0]);
      }
      setIsInitialRender(false); // Set to false after initial render
    }
  }, [attribute1D, attribute2D, attribute3D, attribute1Options, attribute2Options, attribute3Options, isInitialRender]);

  const increaseQuantity = () => {
    if (quantity < product1.inventory) {
      setQuantity((prevQuantity) => Number(prevQuantity) + 1);
    } else {
      toast.info(`Only ${product1.inventory} items available in stock. Cannot increase quantity further.`);
    }
  };
  
  const decreaseQuantity = () => {
    if (quantity > product1?.minCartValue) {
      setQuantity(quantity - 1);
    } else {
      toast.info(`Minimum quantity is ${product1?.minCartValue}. Cannot decrease further.`);
    }
  };

  const handleAttribute1Change = (option) => {
    setSelectedAttribute1(option);
    // Reset attribute2 and attribute3 based on the new attribute1 selection
    const newAttribute2Options = Object.keys(data[attribute1][option]?.[attribute2] || {});
    setSelectedAttribute2(newAttribute2Options[0] || null);

    const newAttribute3Options = newAttribute2Options.length > 0
      ? Object.keys(data[attribute1][option]?.[attribute2]?.[newAttribute2Options[0]] || {})
      : [];
    setSelectedAttribute3(newAttribute3Options[0] || null);
  };

  const handleAttribute2Change = (option) => {
    setSelectedAttribute2(option);
    // Reset attribute3 based on the new attribute2 selection
    const newAttribute3Options = Object.keys(data[attribute1][selectedAttribute1]?.[attribute2]?.[option] || {});
    setSelectedAttribute3(newAttribute3Options[0] || null);
  };

  const handleAttribute3Change = (option) => {
    setSelectedAttribute3(option);
  };

  const descriptionLimit = 100;
  const truncatedDescription =
    selectedData.description?.length > descriptionLimit
      ? `${selectedData.description.substring(0, descriptionLimit)}...`
      : selectedData.description;

  const handleViewMore = () => {
   
    descriptionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleAddToCart = async () => {
    if (!currentUser) {
      toast.error("Please log in to add items to the cart.");
      return;
    }

    if (product === product1) {
      setIsLoading(true);
      try {
        await addToCart(
          product,
          quantity,
          productName,
          attribute1,
          attribute2,
          attribute3,
          mainId,
          categoryId,
          productId
        );
        toast.success("Product added to cart successfully!");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="middle-section">
      <h1>{product.productName}</h1>

      <p className="description" ref={descriptionRef}>
        {expanded ? selectedData.description : truncatedDescription}
      </p>

      {!expanded && selectedData.description?.length > descriptionLimit && (
        <button onClick={handleViewMore} className="view-more-button">
          View More
        </button>
      )}
      
      <h2 className="price-textProductPage">₹{discountedPrice.toFixed(2)}</h2>
      <span className="gst-inclusive-textPage">(GST inclusive price)</span>
      <p className="gst-extra-textPage">₹{price.toFixed(2)}</p>

      <hr className="divider" />

      <p className="ream-text">{attribute1}</p>
      <div className="ream-options">
        {attribute1Options.map((option) => (
          <button
            key={option}
            onClick={() => handleAttribute1Change(option)}
            className={`ream-option-button ${selectedAttribute1 === option ? 'selected' : ''}`}
          >
            {option}
          </button>
        ))}
      </div>

      <p className="ream-text">{attribute2}</p>
      <div className="ream-options">
        {attribute2Options.map((option) => (
          <button
            key={option}
            onClick={() => handleAttribute2Change(option)}
            className={`ream-option-button ${selectedAttribute2 === option ? 'selected' : ''}`}
          >
            {option}
          </button>
        ))}
      </div>

      <p className="ream-text">{attribute3}</p>
      <div className="ream-options">
        {attribute3Options.map((option) => (
          <button
            key={option}
            onClick={() => handleAttribute3Change(option)}
            className={`ream-option-button ${selectedAttribute3 === option ? 'selected' : ''}`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="quantity-containerPage">
        <p className="update-quantity-text">Update Quantity</p>
        <button
          className="quantity-buttonPage"
          onClick={decreaseQuantity}
          disabled={quantity === (product1?.minCartValue || 1)}
        >
          -
        </button>
        <span className="quantity-displayPage">{quantity}</span>
        <button className="quantity-buttonPage" onClick={increaseQuantity}>
          +
        </button>
        <span className="min-order-textPage">
          Minimum Order Quantity: {product1?.minCartValue || "N/A"}
        </span>
      </div>

      <div className="buttons-containerPage">
          {/* Conditionally render Add to Cart button or Out of Stock text */}
          {product1?.outOfStock ? (
            <p className="out-of-stock-textPage">Out of Stock</p>
          ) : (
            <button
              className="add-to-cart-buttonPage"
              onClick={handleAddToCart}
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add to Cart"}
            </button>
          )}
        </div>
      </div>
    
  );
};

export default MiddleSection;
