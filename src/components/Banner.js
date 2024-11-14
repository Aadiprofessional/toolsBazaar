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
    backgroundImage: `url('https://firebasestorage.googleapis.com/v0/b/toolsbazaar-c1927.appspot.com/o/banners%2Fbanner7?alt=media')`,
    backgroundSize: 'cover', // Display the entire image without cropping
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    aspectRatio: '16/3', // Adjust aspect ratio as needed for your image
  },
  productsContainer: {
    marginTop: '20px', // Adjust margin as needed
  },
};

export default Banner;
