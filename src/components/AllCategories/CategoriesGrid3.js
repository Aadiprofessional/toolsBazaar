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
          const matchesBrand = selectedBrand ? product.brands.includes(selectedBrand) : true;

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
            description: product.description,
            price: product.price,
            attribute1Name: product.attribute1Name,
            attribute2Name: product.attribute2Name,
            attribute3Name: product.attribute3Name,
            rating : product.rating,
            ratings: product.ratings,
            attribute1Id: product.attribute1Id,
            attribute2Id: product.attribute2Id,
            attribute3Id: product.attribute3Id,
            minCartValue : product.minCartValue,
            image:product.image,
            gst: product.gst,
            attribute1 : product.attribute1,
            attribute2 : product.attribute2,
            attribute3 : product.attribute3,
            images: product.images,
            categoryId: product.categoryId,
            mainId: product.mainId,
            productId: product.productId,
            category: product.category,
            main: product.main,
            product: product.product,
            additionalDiscount: product.additionalDiscount,
            brand : product.brands,
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
        <div>No products available of the selected filter</div>
      )}
    </div>
  );
}

export default CategoriesGrid3;
