import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import TaskBar from '../components/TaskBar';
import Banner from '../components/AllCategories/Banner';
import CategoriesNavigation from '../components/AllCategories/CategoriesNavigation';
import CategoriesGrid from '../components/AllCategories/CategoriesGrid';
import Footer from '../components/Footer';
import './AllCategories.css'; // Import CSS file for styling

function AllCategories() {
  const navigate = useNavigate(); // Initialize navigate function

  const handleNavigateToSubCategory = (mainId) => {
    navigate(`/subcategories/${mainId}`); // Adjust the path as necessary
  };

  return (
    <div className="page-container">
      <TaskBar />
      <div className="contentAll">
        <Banner />

        <CategoriesGrid navigateToSubCategory={handleNavigateToSubCategory} />
      </div>
      <Footer />
    </div>
  );
}

export default AllCategories;
