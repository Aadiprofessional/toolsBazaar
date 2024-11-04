import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton'; // Import skeleton loader

const LeftBox = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [hoveredSubcategory, setHoveredSubcategory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAndCacheData = async () => {
      try {
        const response = await axios.get(
          'https://toolsbazaar-server-1036279390366.asia-south1.run.app/drawer',
        );
        if (response.data && Array.isArray(response.data)) {
          setCategories(response.data);
        } else {
          console.error('Unexpected API response format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false); // Set loading to false after data fetch
      }
    };

    fetchAndCacheData();
  }, []);

  const navigateToAllCategories = () => {
    navigate("/AllCategories");
  };

  const handleSubcategoryClick = (categoryId, mainId) => {
    navigate('/subcategory2', {
      state: { categoryId, mainId }
    });
  };

  return (
    <div style={styles.leftBox}>
      <ul style={styles.categoryList}>
        {loading ? (
          // Show skeleton loaders while data is loading
          Array.from({ length: 5 }).map((_, index) => (
            <li key={index} style={styles.categoryItem}>
              <Skeleton height={20} width="70%" style={{ marginBottom: "10px" }} />
            </li>
          ))
        ) : categories.length > 0 ? (
          categories.map((category, index) => (
            <li
              key={index}
              style={{
                ...styles.categoryItem,
                backgroundColor: hoveredCategory === index ? '#545D61' : '#FFFFFF',
                color: hoveredCategory === index ? '#FFFFFF' : '#000000'
              }}
              onMouseEnter={() => setHoveredCategory(index)}
              onMouseLeave={() => {
                setHoveredCategory(null);
                setHoveredSubcategory(null);
              }}
            >
              <div style={styles.categoryName}>
                {category.name}
              </div>
              {hoveredCategory === index && category.companies && category.companies.length > 0 && (
                <div style={styles.subcategoryBox}>
                  <ul style={styles.subcategoryList}>
                    {category.companies.map((company, subIndex) => (
                      <li
                        key={subIndex}
                        style={{
                          ...styles.subcategoryItem,
                          backgroundColor: hoveredSubcategory === subIndex ? '#FFFFFF' : '#545D61',
                          color: hoveredSubcategory === subIndex ? '#000000' : '#FFFFFF'
                        }}
                        onMouseEnter={() => setHoveredSubcategory(subIndex)}
                        onMouseLeave={() => setHoveredSubcategory(null)}
                        onClick={() => handleSubcategoryClick(company.id, category.id)}
                      >
                        {company.name}

                        {hoveredSubcategory === subIndex && (
                          <div style={styles.filterBox}>
                            <div style={styles.filterItem}>Shop by Brand</div>
                            <div style={styles.filterItem}>Shop by Price</div>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))
        ) : (
          <li>No categories available</li>
        )}
      </ul>

      <div style={styles.seeAllCategories} onClick={navigateToAllCategories}>
        See All Categories
      </div>

    </div>
  );
};
const styles = {
  leftBox: {
    width: "260px",
    height: "30%",
    backgroundColor: "#FFFFFF",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    position: "fixed",
    top: "90px",
    left: "130px",
    zIndex: 100,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  categoryList: {
    listStyleType: "none",
    flexGrow: 1,
  },
  categoryItem: {
    padding: "10px", // Remove padding on the left and right
    borderBottom: "1px solid #eee",
    position: "relative",
    cursor: "pointer",
    display: "flex",
    marginLeft : "-40px",
    
  },
  categoryName: {
    fontSize: "14px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    
  },
  subcategoryBox: {
    position: "absolute",
    top: 0,
    left: "100%",
    width: "250px", // Match width to the category container
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    zIndex: 101,
  },
  subcategoryList: {
    listStyleType: "none",
    padding: 0,
    margin: 0,
  },
  subcategoryItem: {
    padding: "10px", // Same padding as category item
    borderBottom: "1px solid #eee",
    cursor: "pointer",
    position: "relative",
    display: "flex",

  },
  filterBox: {
    position: "absolute",
    top: 0,
    left: "100%",
    width: "150px",
    padding: "10px",
    backgroundColor: "#f9f9f9",
    borderLeft: "1px solid #ddd",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    zIndex: 102,
  },
  filterItem: {
    padding: "5px 0",
    cursor: "pointer",
    color: "#E9611E",
    fontWeight: "medium",
  },
  seeAllCategories: {
    textAlign: "center",
    padding: "10px",
    color: "#007bff",
    cursor: "pointer",
    textDecoration: "underline",
  },
};

export default LeftBox;
