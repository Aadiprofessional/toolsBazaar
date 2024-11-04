import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { Skeleton, Card } from 'antd';

const ProductsGrid2 = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://toolsbazaar-server-1036279390366.asia-south1.run.app/bestDeals"
        );
        const data = await response.json();
        setProducts(
          data.map((product) => ({
            id: product.productId,
            name: product.displayName,
            description: `This is ${product.displayName} description.`,
            price: product.price,
            attribute1: product.attribute1,
            attribute2: product.attribute2,
            attribute3: product.attribute3,
            attribute1Id: product.attribute1Id,
            attribute2Id: product.attribute2Id,
            attribute3Id: product.attribute3Id,
            image: product.image,
            categoryId: product.categoryId,
            mainId: product.mainId,
            productId: product.productId,
            category: product.category,
            main: product.main,
            product: product.product,
            additionalDiscount: product.additionalDiscount,
          }))
        );
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchProducts();
  }, []);

  const renderSkeletonCard = () => (
    <Card style={{ width: 240, margin: '10px' }}>
      <Skeleton.Image style={{ width: 200, height: 150 }} />
      <Skeleton active title={{ width: '60%' }} paragraph={{ rows: 2 }} />
    </Card>
  );

  return (
    <div style={styles.container}>
      {loading
        ? Array(6).fill(null).map((_, index) => renderSkeletonCard()) // Show 6 skeleton cards while loading
        : products.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px", // Space between the product cards
    justifyContent: "flex-start", // Aligns items to start from the left
    padding: "20px", // Padding around the container
  },
  productCard: {
    flex: "1 1 calc(33.33% - 10px)", // 3 cards per row by default
    boxSizing: "border-box",
    maxWidth: "calc(33.33% - 10px)", // Adjust width
    margin: "10px",
  },
  '@media (max-width: 768px)': {
    productCard: {
      flex: "1 1 calc(50% - 10px)", // 2 cards per row for screens <= 768px
      maxWidth: "calc(50% - 10px)",
    }
  },
  '@media (max-width: 480px)': {
    productCard: {
      flex: "1 1 100%", // 1 card per row for smaller screens
      maxWidth: "100%",
    }
  }
};

export default ProductsGrid2;
