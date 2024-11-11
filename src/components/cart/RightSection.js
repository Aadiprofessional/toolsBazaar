import React, { useState, useCallback } from 'react';
import OfferAndPaymentSummary from './OfferAndPaymentSummary';
import './RightSection.css';

const RightSection = ({ totalAmount, onPriceChange, onAddressChange }) => {
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
        totalAmount={totalAmount}
        onUpdateParent={handleParentChange} // Pass the handler to OfferAndPaymentSummary
      />
    </div>
  );
};

export default RightSection;
