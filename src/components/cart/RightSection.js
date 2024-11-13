import React, { useState, useCallback } from 'react';
import OfferAndPaymentSummary from './OfferAndPaymentSummary';
import './RightSection.css';
import ProductsGrid5 from '../ProductsGrid copy 3';

const RightSection = ({ totalAmount, onPriceChange, onAddressChange, cart }) => {
  const [pincode, setPincode] = useState('');
  const [coupon, setCoupon] = useState('');
  const [location, setLocation] = useState({ city: '', state: '' });
  const [selectedAddress, setSelectedAddress] = useState(null);

  const handlePincodeChange = (e) => {
    const newPincode = e.target.value;
    setPincode(newPincode);
    if (newPincode.length === 6) {
      setLocation({
        city: 'Sample City',
        state: 'Sample State',
      });
    }
  };
  console.log(cart);

  const handleCouponChange = (e) => setCoupon(e.target.value);

  // Define handleParentChange to pass price and address to CartScreen
  const handleParentChange = useCallback(({ finalPrice, selectedAddress }) => {
    if (onPriceChange) {
      onPriceChange(finalPrice); // Update the price in CartScreen
    }
    if (onAddressChange) {
      onAddressChange(selectedAddress); // Update the address in CartScreen
    }
  }, [onPriceChange, onAddressChange]);

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
