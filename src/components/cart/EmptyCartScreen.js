// src/components/EmptyCartScreen.js
import React from "react";
import cartIcon from "../../assets/cart-empty.png";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import TaskBar from "../TaskBar";

const EmptyCartScreen = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogoClick = () => {
    navigate("/"); // Navigate to the landing page
  };

  const categories = [
    "Abrasives",
    "Adhesives Sealants and Tape",
    "Agriculture Garden & Landscaping",
    "Automotive Maintenance and Lubricants",
    "Bearings",
    "Cleaning",
    "Electrical",
    "Furniture, Hospitality and Food Service",
    "Hand Tools",
    "Hardware",
    "Hydraulics and Pneumatics",
    "IT Security",
    "Industrial Automation",
    "LED & Lights",
    "Lab Supplies",
    "Material Handling and Packaging",
    "Medical Supplies & Equipment",
    "Motors & Power Transmission",
    "Office Supplies",
    "Plumbing",
    "Power Tools",
    "Pumps",
    "Safety",
    "Solar",
    "Testing and Measuring Instruments",
    "Tooling and Cutting",
    "Welding",
  ];

  return (
    <div className="empty-cart" style={styles.emptyCart}>
      <TaskBar />
      <div style={styles.whiteBox}>
        <div style={styles.grayBox}>
          <div style={styles.emptyCartHeader}>
            <img
              src={cartIcon}
              alt="Empty Cart Icon"
              style={styles.emptyCartIcon}
            />
            <h2 style={styles.emptyCartText}>Shopping cart is empty!</h2>
          </div>
          <p style={styles.browseText}>Browse by categories</p>
          <div style={styles.categoryButtons}>
            {categories.map((category) => (
              <button key={category} style={styles.categoryButton}>
                {category}
              </button>
            ))}
          </div>
        </div>
        <button style={styles.shopNowButton} onClick={handleLogoClick}>
          Start Shopping
        </button>
      </div>
      <p style={styles.termsText}>
        By clicking on Place Order button you agree to{" "}
        <a href="/terms" style={styles.linkText}>
          Terms & Conditions
        </a>{" "}
        and{" "}
        <a href="/privacy" style={styles.linkText}>
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
};

const styles = {
  emptyCart: {
    display: "flex",
    flexDirection: "column",
    marginTop: "90px",
    alignItems: "center",
    textAlign: "center",
    padding: "20px",
  },
  whiteBox: {
    backgroundColor: "#FFFFFF",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    borderRadius: "10px",
    width: "100%",
    maxWidth: "1500px",
  },
  grayBox: {
    backgroundColor: "#EEEEEE",
    padding: "20px",
    borderRadius: "10px",
  },
  emptyCartHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
    justifyContent: "center", // Center the header
  },
  emptyCartIcon: {
    marginRight: "10px",
    width: "40px",
  },
  emptyCartText: {
    fontSize: "18px",
    fontWeight: "bold",
    fontFamily: "'Outfit', sans-serif", 
    color: "#666666",
  },
  browseText: {
    textAlign: "left",
    fontWeight: "bold",
    fontFamily: "'Outfit', sans-serif", 
    marginTop: "10px",
    color: "#666666",
  },
  categoryButtons: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "left",
    marginTop: "10px",
  },
  categoryButton: {
    backgroundColor: "transparent",
    border: "none",
    color: "#666666",
    cursor: "pointer",
    padding: "5px 10px",
    textAlign: "left",
    width: "50%",
  },
  shopNowButton: {
    marginTop: "20px",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    backgroundColor: "#FA832A",
    color: "#fff",
    width: "40%",
  },
  termsText: {
    marginTop: "20px",
    fontSize: "12px",
    fontFamily: "'Outfit', sans-serif", 
    color: "#777",
    textAlign: "center",
  },
  linkText: {
    color: "#007BFF",
    textDecoration: "none",
  },
};

export default EmptyCartScreen;
