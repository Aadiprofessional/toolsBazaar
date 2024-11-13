import React from 'react';
import './ImageSlider.css'; // Import the CSS file

const ImageSlider = () => {
  // Updated image URLs
  const images = [
    'https://firebasestorage.googleapis.com/v0/b/toolsbazaar-c1927.appspot.com/o/banners%2Fbanner1?alt=media',
    'https://firebasestorage.googleapis.com/v0/b/toolsbazaar-c1927.appspot.com/o/banners%2Fbanner4?alt=media',
    'https://firebasestorage.googleapis.com/v0/b/toolsbazaar-c1927.appspot.com/o/banners%2Fbanner3?alt=media',
    'https://firebasestorage.googleapis.com/v0/b/toolsbazaar-c1927.appspot.com/o/banners%2Fbanner2?alt=media'
  ];

  return (
    <div className="containerSlider">
      <div className="sliderContainer">
        {/* Display the first image as the main image */}
        <img
          src={images[0]}
          alt="Main"
          className="mainImage"
        />
      </div>
      <div className="additionalImages">
        <img
          src={images[1]}
          alt="Side"
          className="sideImage"
        />
        <div className="bottomImagesContainer">
          <img
            src={images[2]}
            alt="Bottom 1"
            className="bottomImage"
          />
          <img
            src={images[3]}
            alt="Bottom 2"
            className="bottomImage"
          />
        </div>
      </div>
    </div>
  );
};

export default ImageSlider;
