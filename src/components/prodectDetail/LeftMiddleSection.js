import React, { useState, useEffect } from "react";
import { Skeleton } from 'antd'; // Import the Skeleton component
import MiddleSection from "./MiddleSection";
import bannerImage from "../../assets/bottom2.png";
import './LeftMiddle.css';
import RightSection from "./RightSection";
import { useParams } from "react-router-dom";
import ProductsGrid2 from "../ProductsGrid";

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
  


  // Dynamically get the data based on selected attributes
  const selectedData = product?.data?.[product.attribute1]?.[selectedAttribute1]?.[product.attribute2]?.[selectedAttribute2]?.[selectedAttribute3] || {};
  const price = selectedData?.price || 'Not available';
  const description = selectedData?.description || 'No description available';
  const specifications = selectedData?.specifications || [{ label: 'No specifications available', value: '' }];
  const images = selectedData?.images || [];

  // Manage state for the selected image and active tab
  const [selectedImage, setSelectedImage] = useState(images.length > 0 ? images[0] : null);
  const [activeTab, setActiveTab] = useState("description");
  const [loading, setLoading] = useState(true); // Loading state for images


  // Handle image selection when clicking on a thumbnail
  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  // Handle tab switching for Description and Specification views
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Simulate loading time for images (Remove this in production)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // Stop loading after 2 seconds (or set based on your image loading)
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="containerProduct">
      <div className="breadcrumb">
        <p>
          <span className="home-link">Home</span> &gt; {main} &gt; {category} &gt; {product.productName}
        </p>
      </div>
      <div className="contentProduct">
        <div className="left-sectionProduct">
          {/* Main product image with Skeleton loading */}
          {loading ? (
            <Skeleton.Image
              active
              style={{ width: '400px', height: '500px' }} // Set skeleton size same as the image container
            />
          ) : selectedImage ? (
            <img src={selectedImage} alt={product.productName} className="product-image" />
          ) : (
            <p>No image available</p>
          )}
          
          {/* Image thumbnail options */}
          <div className="image-optionsC">
            {images.map((image, index) => (
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
          attribute1D={attribute1D} // Pass attribute IDs
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
            onClick={() => handleTabChange("description")}
          >
            DESCRIPTION
          </button>
          <button
            className="tab-button"
            style={{ backgroundColor: activeTab === "specification" ? "#FF5733" : "#ddd", color: activeTab === "specification" ? "#fff" : "#046699" }}
            onClick={() => handleTabChange("specification")}
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
        <ProductsGrid2 />
      </div>
    </div>
  );
};

export default LeftMiddleSection;
