import React, { useState, useEffect, useRef } from "react";
import TaskBar from "../components/TaskBar";
import ImageSlider from "../components/ImageSlider";
import Banner from "../components/Banner";
import Sidebar from "../components/Sidebar";
import Banner2 from "../components/Banner2";
import Banner3 from "../components/Banner3";
import ProductSection from "../components/ProductSection";
import Footer from "../components/Footer";
import LeftBox from "../components/LeftBox"; // Import LeftBox
import "./landingPage.css"; // Import the CSS file
import ImageLayout from "../components/ImageSlider";

const LandingPage = ({ onSearch }) => {
  const [isLeftBoxVisible, setIsLeftBoxVisible] = useState(true);
  const leftBoxRef = useRef(null);
  const footerRef = useRef(null);

  // Function to check the screen size and hide LeftBox if on mobile
  const checkScreenSize = () => {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 768) {
      setIsLeftBoxVisible(false);
    } else {
      setIsLeftBoxVisible(true);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (leftBoxRef.current && footerRef.current) {
        const leftBoxBottom = leftBoxRef.current.getBoundingClientRect().bottom;
        const footerTop = footerRef.current.getBoundingClientRect().top;

        if (leftBoxBottom >= footerTop) {
          setIsLeftBoxVisible(false);
        } else {
          checkScreenSize(); // Check the screen size and adjust visibility
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", checkScreenSize); // Add resize listener to handle screen size changes

    // Initial check for screen size when component mounts
    checkScreenSize();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  return (
    <div>
      <TaskBar onSearch={onSearch} />
      <div className="pageContainer2">
        {isLeftBoxVisible && <LeftBox ref={leftBoxRef} />} {/* Add LeftBox component here */}
        <div className="pageContainer">
          <ImageLayout />
          <div className="bannerSidebarContainer">
            <Banner />
            <Sidebar />
          </div>
          <div className="bannerContainer">
            <Banner2 />
          </div>
          <div className="bannerContainer">
            <Banner3 />
          </div>
        </div>
      </div>
      <Footer ref={footerRef} />
    </div>
  );
};

export default LandingPage;