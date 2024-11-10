import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { Skeleton, Card } from 'antd';
import './ProductsGrid2.css';

const ProductsGrid5 = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cachedProducts = localStorage.getItem("cachedFre");

    if (cachedProducts) {
      // Load products from cache
      setProducts(JSON.parse(cachedProducts));
      setLoading(false);
    } else {
      // Fetch products if not in cache
      const fetchProducts = async () => {
        try {
          const response = await fetch(
            "https://toolsbazaar-server-1036279390366.asia-south1.run.app/bestDeals"
          );
          const data = await response.json();
          const formattedProducts = data.map((product) => ({
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
          }));
          setProducts(formattedProducts);
          // Save the fetched products to local storage
          localStorage.setItem("cachedProductslatest", JSON.stringify(formattedProducts));
        } catch (error) {
          console.error("Error fetching products:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchProducts();
    }

    // Add event listener to clear cache on page reload or close
    const clearCacheOnReload = () => {
      localStorage.removeItem("cachedProductslatest");
    };
    window.addEventListener("beforeunload", clearCacheOnReload);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("beforeunload", clearCacheOnReload);
    };
  }, []);

  const renderSkeletonCard = () => (
    <Card style={{ width: 210, margin: '1px' }}>
      <Skeleton.Image style={{ width: 170, height: 150 }} />
      <Skeleton active title={{ width: '60%' }} paragraph={{ rows: 2 }} />
    </Card>
  );


  return (
    <div className="products-containerGrid5">
      {loading
        ? Array(5).fill(null).map((_, index) => renderSkeletonCard()) // Show skeletons while loading
        : products.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
    </div>
  );
};

export default ProductsGrid5;
