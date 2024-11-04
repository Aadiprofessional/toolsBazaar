import React, { useState } from 'react';
import PaymentSummary from './PaymentSummary';
import PartnersOffers from './PartnersOffers';
import OfferAvailable from './OfferAvailable';
import './RightSection.css'; // Import the CSS file

const RightSection = ({ totalAmount }) => {
  const [pincode, setPincode] = useState('');
  const [coupon, setCoupon] = useState('');
  const [location, setLocation] = useState({ city: '', state: '' });
  const [selectedAddress, setSelectedAddress] = useState(null); // New state for the selected address

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

  const handleAddressSelect = (address) => {
    setSelectedAddress(address); // Set the selected address from PartnersOffers
  };

  return (
    <div className="right-sectionCart">
      <PaymentSummary
        totalAmount={totalAmount}
        location={location}
        pincode={pincode}
        handlePincodeChange={handlePincodeChange}
        selectedAddress={selectedAddress} // Pass the selected address to PaymentSummary
      />
      <PartnersOffers
        totalAmount={totalAmount}
        onAddressSelect={handleAddressSelect} // Pass the callback to get the selected address
      />
      <OfferAvailable
        totalAmount={totalAmount}
        coupon={coupon}
        handleCouponChange={handleCouponChange}
      />
    </div>
  );
};

export default RightSection;
