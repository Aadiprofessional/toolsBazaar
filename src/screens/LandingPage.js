import React, { useState, useEffect, useRef, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import TaskBar from "../components/TaskBar";
import ImageSlider from "../components/ImageSlider";
import Banner from "../components/Banner";
import Sidebar from "../components/Sidebar";
import Banner2 from "../components/Banner2";
import Banner3 from "../components/Banner3";
import ProductSection from "../components/ProductSection";
import Footer from "../components/Footer";
import LeftBox from "../components/LeftBox"; // Import LeftBox directly
import "./landingPage.css";

const LandingPage = ({ onSearch }) => {
  const [isLeftBoxVisible, setIsLeftBoxVisible] = useState(true);
  const leftBoxRef = useRef(null);
  const footerRef = useRef(null);
  const navigate = useNavigate();

  const checkScreenSize = () => {
    const screenWidth = window.innerWidth;
    setIsLeftBoxVisible(screenWidth > 768);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (leftBoxRef.current && footerRef.current) {
        const leftBoxBottom = leftBoxRef.current.getBoundingClientRect().bottom;
        const footerTop = footerRef.current.getBoundingClientRect().top;

        if (leftBoxBottom >= footerTop) {
          setIsLeftBoxVisible(false);
        } else {
          checkScreenSize();
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", checkScreenSize);
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
        {isLeftBoxVisible && <LeftBox ref={leftBoxRef} />}
        <Suspense fallback={<div>Loading page content...</div>}>
          <div className="pageContainer">
            <ImageSlider />
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
        </Suspense>
      </div>
      <Footer ref={footerRef} />
    </div>
  );
};

export default LandingPage;
