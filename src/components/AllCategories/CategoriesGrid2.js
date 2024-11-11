import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './CategoriesGrid.css';

function CategoriesGrid2() {
  const location = useLocation();
  const navigate = useNavigate();
  const { mainId, mainName } = location.state || {};
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.post(
        'https://toolsbazaar-server-1036279390366.asia-south1.run.app/getCategories',
        { main: mainId }
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

  const handleCardClick = (categoryId, categoryName) => {
    navigate('/subcategory2', {
      state: { categoryId, mainId, mainName, categoryName } // Pass categoryId, mainId, mainName, and categoryName
    });
  };

  return (
    <div className="container2">
      <div className="breadcrumb">
        <p>
          <span className="home-link">Home</span> &gt; All Categories &gt; <span className="category-name">{mainName}</span>
        </p>
      </div>
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
                  onClick={() => handleCardClick(id, name)} // Send categoryId and categoryName
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
    </div>
  );
}

export default CategoriesGrid2;
