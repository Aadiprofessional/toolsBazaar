import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import './ProductsGrid2.css'; // Import the CSS file

const ProductsGrid2 = () => {
  const [products, setProducts] = useState([]);

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
            image: product.image,
            categoryId: product.categoryId,
            mainId: product.mainId,
            productId: product.productId,
            attribute1Id: product.attribute1Id,
            attribute2Id: product.attribute2Id,
            attribute3Id: product.attribute3Id,
            category: product.category,
            main: product.main,
            product: product.product,
            additionalDiscount: product.additionalDiscount,
          }))
        );
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="products-container">
      {products.map((product) => (
        <ProductCard product={product} key={product.id} />
      ))}
    </div>
  );
};

export default ProductsGrid2;
