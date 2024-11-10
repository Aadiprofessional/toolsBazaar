import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CategoriesGrid.css';

function CategoriesGrid() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get('https://toolsbazaar-server-1036279390366.asia-south1.run.app/getMain');
      console.log('Fetched categories:', response.data);
      setCategories(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories: ', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCardClick = (id, name) => {
    // Navigate to SubCategoryScreen2 with mainId and mainName
    navigate(`/subcategories`, { state: { mainId: id, mainName: name } });
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
              <div key={id} className="card" onClick={() => handleCardClick(id, name)}>
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

export default CategoriesGrid;
