import React from 'react';
import ProductsGrid from './ProductsGrid';

const Banner = () => {

  return (
    <div style={styles.container}>
      <div style={styles.banner} />
      <div style={styles.productsContainer}>
        <ProductsGrid /> {/* ProductsGrid placed below Banner */}
      </div>
    </div>
  );
};

const styles = {
  container: {
    flexBasis: '74%',
    marginRight: 'auto',
  },
  banner: {
    width: '100%',
    height: '130px', // Set your desired height
    backgroundImage: `url('https://firebasestorage.googleapis.com/v0/b/toolsbazaar-c1927.appspot.com/o/banners%2Fbanner1?alt=media')`,
    backgroundSize: 'cover', // Ensure the image covers the container
    backgroundPosition: 'center', // Center the image
    backgroundRepeat: 'no-repeat', // Avoid repeating the image
  },
  productsContainer: {
    marginTop: '20px', // Adjust margin as needed
  },
};

export default Banner;
