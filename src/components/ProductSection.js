import React from 'react';


const ProductSection = ({ title, imageSrc }) => {
  return (
    <div style={styles.productSection}>
      <div style={styles.header}>
        <span style={styles.headerText}>{title}</span>
        <button style={styles.viewAllButton}>View All</button>
      </div>
      <div style={styles.contentContainer}>
        <div style={styles.productGridContainer}>
          <div style={styles.arrows}>
            <button style={styles.arrowButton}>&lt;</button>
         
            <button style={styles.arrowButton}>&gt;</button>
          </div>
        </div>
      <img src={imageSrc} alt="Product Banner" style={styles.rightImage} />
      </div>
    </div>
  );
};

const styles = {
  productSection: {
    marginTop: '20px',
    left : '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  headerText: {
    fontWeight: 'bold',
   padding : "10",
  },
  viewAllButton: {
    backgroundColor: '#E9611E',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    cursor: 'pointer',
    marginRight: '20px', // Ensures the button aligns to the right with some margin
  },
  contentContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productGridContainer: {
    width: '100%',
    position: 'relative',
  },
  arrows: {
    display: 'flex',
    alignItems: 'center',
  },
  arrowButton: {
    backgroundColor: '#D2D2D2',
    color: '#333',
    border: '0.3px solid #333',
    padding: '10px',
    cursor: 'pointer',
    margin: '0 10px',
  },
  rightImage: {
    width: '20%',
    height: 'auto',
  },
};

export default ProductSection;
