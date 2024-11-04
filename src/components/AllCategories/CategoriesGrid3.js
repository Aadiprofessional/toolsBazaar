import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CategoriesGrid.css'; // Ensure this file is linked for additional styles
import ProductCard from '../ProductCard';

function CategoriesGrid3({ mainId, categoryId }) { // Receive props
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
console.log(mainId , categoryId);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.post(
          `https://toolsbazaar-server-1036279390366.asia-south1.run.app/products`,
          {
            main: mainId,
            category: categoryId,
          }
        );
        console.log('Fetched products:', response.data);
        setProducts(
          response.data.map((product) => ({
            id: product.productId,
            name: product.displayName,
            description: `This is ${product.displayName} description.`,
            price: product.price,
            image: product.mainImage, // Corrected to use mainImage from response
            categoryId: product.categoryId,
            mainId: product.mainId,
            productId: product.productId,
            additionalDiscount: product.additionalDiscount,
          }))
        );
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products: ', error);
        setLoading(false);
      }
    };

    if (mainId && categoryId) {
      fetchProducts(); // Fetch products only if mainId and categoryId are available
    }
  }, [mainId, categoryId]);

  if (loading) {
    return <div>Loading...</div>; // Display loading state
  }

  return (
    <div className="products-container">
      {products.length > 0 ? (
        products.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))
      ) : (
        <div>No products available</div> // Display when no products are found
      )}
    </div>
  );
}

export default CategoriesGrid3;
