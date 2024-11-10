import React, { useState, useEffect } from "react";
import { Skeleton } from 'antd';
import MiddleSection from "./MiddleSection";
import bannerImage from "../../assets/bottom2.png";
import './LeftMiddle.css';
import RightSection from "./RightSection";
import { useParams } from "react-router-dom";
import ProductsGrid2 from "../ProductsGrid";
import ProductsGrid5 from "../ProductsGrid copy 3";

const LeftMiddleSection = ({
  product,
  selectedAttribute1,
  setSelectedAttribute1,
  selectedAttribute2,
  setSelectedAttribute2,
  selectedAttribute3,
  setSelectedAttribute3,
  attribute1D,
  attribute2D,
  attribute3D,
  main,
  category,
  productName,
  product1
}) => {
  const { mainId, categoryId, productId } = useParams();
  
  const selectedData = product?.data?.[product.attribute1]?.[selectedAttribute1]?.[product.attribute2]?.[selectedAttribute2]?.[selectedAttribute3] || {};
  const price = selectedData?.price || 'Not available';
  const description = selectedData?.description || 'No description available';
  const specifications = selectedData?.specifications || [{ label: 'No specifications available', value: '' }];
  const images = selectedData?.images || [];

  const [selectedImage, setSelectedImage] = useState(images.length > 0 ? images[0] : null);
  const [activeTab, setActiveTab] = useState("description");
  const [loading, setLoading] = useState(true);
  const [visibleImages, setVisibleImages] = useState(0); // Starting index of visible images

  // Reset to first image on attribute change
  useEffect(() => {
    setSelectedImage(images[0]);
    setVisibleImages(0);
  }, [selectedAttribute1, selectedAttribute2, selectedAttribute3, images]);

  // Simulate loading time for images (Remove this in production)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Handle navigation for thumbnail carousel
  const handleNextImages = () => {
    if (visibleImages + 4 < images.length) {
      setVisibleImages((prev) => prev + 4);
    }
  };

  const handlePrevImages = () => {
    if (visibleImages > 0) {
      setVisibleImages((prev) => prev - 4);
    }
  };

  // Handle image selection when clicking on a thumbnail
  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  return (
    <div className="containerProduct">
      <div className="breadcrumb">
        <p>
          <span className="home-link">Home</span> &gt; {main} &gt; {category} &gt; {product.productName}
        </p>
      </div>
      <div className="contentProduct">
        <div className="left-sectionProduct">
          {loading ? (
            <Skeleton.Image active style={{ width: '400px', height: '500px' }} />
          ) : selectedImage ? (
            <img src={selectedImage} alt={product.productName} className="product-image" />
          ) : (
            <p>No image available</p>
          )}

          {/* Image thumbnail carousel */}
          <div className="image-options-carousel">
            {visibleImages > 0 && (
              <button className="carousel-arrow.left" onClick={handlePrevImages}>{"<"}</button>
            )}
            <div className="image-optionsC">
              {images.slice(visibleImages, visibleImages + 4).map((image, index) => (
                <div
                  key={index}
                  className="image-option-containerC"
                  style={{ borderColor: selectedImage === image ? "#DB3F1F" : "#68686847" }}
                  onClick={() => handleImageClick(image)}
                >
                  <img src={image} alt={`Option ${index + 1}`} className="image-option" />
                </div>
              ))}
            </div>
            {visibleImages + 4 < images.length && (
              <button className="carousel-arrow.right" onClick={handleNextImages}>{">"}</button>
            )}
          </div>
        </div>

        {/* Middle Section */}
        <MiddleSection 
          product={product} 
          selectedAttribute1={selectedAttribute1} 
          selectedAttribute2={selectedAttribute2}
          selectedAttribute3={selectedAttribute3}
          setSelectedAttribute1={setSelectedAttribute1}
          setSelectedAttribute2={setSelectedAttribute2}
          setSelectedAttribute3={setSelectedAttribute3}
          mainId={mainId}
          categoryId={categoryId}
          productId={productId}
          productName={product.productName}
          attribute1D={attribute1D}
          attribute2D={attribute2D}
          attribute3D={attribute3D}
          product1={product1}
        />

        {/* Right Section */}
        <RightSection price={price} />
      </div>

      {/* Banner */}
      <img src={bannerImage} alt="Banner" className="banner-image" />

      {/* Description and Specifications Section */}
      <div className="description-wrapper">
        <div className="button-container">
          <button
            className="tab-button"
            style={{ backgroundColor: activeTab === "description" ? "#FF5733" : "#ddd", color: activeTab === "description" ? "#fff" : "#046699" }}
            onClick={() => setActiveTab("description")}
          >
            DESCRIPTION
          </button>
          <button
            className="tab-button"
            style={{ backgroundColor: activeTab === "specification" ? "#FF5733" : "#ddd", color: activeTab === "specification" ? "#fff" : "#046699" }}
            onClick={() => setActiveTab("specification")}
          >
            SPECIFICATION
          </button>
        </div>
        <div className="description-box">
          {activeTab === "description" && <p>{description}</p>}
          {activeTab === "specification" && (
            <table className="specification-table">
              <tbody>
                {specifications.map((spec, index) => (
                  <tr key={index} className={index % 2 === 0 ? "even-row" : "odd-row"}>
                    <td className="specification-label">{spec.label}</td>
                    <td className="specification-value">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Frequently Bought Together Section */}
      <p className="frequently-bought">Frequently bought together</p>
      <div className="mt-2">
        <ProductsGrid5 />
      </div>
    </div>
  );
};

export default LeftMiddleSection;
