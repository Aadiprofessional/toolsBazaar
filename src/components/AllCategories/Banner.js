import React from 'react';

const Banner = () => {
  const bannerImageUrl = 'https://firebasestorage.googleapis.com/v0/b/toolsbazaar-c1927.appspot.com/o/banners%2Fbanner4?alt=media'; // URL for the banner

  return (
    <div style={{ ...styles.banner, backgroundImage: `url(${bannerImageUrl})` }}>
      {/* Banner content */}
    </div>
  );
};

const styles = {
  banner: {
    width: '100%',
    height: '300px', // Adjust height as needed
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    marginBottom: '20px',
  },
};

export default Banner;
