import React from 'react';


import ProductsGrid4 from './ProductsGrid copy 2';

const Banner2 = () => {

  return (
    <div style={styles.container}>
      
      <div style={styles.banner} />
      <div style={styles.textContainer}>
        <span style={styles.text}>NEW ARRIVALS</span>
      </div>
      <div style={styles.productsContainer}>
        <ProductsGrid4 /> {/* ProductsGrid placed below Banner */}
      </div>
    </div>
  );
};

const styles = {
  container: {
    flexBasis: '100%',
    marginRight: 'auto',
    marginBottom: 50,
  },
  banner: {
    width: '100%',
    backgroundImage: `url('https://firebasestorage.googleapis.com/v0/b/toolsbazaar-c1927.appspot.com/o/banners%2Fbanner9?alt=media')`,
    backgroundSize: 'contain', // Display the entire image without cropping
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    aspectRatio: '16/3', // Adjust aspect ratio as needed for your image
  },
  textContainer: {
    width: "100%", // Same width as the image
    marginTop: "20px", // Space between image and text
    marginLeft : 20,
  },
  text: {
    fontWeight: "bold", // Bold text
    fontSize: "18px", // Optional font size
    fontFamily: "'Outfit', sans-serif", 
    textAlign: "left", // Align text to the left
    display: "block", // Ensure the text takes full width
  },
  productsContainer: {
    marginTop: '20px', // Adjust margin as needed
  },
};

export default Banner2;
