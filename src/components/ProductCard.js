import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Import toast if using react-toastify
import truckIcon from "../assets/truck.png";
import './productCaed.css'
import { auth } from "../firebaseConfig";
import { useCart } from "./CartContext";
import { Rate, Space } from "antd";



const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const { addToCart } = useCart();

  const discountedPrice = (product.price - (product.price * ((product.additionalDiscount) / 100)));
  console.log(discountedPrice);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleCardClick = () => {
    console.log('Product object:', product); // Log the product object

    if (product) {
      console.log('Attribute 1:', product.attribute1);
      console.log('Attribute 2:', product.attribute2);
      console.log('Attribute 3:', product.attribute3);
      navigate(
        `/product/${product.mainId}/${product.categoryId}/${product.productId}/${product.attribute1Name}/${product.attribute2Name}/${product.attribute3Name}`,
        {
          state: {
            product: {
              ...product,
              image: product.image,
              main: product.main, // Pass `main` in the state object
              product: product.product,
              category: product.category,
              attribute1ID: product.attribute1Name,
              attribute2ID: product.attribute2Name,
              attribute3ID: product.attribute3Name,
            },
          },
        }
      );

    } else {
      console.error('Product object is undefined');
    }
  };

  const handleAddToCart = async () => {
    if (!currentUser) {
      toast.error("Please log in to add items to the cart.");
      navigate("/login");
      return;
    }

    if (product) {
      console.log('Add to cart', product);

      setIsLoading(true);
      try {
        await addToCart(
          product,
          Number(product.minCartValue),
          product.name,
          product.attribute1,
          product.attribute2,
          product.attribute3,
          product.mainId,
          product.categoryId,
          product.productId,
          product.attribute1Id,
          product.attribute2Id,
          product.attribute3Id,
          product.attribute1Name,
          product.attribute2Name,
          product.attribute3Name,
        );
        toast.success("Product added to cart successfully!");
      } finally {
        setIsLoading(false);
      }
    }
  };


  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  return (
    <div
      className="product-cardGrid"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <div className="label-container label-container-large">
        <div className="labelCard">
          <div className="label-contentCard">
            <div className="circleCard">
              <img src={truckIcon} alt="Truck" className="truck-icon" />
            </div>
            Ships within 24 hrs
          </div>
        </div>
      </div>

      <div className="label-container label-container-small">
        <div className="labelCard">
          <div className="label-contentCard">
            <div className="circleCard">
              <img src={truckIcon} alt="Truck" className="truck-icon" />
            </div>
            <div className="label-text">
              <span>Ships</span>
              <span>within</span>
              <span>24 hrs</span>
            </div>
          </div>
        </div>
      </div>


      <div className="content-wrapper">
        <div className="image-container">
          <img src={product.image} alt={product.name} className="image" />
        </div>
        <div className="text-container">
          <h5 className="product-name">{product.name}</h5>
          <h5 className="brand-name">By-{product.brand}</h5>
          <div className="rating-container">
            <Rate
              disabled
              value={product.rating} 
            />
            <span className="ratings-count">({product.ratings})</span>
          </div>
          <hr className="dividerCard" />
          <div className="price-container">
            <div style={styles.leftColumn}>
              <div style={styles.rightColumn}>
                {discountedPrice < product.price && (
                  <>
                    <p className="regular-price"> {Number(product.price).toLocaleString('en-IN', {
                      maximumFractionDigits: 0,
                      style: 'currency',
                      currency: 'INR',
                    })}</p>
                  </>
                )}
                <p className="cut-price"> {Number(discountedPrice).toLocaleString('en-IN', {
                  maximumFractionDigits: 0,
                  style: 'currency',
                  currency: 'INR',
                })}</p>
              </div>
              <div style={styles.rightColumn}>
                {discountedPrice < product.price && (
                  <>
                    <p className="discount-text">{product.additionalDiscount}% off!</p>
                    <p className="save-text">You save ₹{(product.price - discountedPrice).toFixed(2)}!</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="hover-content">
          <Space >
            <button
              className="cart-add-button"
              onClick={(event) => {
                event.stopPropagation();
                handleAddToCart();
              }}
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add to Cart"}
            </button>
            <button
              className="details-btn"
              onClick={(event) => event.handleCardClick()} // Prevent triggering card click
            >
              Details
            </button>
          </Space>
        </div>

      </div>
    </div>
  );
};

const styles = {

  hoverPriceContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },
  leftColumn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  rightColumn: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },


  hoverContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    backgroundColor: "#fff",
  },
};

export default ProductCard;
