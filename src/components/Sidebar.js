import React from 'react';

const Sidebar = () => {
  const ad1ImageUrl = 'https://firebasestorage.googleapis.com/v0/b/toolsbazaar-c1927.appspot.com/o/banners%2Fbanner5?alt=media';
  const ad2ImageUrl = 'https://firebasestorage.googleapis.com/v0/b/toolsbazaar-c1927.appspot.com/o/banners%2Fbanner6?alt=media';

  return (
    <div style={styles.sidebar}>
      <div style={{ ...styles.adContainer, backgroundImage: `url(${ad1ImageUrl})` }}></div>
      <div style={{ ...styles.adContainer2, backgroundImage: `url(${ad2ImageUrl})` }}></div>
    </div>
  );
};

const styles = {
  sidebar: {
    flexBasis: '25%',
    marginLeft: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  adContainer: {
    width: '100%',
    paddingTop: '250%', // 16:9 aspect ratio
    marginBottom: '10px',
    position: 'relative',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  },
  adContainer2: {
    width: '100%',
    paddingTop: '150%', // 16:9 aspect ratio
    marginBottom: '10px',
    position: 'relative',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  },
};

export default Sidebar;
