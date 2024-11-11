import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import './CategoriesGrid.css';
import ProductCard from '../ProductCard';

function CategoriesGrid3({ mainId, categoryId, mainName, categoryName, selectedBrand, selectedPriceRange }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
        
        const validProducts = response.data.filter(product => product !== null);
        
        const filteredProducts = validProducts.filter((product) => {
          // Filter by selected brand if provided
          const matchesBrand = selectedBrand ? product.brand === selectedBrand : true;

          // Filter by price range if provided
          const matchesPriceRange = selectedPriceRange ? (() => {
            const [minPrice, maxPrice] = selectedPriceRange.split('-').map(Number);
            return product.price >= minPrice && product.price <= maxPrice;
          })() : true;

          return matchesBrand && matchesPriceRange;
        });

        setProducts(
          filteredProducts.map((product) => ({
            id: product.productId,
            name: product.displayName,
            description: `This is ${product.displayName} description.`,
            price: product.price,
            image: product.mainImage,
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
      fetchProducts();
    }
  }, [mainId, categoryId, selectedBrand, selectedPriceRange]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="products-containerGrid3">
      {products.length > 0 ? (
        products.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))
      ) : (
        <div>No products available</div>
      )}
    </div>
  );
}

export default CategoriesGrid3;
