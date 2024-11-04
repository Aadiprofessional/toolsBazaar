import React from 'react';

const Sidebar = () => {
  const ad1ImageUrl = 'https://firebasestorage.googleapis.com/v0/b/toolsbazaar-c1927.appspot.com/o/banners%2Fbanner2?alt=media'; // URL for Ad 1
  const ad2ImageUrl = 'https://firebasestorage.googleapis.com/v0/b/toolsbazaar-c1927.appspot.com/o/banners%2Fbanner5?alt=media'; // URL for Ad 2

  return (
    <div style={styles.sidebar}>
      <div style={{ ...styles.adContainer, height: '650px', backgroundImage: `url(${ad1ImageUrl})` }}>  
      </div>
      <div style={{ ...styles.adContainer, height: '380px', backgroundImage: `url(${ad2ImageUrl})` }}>
      </div>
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
    marginBottom: '10px',
    position: 'relative',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    width: '100%',
  },
};

export default Sidebar;
