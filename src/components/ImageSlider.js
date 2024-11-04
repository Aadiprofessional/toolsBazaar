import React from 'react';

const ImageSlider = () => {
  // Updated image URLs
  const images = [
    'https://firebasestorage.googleapis.com/v0/b/toolsbazaar-c1927.appspot.com/o/banners%2Fbanner1?alt=media',
    'https://firebasestorage.googleapis.com/v0/b/toolsbazaar-c1927.appspot.com/o/banners%2Fbanner2?alt=media',
    'https://firebasestorage.googleapis.com/v0/b/toolsbazaar-c1927.appspot.com/o/banners%2Fbanner3?alt=media',
    'https://firebasestorage.googleapis.com/v0/b/toolsbazaar-c1927.appspot.com/o/banners%2Fbanner3?alt=media'
  ];

  return (
    <div style={styles.container}>
      <div style={styles.sliderContainer}>
        {/* Display the first image as the main image */}
        <img
          src={images[0]}
          alt="Main"
          style={styles.mainImage}
        />
      </div>
      <div style={styles.additionalImages}>
        <img
          src={images[1]}
          alt="Side"
          style={styles.sideImage}
        />
        <div style={styles.bottomImagesContainer}>
          <img
            src={images[2]}
            alt="Bottom 1"
            style={styles.bottomImage}
          />
          <img
            src={images[3]}
            alt="Bottom 2"
            style={styles.bottomImage}
          />
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    width: '100%',
  },
  sliderContainer: {
    flex: '0 0 50%', // Takes up 50% of the container width
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    marginTop: 10, // Added margin top
    height: 'calc(40% + 40%)', // Adjust the height to the sum of the other two images
    objectFit: 'cover', // Ensure image covers the container
  },
  additionalImages: {
    flex: '0 0 50%', // Takes up 50% of the container width
    display: 'flex',
    flexDirection: 'column',
    padding: '10px',
  },
  sideImage: {
    width: '100%',
    height: '50%',
    objectFit: 'cover',
    marginBottom: '10px',
  },
  bottomImagesContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  bottomImage: {
    width: 'calc(50% - 5px)', // Each image takes up 50% of the container width, minus margin
    objectFit: 'cover',
  },
};

export default ImageSlider;
