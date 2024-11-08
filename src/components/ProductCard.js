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
              product: product.product,
              category: product.category,
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
    <hr className="dividerCard" />
    <div className="price-container">
            <div style={styles.leftColumn}>
              <div style={styles.rightColumn}>
                {discountedPrice < product.price && (
                  <>
                    <p style={styles.regularPrice}> {Number(product.price).toLocaleString('en-IN', {
                maximumFractionDigits: 0,
                style: 'currency',
                currency: 'INR',
              })}</p>
                  </>
                )}
                <p style={styles.cutPrice}> {Number(discountedPrice).toLocaleString('en-IN', {
                maximumFractionDigits: 0,
                style: 'currency',
                currency: 'INR',
              })}</p>
              </div>
              <div style={styles.rightColumn}>
                {discountedPrice < product.price && (
                  <>
                    <p style={styles.discountText}>{product.additionalDiscount}% off!</p>
                    <p style={styles.saveText}>You save ₹{(product.price - discountedPrice).toFixed(2)}!</p>
                  </>
                )}
              </div>
            </div>
          </div>
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
  regularPrice: {
    textDecoration: "line-through",
    color: "#666",
    fontSize: "12px",

    marginRight: "10px",
    marginBottom: -10,
  },
  cutPrice: {
    color: "#EA6021",
    fontSize: "12px",
    fontWeight: "bold",
    marginBottom: -10,
  },
  discountText: {
    color: "#25881A",
    fontSize: "10px",
    fontWeight: "Regular",
    marginRight: "10px",
    

  },
  saveText: {
    color: "#25881A",
    fontSize: "12px",
    fontWeight: "Regular",
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
