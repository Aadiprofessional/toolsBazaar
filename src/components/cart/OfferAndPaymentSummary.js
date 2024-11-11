import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../../firebaseConfig';
import { getAuth } from "firebase/auth"; // Correct import for Firebase auth

const API_BASE_URL = 'https://toolsbazaar-server-1036279390366.asia-south1.run.app';

const OfferAndPaymentSummary = ({ totalAmount, onUpdateParent }) => {
  const [shippingCharges, setShippingCharges] = useState(0);
  const [appliedDiscount, setAppliedDiscount] = useState({ discount: 0 });
  const [totalAdditionalDiscountValue, setTotalAdditionalDiscountValue] = useState(0);
  const [appliedCouponState, setAppliedCouponState] = useState(null);
  const [coupon, setCoupon] = useState('');
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [discountedAmount, setDiscountedAmount] = useState(totalAmount);
  const [unavailableCoupons, setUnavailableCoupons] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({ phoneNumber: '', ownerName: '', address: '' });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const response = await axios.post(`${API_BASE_URL}/getAddress`, { uid: currentUser.uid });
          setCompanies(response.data);
          setSelectedAddress(response.data[0]);
          setSelectedCompanyId(response.data[0]?.id || null);
        }
      } catch (err) {
        console.error('Error fetching companies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
          alert("User not logged in!");
          return;
        }
        const userId = user.uid;
        const response = await axios.get(
          `https://toolsbazaar-server-1036279390366.asia-south1.run.app/coupons/${userId}?amount=${finalPrice}`
        );
        const fetchedCoupons = response.data;

        const filteredAvailableCoupons = fetchedCoupons.filter(
          (coupon) => coupon.min_amount <= totalAmount
        );
        const filteredUnavailableCoupons = fetchedCoupons.filter(
          (coupon) => coupon.min_amount > totalAmount
        );

        setAvailableCoupons(filteredAvailableCoupons);
        setUnavailableCoupons(filteredUnavailableCoupons);
      } catch (error) {
        console.error("Error fetching coupons:", error);
        alert("Failed to fetch coupons. Please try again later.");
      }
    };

    fetchCoupons();
  }, [totalAmount]);

  const handleApplyCoupon = (selectedCoupon) => {
    if (appliedCouponState?.code === selectedCoupon.code) {
      setAppliedCouponState(null);
      setDiscountedAmount(totalAmount);
      setCoupon('');
    } else {
      setAppliedCouponState(selectedCoupon);
      setDiscountedAmount(totalAmount - parseFloat(selectedCoupon.value));
      setCoupon(selectedCoupon.code);
    }
  };

  const calculateGSTTotal = () => (discountedAmount + shippingCharges) * 0.18;
  const finalPrice = totalAmount + shippingCharges - totalAdditionalDiscountValue - parseFloat(appliedCouponState?.value??0);

  useEffect(() => {
    onUpdateParent({ finalPrice, selectedAddress });
  }, [finalPrice, selectedAddress, onUpdateParent]);

  return (
    <div style={styles.box}>
      <h2 style={styles.header}>Payment Summary</h2>
      <div style={styles.summaryBox}>
      <div style={styles.companyCard2}>
        <div style={styles.summaryRow}>
          <p style={styles.summaryLabel}>Item(s) Total:</p>
          <p style={styles.summaryValue}>₹{totalAmount.toFixed(2)}</p>
        </div>
        <div style={styles.summaryRow}>
          <p style={styles.summaryLabel}>Shipping Charges:</p>
          <p style={styles.summaryValue}>₹{shippingCharges.toFixed(2)}</p>
        </div>
        <div style={styles.summaryRow}>
          <p style={styles.summaryLabel}>Additional Discount:</p>
          <p style={styles.summaryValue}>-₹{totalAdditionalDiscountValue.toFixed(2)}</p>
        </div>
        {appliedCouponState && (
          <div style={styles.summaryRow}>
            <p style={styles.summaryLabel}>Coupon Discount:</p>
            <p style={styles.summaryValue}>-₹{appliedCouponState.value}</p>
          </div>
        )}
        <div style={styles.totalRow}>
          <p style={styles.totalLabel}>Total:</p>
          <p style={styles.totalValue}>₹{finalPrice.toFixed(2)}</p>
        </div>
        </div>
      </div>

      <h2 style={styles.header}>Your Addresses</h2>
      <div style={styles.summaryBox}>
        {loading ? <p>Loading...</p> : (
          companies.map(company => (
            <div key={company.id} style={styles.companyCard}>
              <input
                type="radio"
                name="company"
                checked={selectedCompanyId === company.id}
                onChange={() => {
                  setSelectedCompanyId(company.id);
                  setSelectedAddress(company);
                }}
                style={styles.radioButton}
              />
              <div style={styles.companyDetails}>
                <p>{company.owner}</p>
                <p>{company.phoneNumber}</p>
                <p>{company.address}</p>
              </div>
            </div>
          ))
        )}
        <button onClick={() => setShowForm(!showForm)} style={styles.addButton}>
          {showForm ? 'Cancel' : 'Add New Address'}
        </button>
        {showForm && (
          <div style={styles.form}>
            <input
              type="text"
              name="ownerName"
              placeholder="Owner Name"
              value={newAddress.ownerName}
              onChange={(e) => setNewAddress({ ...newAddress, ownerName: e.target.value })}
              style={styles.input}
            />
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              value={newAddress.phoneNumber}
              onChange={(e) => setNewAddress({ ...newAddress, phoneNumber: e.target.value })}
              style={styles.input}
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={newAddress.address}
              onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
              style={styles.input}
            />
            <button onClick={() => {}} style={styles.submitButton}>Submit Address</button>
          </div>
        )}
      </div>

      <h2 style={styles.header}>Offer Available</h2>
      <div style={styles.summaryBox}>
        <input
          type="text"
          placeholder="Enter COUPON code"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
          style={styles.input}
        />
        <button style={styles.applyButton} onClick={() => handleApplyCoupon(availableCoupons.find(c => c.code === coupon))}>
          {appliedCouponState ? 'Remove' : 'Apply'}
        </button>
        <div style={styles.couponSection}>
          {availableCoupons.map((availableCoupon, index) => (
            <div key={index} style={styles.couponLine}>
              <p>{availableCoupon.code}</p>
              <p>{availableCoupon.description}</p>
              <button style={styles.applyButton} onClick={() => handleApplyCoupon(availableCoupon)}>
                {appliedCouponState?.code === availableCoupon.code ? 'Remove' : 'Apply'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  box: {
    background: '#f9f9f9',

    borderRadius: '8px',
    margin: '10px',
  },
  header: {
    fontSize: '24px',
    fontWeight: 'bold',
    backgroundColor: '#4D4D4D',
    color: '#fff',
    padding: '10px',
    marginBottom: '10px',
  },
  summaryBox: {
    marginBottom: '20px',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '5px 0',
  },
  summaryLabel: {
    fontSize: '16px',
  },
  summaryValue: {
    fontSize: '16px',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px',
  },
  totalLabel: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '10px',
    margin: '5px 0',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  applyButton: {
    backgroundColor: '#E9611E',
    color: '#fff',
    padding: '10px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    margin: '5px 0',
  },
  addButton: {
    backgroundColor: '#E9611E',
    color: '#fff',
    padding: '10px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  submitButton: {
    backgroundColor: '#E9611E',
    color: '#fff',
    padding: '10px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '5px',
  },
  couponSection: {
    marginTop: '10px',
  },
  couponLine: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '5px 0',
  },
  companyCard: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
  },
  radioButton: {
    marginRight: '10px',
  },
  companyDetails: {
    flex: 1,
  },
};

export default OfferAndPaymentSummary;
