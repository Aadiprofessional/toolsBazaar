import React from "react";
import image9 from "../assets/image9.png";
import ProductsGrid from "./ProductsGrid";

const Sidebar2 = () => {
  return (
    <div>
      <div style={styles.headerContainer}>
        <span style={styles.headerText}>Office Supplies</span>
        <button style={styles.viewAllButton}>View All</button>
      </div>
      <div style={styles.contentContainer}>
        <ProductsGrid style={styles.productsGrid} /> {/* ProductsGrid on the left */}
        <div style={styles.imageContainer}>
          <img
            src={image9}
            alt="Ad 1"
            className="img-fluid"
            style={styles.image}
          />
        </div>
      </div>
    </div>
  );
};

const styles = {
  headerContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
    padding: "0 20px",
  },
  headerText: {
    fontWeight: "bold",
    fontSize: "16px",
    fontFamily: "'Outfit', sans-serif", 
  },
  viewAllButton: {
    border: "none",
    backgroundColor: "#007bff",
    color: "#fff",
    borderRadius: "20px",
    padding: "5px 10px",
    cursor: "pointer",
  },
  contentContainer: {
    display: "flex",
    width: "100%",
  },
  productsGrid: {
    flexBasis: "75%", // Takes 75% width of the screen
  },
  imageContainer: {
    flexBasis: "25%", // Takes 25% width of the screen
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "auto",
  },
};

export default Sidebar2;
