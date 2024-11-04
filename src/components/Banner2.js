import React from 'react';

import ProductsGrid2 from './ProductsGrid';

const Banner2 = () => {

  return (
    <div style={styles.container}>
      <div style={styles.banner} />
      <div style={styles.textContainer}>
        <span style={styles.text}>Best Deals</span>
      </div>
      <div style={styles.productsContainer}>
        <ProductsGrid2 /> {/* ProductsGrid placed below Banner */}

      </div>
     
    </div>
  );
};

const styles = {
  container: {
    flexBasis: '100%',
    marginRight: 'auto',
  },
  banner: {
    width: '100%',
    height: '170px', // Set your desired height
    backgroundImage: `url('https://firebasestorage.googleapis.com/v0/b/toolsbazaar-c1927.appspot.com/o/banners%2Fbanner4?alt=media')`,
    backgroundSize: 'cover', // Ensure the image covers the container
    backgroundPosition: 'center', // Center the image
    backgroundRepeat: 'no-repeat', // Avoid repeating the image
  },
  productsContainer: {
    marginTop: '20px', // Adjust margin as needed
  },
  textContainer: {
    width: "100%", // Same width as the image
    marginTop: "20px", // Space between image and text
    marginLeft : 20,
  },
  text: {
    fontWeight: "bold", // Bold text
    fontSize: "18px", // Optional font size
    textAlign: "left", // Align text to the left
    display: "block", // Ensure the text takes full width
  },
};

export default Banner2;
