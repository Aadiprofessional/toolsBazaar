import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TaskBar from "../components/TaskBar";
import BrowseCategories from "../components/BrowseCategories";
import Lottie from 'lottie-react';
import animationData from "../assets/Animation - 1724952662598.json";

const OrderPlacedScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const orderId = state?.orderId;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleLogoClick = () => {
    navigate("/");
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
    <div className="order-placed-screen" style={styles.orderPlacedScreen}>
      <TaskBar />
      <div style={styles.whiteBox}>
        <div style={styles.grayBox}>
          <div style={styles.orderPlacedContainer}>
            <div style={styles.animationBox}>
              <Lottie
                animationData={animationData}
                loop
                autoplay
                style={{ height: 200, width: 200 }}
              />
            </div>
            <div style={styles.messageBox}>
              <p style={styles.orderPlacedText}>Order Placed Successfully!</p>
              <p style={styles.welcomeText}>
                Welcome to the Toolbazar Family!
                <br />
                You will receive a copy of your invoice and <br />
                further instructions via email shortly.
              </p>
              {orderId && (
                <p style={styles.orderIdText}>
                  Your Order ID: <strong>{orderId}</strong>
                </p>
              )}
              <button
                style={styles.continueBrowsingButton}
                onClick={handleLogoClick}
              >
                Continue Browsing
              </button>
            </div>
          </div>
          <BrowseCategories categories={categories} />
        </div>
      </div>
    </div>
  );
};

const styles = {
  orderPlacedScreen: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    padding: "20px",
  },
  whiteBox: {
    backgroundColor: "#FFFFFF",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    borderRadius: "10px",
    marginTop: "70px",
    width: "100%",
    maxWidth: "1500px",
  },
  grayBox: {
    backgroundColor: "#EEEEEE",
    padding: "20px",
    borderRadius: "10px",
  },
  orderPlacedContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  animationBox: {
    border: "2px solid black",
    borderRadius: "10px",
    padding: "10px",
    marginBottom: "20px",
  },
  messageBox: {
    textAlign: "center",
  },
  orderPlacedText: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333333",
    marginBottom: "10px",
  },
  welcomeText: {
    fontSize: "16px",
    color: "#666666",
    marginBottom: "20px",
  },
  orderIdText: {
    fontSize: "18px",
    color: "#333333",
    marginTop: "10px",
  },
  continueBrowsingButton: {
    marginTop: "10px",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    backgroundColor: "#FA832A",
    color: "#fff",
    width: "70%",
  },
};

export default OrderPlacedScreen;
