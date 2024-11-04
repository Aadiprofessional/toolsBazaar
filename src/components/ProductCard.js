import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import truckIcon from "../assets/truck.png";

import './productCaed.css'

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const discountedPrice = (product.price - (product.price * ((product.additionalDiscount) / 100)));
  console.log(discountedPrice);

  const handleCardClick = () => {
    console.log('Product object:', product); // Log the product object
  
    if (product) {
      console.log('Attribute 1:', product.attribute1);
      console.log('Attribute 2:', product.attribute2);
      console.log('Attribute 3:', product.attribute3);
      navigate(
        `/product/${product.mainId}/${product.categoryId}/${product.productId}/${product.attribute1}/${product.attribute2}/${product.attribute3}`,
        {
          state: {
            product: {
              ...product,
              image: product.image,
              main: product.main, // Pass `main` in the state object
              product:product.product,
              category:product.category,
              attribute1ID: product.attribute1,
              attribute2ID: product.attribute2,
              attribute3ID: product.attribute3,
            },
          },
        }
      );
      
    } else {
      console.error('Product object is undefined');
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
  className="product-card"
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
  onClick={handleCardClick}
>
  <div className="label-container">
    <div className="label">
      <div className="label-content">
        <div className="circle">
          <img src={truckIcon} alt="Truck" className="truck-icon" />
        </div>
        Ships within 24 hrs
      </div>
    </div>
  </div>
  <div className="content-wrapper">
        
        <div style={styles.imageContainer}>
          <img
            src={product.image}
            alt={product.name}
            style={styles.image}
          />
        </div>
        <div style={styles.textContainer}>
          <h5 style={styles.productName}>{product.name}</h5>
          <hr style={styles.divider} />
          <div style={styles.priceContainer}>
          <div style={styles.leftColumn}>
            <div style={styles.rightColumn}>
              <p style={styles.regularPrice}>₹{product.price}</p>
              <p style={styles.cutPrice}>₹{discountedPrice.toFixed(2)}</p>
            </div>
            <div style={styles.rightColumn}>
              <p style={styles.discountText}>{product.additionalDiscount}% off</p>
              <p style={styles.saveText}>You save ₹{(product.price - discountedPrice).toFixed(2)}!</p>
            </div>
            </div>
          </div>
        </div>
      </div>
    
    </div>
  );
};

const styles = {
  card: {
    width: "100%",
    maxWidth: "200px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "20px",
    position: "relative",
    backgroundColor: "#fff",
    boxSizing: "border-box",
    margin: "15px",
    cursor: "pointer",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    '@media (max-width: 768px)': {
      maxWidth: "80%",
    },
    '@media (max-width: 480px)': {
      maxWidth: "100%",
      padding: "10px",
    }
  },
  contentWrapper: {
    height: "100%",
    position: "relative",
    width: "100%",
    boxSizing: "border-box",
  },
  labelContainer: {
    position: "absolute",
    top: "0",
    right: "0",
    zIndex: 70,
  },
  label: {
    backgroundColor: "#EA6021",
    color: "#fff",
    padding: "5px 8px",
    borderRadius: "15px 0 0 15px",
    fontSize: "10px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
  },
  labelContent: {
    display: "flex",
    alignItems: "center",
  },
  circle: {
    backgroundColor: "#fff",
    borderRadius: "50%",
    width: "16px",
    height: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "3px",
  },
  truckIcon: {
    width: "12px",
    height: "12px",
  },
  imageContainer: {
    width: "100%",
    paddingTop: "80%",
    position: "relative",
    marginBottom: "10px",
  },
  image: {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  textContainer: {
    textAlign: "left",
  },
  productName: {
    fontWeight: "600",
    fontSize: "14px",
    marginBottom: "5px",
  },
  hoverDescription: {
    fontSize: "14px",
    color: "#333",
    textAlign: "center",
    marginBottom: "10px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
  },
  divider: {
    borderTop: "1px dotted #ccc",
    margin: "10px 0",
  },
  priceContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
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
  regularPrice: {
    textDecoration: "line-through",
    color: "#666",
    fontSize: "14px",
   
    marginRight:"10px"
  },
  cutPrice: {
    color: "#EA6021",
    fontSize: "16px",
    fontWeight: "bold",
  },
  discountText: {
    color: "#25881A",
    fontSize: "14px",
    fontWeight: "bold",
    marginRight:"10px",
  
  },
  saveText: {
    color: "#25881A",
    fontSize: "12px",
    fontWeight: "bold",
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
