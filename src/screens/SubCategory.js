import React from 'react';
import TaskBar from '../components/TaskBar';
import Banner from '../components/AllCategories/Banner';
import CategoriesNavigation from '../components/AllCategories/CategoriesNavigation';

import Footer from '../components/Footer';
import './AllCategories.css'; // Import CSS file for styling
import CategoriesGrid2 from '../components/AllCategories/CategoriesGrid2';

function SubCategory() {
  return (
    <div className="page-container">
      <TaskBar />
      <div className="contentAll">
        <Banner />
       
        <CategoriesGrid2 />
      </div>
      <Footer />
    </div>
  );
}

export default SubCategory;
