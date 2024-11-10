import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import TaskBar from "../components/TaskBar";
import Footer from "../components/Footer";
import axios from "axios";
import LeftMiddleSection from "../components/prodectDetail/LeftMiddleSection";
import RightSection from "../components/prodectDetail/RightSection";
import Lottie from "lottie-react";

import loadingAnimation from "../assets/Animation - 1730717782675.json"; 
import { ToastContainer } from "react-toastify";

const ProductDetail = () => {
  const location = useLocation();
  const productState = location.state?.product;
  const main = productState?.main; // Access `main` from state
  const category = productState?.category; // Access `main` from state
  const productName = productState?.product; // Access `main` from state
  // Other parameters (if they aren't part of `useParams`)
  const mainId = productState?.mainId;
  const categoryId = productState?.categoryId;
  const productId = productState?.productId;
  const attribute1D = productState?.attribute1ID;
  const attribute2D = productState?.attribute2ID;
  const attribute3D = productState?.attribute3ID;
  const [product, setProduct] = useState(null);
  const [selectedAttribute1, setSelectedAttribute1] = useState(null);
  const [selectedAttribute2, setSelectedAttribute2] = useState(null);
  const [selectedAttribute3, setSelectedAttribute3] = useState(null);



  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProduct = async () => {
      console.log("Product ID:", productId);

      try {
        const response = await axios.post(
          "https://toolsbazaar-server-1036279390366.asia-south1.run.app/productInfo",
          {
            main: mainId,
            category: categoryId,
            product: productId,
          }
        );
        const data = response.data;
        setProduct(data);
        console.log('Data',data);
        
        // Extract initial selected attributes
        const attribute1 = data.attribute1;
        const attribute2 = data.attribute2;
        const attribute3Data =
          data.data[attribute1]?.[Object.keys(data.data[attribute1])[0]]?.[
            attribute2
          ];
        const firstKey = attribute3Data ? Object.keys(attribute3Data)[0] : null;
        const selectedAttribute = firstKey ? attribute3Data[firstKey] : null;

        setSelectedAttribute1(Object.keys(data.data[attribute1])[0]);
        setSelectedAttribute2(Object.keys(attribute3Data)[0]);
        setSelectedAttribute3(
          selectedAttribute ? Object.keys(selectedAttribute)[0] : null
        );
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchProduct();
  }, [mainId, categoryId, productId]);

  if (!product) {
    return (
      <div style={styles.loadingContainer}>
        <Lottie animationData={loadingAnimation} loop={true} />
      </div>
    );
  }
  // Find the current product based on selected attributes
  const selectedData =
    product.data?.[product.attribute1]?.[selectedAttribute1]?.[
      product.attribute2
    ]?.[selectedAttribute2]?.[selectedAttribute3] || {};


  return (
    <div>
      <ToastContainer/>
      <div style={styles.pageContainer}>
        <TaskBar />
        <div style={styles.contentContainer}>
          <LeftMiddleSection
            product={product}
            selectedAttribute1={selectedAttribute1}
            setSelectedAttribute1={setSelectedAttribute1}
            selectedAttribute2={selectedAttribute2}
            setSelectedAttribute2={setSelectedAttribute2}
            selectedAttribute3={selectedAttribute3}
            setSelectedAttribute3={setSelectedAttribute3}
            product1={selectedData}
            attribute1D={attribute1D}
            main={main}
            productName={productName}
            category={category}
            attribute2D={attribute2D}
            attribute3D={attribute3D}
          />
          <RightSection
            product={selectedData}
            productName={product.productName}
            attribute1={product.attribute1}
            attribute2={product.attribute2}
            attribute3={product.attribute3}
            mainId={mainId}
            categoryId={categoryId}
            productId={productId}
            selectedAttribute1={selectedAttribute1}
            selectedAttribute2={selectedAttribute2}
            selectedAttribute3={selectedAttribute3}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

const styles = {
  pageContainer: {
    backgroundColor: "#F0F0F0",
    minHeight: "100vh",
  },
  contentContainer: {
    display: "flex",
    justifyContent: "space-between",
    padding: "20px",
  },
    loadingContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: "#ffffff",
    },
};

export default ProductDetail;
