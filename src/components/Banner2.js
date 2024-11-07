import React from 'react';
import ProductsGrid3 from './ProductsGrid copy';

const Banner2 = () => {

  return (
    <div style={styles.container}>
      <div style={styles.banner} />
      <div style={styles.textContainer}>
        <span style={styles.text}>Best Deals</span>
      </div>
      <div style={styles.productsContainer}>
        <ProductsGrid3 /> {/* ProductsGrid placed below Banner */}

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
    backgroundImage: `url('https://firebasestorage.googleapis.com/v0/b/toolsbazaar-c1927.appspot.com/o/banners%2Fbanner8?alt=media')`,
    backgroundSize: 'contain', // Display the entire image without cropping
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    aspectRatio: '16/3', // Adjust aspect ratio as needed for your image
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
