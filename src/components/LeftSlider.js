import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './LeftSlider.css'; // Import the new CSS file
import { FaChevronDown, FaChevronUp, FaChevronRight } from 'react-icons/fa'; // Import React Icons

const LeftSlider = ({ isOpen, onClose }) => {
  const [categories, setCategories] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [categoriesCache, setCategoriesCache] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        if (categoriesCache) {
          setCategories(categoriesCache);
        } else {
          await fetchAndCacheData();
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, [categoriesCache]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (isOpen && !event.target.closest('.left-slider-content')) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose]);

  const fetchAndCacheData = async () => {
    try {
      const response = await axios.get(
        "https://toolsbazaar-server-1036279390366.asia-south1.run.app/drawer"
      );
      setCategories(response.data);
      setCategoriesCache(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategory((prev) => (prev === categoryId ? null : categoryId));
  };

  const navigateToSubCategory = (categoryId, mainId, mainName, categoryName) => {
    navigate('/subcategory2', {
      state: { categoryId, mainId, mainName, categoryName },
    });
  };

  const handleAllCategoriesPress = () => {
    navigate("/AllCategories");
    onClose();
  };

  const renderSubCategoryItem = (companies, mainId, mainName, categoryName) => (
    <div className="subcategory-container">
      {companies.map(({ id, name }) => (
        <div
          key={id}
          className="subcategory-item"
          onClick={() => navigateToSubCategory(id, mainId, mainName, categoryName)}
        >
          <span className="subcategory-text">{name}</span>
          <span className="chevron-icon"><FaChevronRight /></span> {/* Using FaChevronRight */}
        </div>
      ))}
    </div>
  );

  const renderCategoryItem = (category) => {
    const isExpanded = expandedCategory === category.id;
    return (
      <div key={category.id}>
        <div className="nav-item" onClick={() => toggleCategory(category.id)}>
          <span className="nav-text">{category.name}</span>
          {category.companies && (
            <span className="chevron-icon">
              {isExpanded ? <FaChevronUp /> : <FaChevronDown />} {/* Use FaChevronUp/FaChevronDown */}
            </span>
          )}
        </div>
        {isExpanded && category.companies && renderSubCategoryItem(category.companies, category.id, category.mainName, category.name)}
      </div>
    );
  };

  const handleCallPress = () => {
    const phoneNumber = "9924686611";
    window.open(`tel:${phoneNumber}`);
  };

  return (
    <div className={`left-slider-container ${isOpen ? "open" : ""}`}>
      <div className="left-slider-content">
        <div className="categories-header">
          <span className="categories-header-text">Categories</span>
          
        </div>
        {categories.length > 0 ? (
          <>
            {categories.map((category) => renderCategoryItem(category))}
            <div className="subcategory-item" onClick={handleAllCategoriesPress}>
              <span className="subcategory-text">All Categories</span>
              <span className="chevron-icon"><FaChevronRight /></span> {/* Use FaChevronRight */}
            </div>
          </>
        ) : (
          <span>No categories available</span>
        )}
        <div className="footer-container">
          <div className="footer-button" onClick={handleCallPress}>
            <span className="call-icon">📞</span>
            <span className="footer-text">Customer Support</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftSlider;
