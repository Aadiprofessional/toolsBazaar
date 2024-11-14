import React, { useState, useCallback } from 'react';
import OfferAndPaymentSummary from './OfferAndPaymentSummary';
import './RightSection.css';
import ProductsGrid5 from '../ProductsGrid copy 3';

const RightSection = ({ totalAmount, onPriceChange, onAddressChange, cart, onCouponChange }) => {
  const [coupon, setCoupon] = useState('');
  const [location, setLocation] = useState({ city: '', state: '' });

  const handleCouponChange = (e) => {
    const selectedCoupon = e.target.value;
    setCoupon(selectedCoupon);
    if (onPriceChange) {
      onPriceChange(totalAmount); // Update the price when coupon changes
    }
    if (onCouponChange) {
      // Send the coupon info to the parent (CartScreen)
      onCouponChange({ couponCode: selectedCoupon, discount: 10 }); // Example coupon info with discount
    }
  };

  const handleParentChange = useCallback(({ finalPrice, selectedAddress, couponInfo }) => {
    if (onPriceChange) {
      onPriceChange(finalPrice); // Update the price in CartScreen
    }
    if (onAddressChange) {
      onAddressChange(selectedAddress); // Update the address in CartScreen
    }
    if (couponInfo) {
      onCouponChange(couponInfo); // Pass the coupon info to the parent
    }
  }, [onPriceChange, onAddressChange, onCouponChange]);

  return (
    <div className="right-sectionCart">
      <OfferAndPaymentSummary
        cart={cart}
        totalAmount={totalAmount}
        onUpdateParent={handleParentChange} // Pass the handler to OfferAndPaymentSummary
      />
      <p className="frequently-bought2">Featured Products</p>
      <div className="products-grid6">
        <ProductsGrid5 />
      </div>

    </div>
  );
};

export default RightSection;

