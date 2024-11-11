import React from 'react';
import TaskBar from '../components/TaskBar';
import Banner from '../components/AllCategories/Banner';
import CategoriesNavigation from '../components/AllCategories/CategoriesNavigation';
import Footer from '../components/Footer';
import { useLocation } from 'react-router-dom'; // Import useLocation to get passed state
import './AllCategories.css'; // Import CSS file for styling

import CategoriesGrid3 from '../components/AllCategories/CategoriesGrid3';

function SubCategory2() {
  const location = useLocation(); // Get the state from the route
  const { mainId, categoryId, mainName, categoryName,selectedBrand,selectedPriceRange } = location.state || {}; // Extract mainId and categoryId
console.log(mainName,selectedBrand,selectedPriceRange);

  return (
    <div className="page-container">
      <TaskBar />
      <div className="contentAll">
        <Banner />
        <div className="breadcrumb">
          <p>
            <span className="home-link">Home</span> &gt; All Categories &gt; {mainName} &gt; <span className="category-name">{categoryName}</span>
          </p>
        </div>

        {/* Pass mainId and categoryId as props to CategoriesGrid3 */}
        <CategoriesGrid3 mainId={mainId} categoryId={categoryId}  mainName={mainName} selectedBrand ={selectedBrand} selectedPriceRange={selectedPriceRange} />
      </div>
      <Footer />
    </div>
  );
}

export default SubCategory2;
