import React from 'react';

const BrowseCategories = ({ categories }) => {
  return (
    <div>
      <p style={styles.browseText}>Browse by categories</p>
      <div style={styles.categoryButtons}>
        {categories.map((category) => (
          <button key={category} style={styles.categoryButton}>
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

const styles = {
  browseText: {
    textAlign: 'left',
    fontWeight: 'bold',
    marginTop: '10px',
    color: '#666666',
  },
  categoryButtons: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start', // Ensure left alignment
    marginTop: '10px',
    gap: '1px', // Add some gap between the buttons
  },
  categoryButton: {
    backgroundColor: 'transparent',
    border: '0px solid #ccc', // Add a border for better visibility
    color: '#666666',
    cursor: 'pointer',
    padding: '8px 16px', // Reduced padding to lessen button size
    textAlign: 'left',
    width: '100%',
    maxWidth: '180px', // Slightly reduce width for more compact layout
    margin: '0', // Remove margin
  },
};

export default BrowseCategories;
