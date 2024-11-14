import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, Skeleton } from 'antd';

const LeftBox = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [hoveredSubcategory, setHoveredSubcategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true; // Prevent setting state on unmounted component
    const fetchData = async () => {

      try {
        const response = await axios.get('https://toolsbazaar-server-1036279390366.asia-south1.run.app/drawer');
        setCategories(response.data);
      
        setLoading(false);
      
      
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();

    return () => {
      
      isMounted = false; // Cleanup on unmount
    };
  }, []); // Fetch only once

  const navigateToAllCategories = () => {
    navigate("/AllCategories");
  };

  const handleSubcategoryClick = (categoryId, mainId, mainName, categoryName) => {
    navigate('/subcategory2', {
      state: { categoryId, mainId, mainName, categoryName, selectedBrand, selectedPriceRange }
    });
  };

  const handleBrandSelect = (brand , categoryId, mainId, mainName, categoryName) => {
    setSelectedBrand(brand);
    navigate('/subcategory2', { state: { selectedBrand: brand,categoryId, mainId, mainName, categoryName, } });
  };

  const handlePriceSelect = (priceRange,categoryId, mainId, mainName, categoryName,) => {
    setSelectedPriceRange(priceRange);
    navigate('/subcategory2', { state: {selectedPriceRange: priceRange ,categoryId, mainId, mainName, categoryName,} });
  };

  return (
    <div style={styles.leftBox}>
      <ul style={styles.categoryList}>
        {loading ? (
          Array.from({ length: 2 }).map((_, index) => (
            <Skeleton active title={{ width: '80%' }} paragraph={{ rows: 1 }} key={index} />
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
              <div
                style={styles.categoryName}
                onClick={() => handleSubcategoryClick(category.id, category.id, category.name, category.name)}
              >
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
                      >
                        <span onClick={() => handleSubcategoryClick(company.id, category.id, category.name, company.name)}>
                          {company.name}
                        </span>

                        {hoveredSubcategory === subIndex && (
                          <div style={styles.filterBox}>
                            <div style={styles.filterRow}>
                              <div style={styles.filterColumn}>
                                <div style={styles.filterItem}>
                                  Shop by Brand:
                                </div>

                                {company.brands.map((brand, brandIndex) => (
                                  <div
                                    key={brandIndex}
                                    style={styles.filterData}
                                    onClick={() => handleBrandSelect(brand ,company.id, category.id, category.name, company.name)}
                                  >
                                    {brand}
                                  </div>
                                ))}
                              </div>
                              <div style={styles.filterColumn}>
                                <div style={styles.filterItem}>
                                  Shop by Price:
                                </div>

                                {["0-10000", "10000-20000", "20000-30000", "30000-40000", "40000-50000", "50000-60000", "60000-70000", "70000-80000", "80000-90000", "90000-100000"].map((range, rangeIndex) => (
                                  <div
                                    key={rangeIndex}
                                    style={styles.filterData}
                                    onClick={() => handlePriceSelect(range,company.id, category.id, category.name, company.name)}
                                  >
                                    {range}
                                  </div>
                                ))}
                              </div>
                            </div>
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
    height: "max-content",
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
    padding: "10px",
    borderBottom: "1px solid #eee",
    position: "relative",
    cursor: "pointer",
    display: "flex",
    marginLeft: "-40px",
  },
  categoryName: {
    fontSize: "14px",
    fontWeight: "bold",
    fontFamily: "'Outfit', sans-serif", 
    display: "flex",
    alignItems: "center",
  },
  subcategoryBox: {
    position: "absolute",
    top: 0,
    left: "100%",
    width: "250px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    zIndex: 101,
  },
  subcategoryList: {
    listStyleType: "none",
    padding: 0,
    margin: 0,
  },
  subcategoryItem: {
    padding: "10px",
    borderBottom: "1px solid #eee",
    cursor: "pointer",
    position: "relative",
    display: "flex",
  },
  filterBox: {
    position: "absolute",
    top: 0,
    left: "100%",
    width: "250px",
    padding: "10px",
    backgroundColor: "#f9f9f9",
    borderLeft: "1px solid #ddd",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    zIndex: 102,
  },
  filterRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },
  filterItem: {
    padding: "5px 0",
    cursor: "pointer",
    color: "#E9611E",
    fontWeight: "medium",
    fontFamily: "'Outfit', sans-serif", 
    marginRight:'10px',
  },
  filterData: {
    padding: "5px 0",
    cursor: "pointer",
    color: "#535353FF",
    fontWeight: "regular",
    fontFamily: "'Outfit', sans-serif", 
  },
  seeAllCategories: {
    padding: "10px",
    color: "#0193E6",
    fontSize: "14px",
    fontFamily: "'Outfit', sans-serif", 
    cursor: "pointer",
    textAlign: "center",
    borderTop: "1px solid #ccc",
    marginTop: "10px",
  },
};

export default LeftBox;
