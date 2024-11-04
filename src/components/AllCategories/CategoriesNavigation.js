import React from 'react';

function CategoriesNavigation() {
  const categories = ["Fulcrum", "Ladders", "Pallet Trucks & Trolleys", "Plastic Crates"];
  
  return (
    <nav style={styles.nav}>
      {categories.map((category, index) => (
        <button key={index} style={styles.navButton}>
          {category}
        </button>
      ))}
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '20px',
  },
  navButton: {
    padding: '10px 20px',
    backgroundColor: '#ff5733',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '5px',
  },
};

export default CategoriesNavigation;
