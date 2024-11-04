import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './CategoriesGrid.css'; // Ensure this file is linked for additional styles

function CategoriesGrid2() {
  const location = useLocation(); // Get location state
  const navigate = useNavigate(); // Initialize useNavigate
  const { mainId } = location.state || {}; // Extract mainId from location state
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.post(
        'https://toolsbazaar-server-1036279390366.asia-south1.run.app/getCategories',
        { main: mainId } // Use mainId to fetch categories
      );
      setCategories(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setLoading(false);
    }
  }, [mainId]);

  useEffect(() => {
    if (mainId) {
      fetchCategories();
    }
  }, [mainId, fetchCategories]);

  const handleCardClick = (categoryId) => {
    navigate('/subcategory2', {
      state: { categoryId, mainId } // Pass the categoryId and mainId to SubCategory2
    });
  };

  return (
    <div className="container">
      {loading ? (
        <div className="loadingContainer">
          <div className="spinner">Loading...</div>
        </div>
      ) : (
        <div className="grid">
          {categories.length > 0 ? (
            categories.map(({ id, name, image }) => (
              <div
                key={id}
                className="card"
                onClick={() => handleCardClick(id)} // Handle card click
              >
                <div className="cardImageContainer">
                  <img src={image} alt={name} className="cardImage" />
                </div>
                <div className="cardTitle">{name}</div>
              </div>
            ))
          ) : (
            <div className="noCategories">No categories found</div>
          )}
        </div>
      )}
    </div>
  );
}

export default CategoriesGrid2;
