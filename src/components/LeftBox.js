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
        setLoading(false);
      }
    };

    fetchAndCacheData();
  }, []);

  const navigateToAllCategories = () => {
    navigate("/AllCategories");
  };

  const handleSubcategoryClick = (categoryId, mainId, mainName, categoryName) => {
    navigate('/subcategory2', {
      state: { categoryId, mainId, mainName, categoryName, selectedBrand, selectedPriceRange }
    });
  };

  const handleBrandSelect = (brand) => {
    setSelectedBrand(brand);
    // Navigate to the same screen with brand filter applied
    navigate('/subcategory2', { state: { selectedBrand: brand, selectedPriceRange } });
  };

  const handlePriceSelect = (priceRange) => {
    setSelectedPriceRange(priceRange);
    // Navigate to the same screen with price range filter applied
    navigate('/subcategory2', { state: { selectedBrand, selectedPriceRange: priceRange } });
  };

  return (
    <div style={styles.leftBox}>
      <ul style={styles.categoryList}>
        {loading ? (
          Array.from({ length: 2 }).map((_, index) => (
            <Skeleton active title={{ width: '80%' }} paragraph={{ rows: 1 }} />
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
                        onClick={() => handleSubcategoryClick(company.id, category.id, category.name, company.name)}
                      >
                        {company.name}

                        {hoveredSubcategory === subIndex && (
                          <div style={styles.filterBox}>
                            <div style={styles.filterRow}>
                              <div style={styles.filterColumn}>
                                <div
                                  style={styles.filterItem}

                                >
                                  Shop by Brand:
                                </div>

                                <div
                                  style={styles.filterData}
                                  onClick={() => handleBrandSelect(company.brands[0])}
                                >
                                  {company.brands.join(", ")}
                                </div>
                              </div>
                              <div style={styles.filterColumn}>
                                <div
                                  style={styles.filterItem}

                                >
                                  Shop by Price:
                                </div>

                                <div
                                  style={styles.filterData}
                                  onClick={() => handlePriceSelect('0-10000')}
                                >
                                  0-10000
                                </div>

                                <div
                                  style={styles.filterData}
                                  onClick={() => handlePriceSelect('10000-20000')}
                                >
                                  10000-20000
                                </div>
                                <div
                                  style={styles.filterData}
                                  onClick={() => handlePriceSelect('20000-30000')}
                                >
                                  20000-30000
                                </div>


                                <div
                                  style={styles.filterData}
                                  onClick={() => handlePriceSelect('30000-40000')}
                                >
                                  30000-40000
                                </div>
                                <div
                                  style={styles.filterData}
                                  onClick={() => handlePriceSelect('40000-50000')}
                                >
                                  40000-50000
                                </div>


                                <div
                                  style={styles.filterData}
                                  onClick={() => handlePriceSelect('50000-60000')}
                                >
                                  50000-60000
                                </div>
                                <div
                                  style={styles.filterData}
                                  onClick={() => handlePriceSelect('60000-70000')}
                                >
                                  60000-70000
                                </div>
                                <div
                                  style={styles.filterData}
                                  onClick={() => handlePriceSelect('70000-80000')}
                                >
                                  70000-80000
                                </div><div
                                  style={styles.filterData}
                                  onClick={() => handlePriceSelect('80000-90000')}
                                >
                                  80000-90000
                                </div><div
                                  style={styles.filterData}
                                  onClick={() => handlePriceSelect('90000-100000')}
                                >
                                  90000-100000
                                </div>
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
  },
  filterData: {
    padding: "5px 0",
    cursor: "pointer",
    color: "#535353FF",
    fontWeight: "regular",
  },
  seeAllCategories: {
    padding: "10px",
    color: "#0193E6",
    fontSize: "14px",
    cursor: "pointer",
    textAlign: "center",
    borderTop: "1px solid #ccc",
    marginTop: "10px",
  },
};

export default LeftBox;
