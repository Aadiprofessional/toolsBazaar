import React, { useState, useEffect } from 'react';

import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { toast, ToastContainer } from 'react-toastify';

const API_BASE_URL = 'https://toolsbazaar-server-1036279390366.asia-south1.run.app';

const OfferAndPaymentSummary = ({ totalAmount, onUpdateParent ,cart}) => {
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
  const calculateProductGST = (price, quantity, gstRate) => {
    return (price * quantity * gstRate) / 100;
  };

  // Function to calculate total GST for all items in the cart
  const calculateTotalGST = () => {
    return cart.reduce((totalGST, item) => {
      const gstAmount = calculateProductGST(item.product.price, item.quantity, item.product.gst);
      return totalGST + gstAmount;
    }, 0);
  };

  // Function to recalculate final price with GST and discounts
  const calculateFinalPrice = () => {
    const totalGST = calculateTotalGST();
    const couponDiscount = parseFloat(appliedCouponState?.value ?? 0);
    const totalPrice = totalAmount + totalGST + shippingCharges - totalAdditionalDiscountValue - couponDiscount;
    return totalPrice;
  };

  useEffect(() => {
    // Recalculate the final price when the total amount, shipping charges, or any other dynamic values change
    const newFinalPrice = calculateFinalPrice();
    onUpdateParent({ finalPrice: newFinalPrice, selectedAddress });
  }, [totalAmount, cart, shippingCharges, totalAdditionalDiscountValue, appliedCouponState, selectedAddress]);
  const finalPrice = totalAmount + shippingCharges - totalAdditionalDiscountValue - parseFloat(appliedCouponState?.value ?? 0);

  useEffect(() => {
    onUpdateParent({ finalPrice, selectedAddress });
  }, [finalPrice, selectedAddress, onUpdateParent]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phoneNumber' && value.length > 10) return;
    setNewAddress({ ...newAddress, [name]: value });
  };

  const handleSelectCompany = (company) => {
    setSelectedCompanyId(company.id);
    setSelectedAddress(company);
    if (typeof onUpdateParent === 'function') {
      onUpdateParent(company);
    }
  };

  const handleAddAddress = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      try {
        await axios.post(`${API_BASE_URL}/addAddress`, {
          uid: user.uid,
          ...newAddress,
        });
        setNewAddress({ phoneNumber: '', address: '', ownerName: '' });
        setShowForm(false);
        fetchCompanies();
      } catch (error) {
        console.error('Error adding address.');
      }
    }
  };

  const fetchCompanies = async () => {
    setLoading(true);
    const auth = getAuth();
    const currentUser = auth.currentUser;
    try {
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

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleApplyCoupon = (selectedCoupon) => {
    if (appliedCouponState?.code === selectedCoupon.code) {
      setAppliedCouponState(null);
      setDiscountedAmount(totalAmount);
      setCoupon('');
      toast.error("Coupon Removed Successfully");
    } else {
      setAppliedCouponState(selectedCoupon);
      setDiscountedAmount(totalAmount - parseFloat(selectedCoupon.value));
      setCoupon(selectedCoupon.code);
      toast.success('Coupon Applied')
      if (typeof onUpdateParent === 'function') {
        onUpdateParent({ selectedCoupon });
      }
    }
  };
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
          `https://toolsbazaar-server-1036279390366.asia-south1.run.app/coupons/${userId}?amount=${totalAmount}`
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

  const handleCouponChange = (e) => {
    setCoupon(e.target.value);
  };
  const calculateGSTTotal = () => (discountedAmount + shippingCharges) * 0.18;


  useEffect(() => {
    onUpdateParent({ finalPrice, selectedAddress });
  }, [finalPrice, selectedAddress, onUpdateParent]);

  return (
    <div style={styles.box}>
      <ToastContainer/>
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
          <div style={styles.summaryRow}>
            <p style={styles.summaryLabel}>Total GST:</p>
            <p style={styles.summaryValue}>₹{calculateTotalGST().toFixed(2)}</p>
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
        <div style={styles.companyCard2}>
        <div style={styles.companyCard3}>
          {loading ? <p>Loading...</p> : (
            companies.map(company => (
              <div key={company.id} style={styles.companyCard}>
                <input
                  type="radio"
                  name="company"
                  checked={selectedCompanyId === company.id}
                  onChange={() => handleSelectCompany(company)}
                  style={styles.radioButton}
                />
                <div style={styles.companyDetails}>
                  <p style={styles.summaryLabel} >{company.owner}, {company.phoneNumber}</p>
                
                  <p style={styles.summaryLabel}>{company.address}</p>
                </div>
              </div>
            ))
          )}
          </div>
          {!showForm && (
            <button onClick={() => setShowForm(true)} style={styles.addButton}>
              Add New Address
            </button>
          )}
          {showForm && (
            <div style={styles.form}>
              <input
                type="text"
                name="ownerName"
                placeholder="Owner Name"
                value={newAddress.ownerName}
                onChange={handleInputChange}
                style={styles.input}
              />
              <input
                type="text"
                name="phoneNumber"
                placeholder="Phone Number"
                value={newAddress.phoneNumber}
                onChange={handleInputChange}
                style={styles.input}
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={newAddress.address}
                onChange={handleInputChange}
                style={styles.input}
              />
              <div style={styles.buttonContainer}>
                <button onClick={() => setShowForm(false)} style={styles.cancelButton}>Cancel</button>
                <button onClick={handleAddAddress} style={styles.submitButton}>Submit Address</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <h2 style={styles.header}>Offer Available</h2>
      <div style={styles.summaryBox}>
        <div style={styles.companyCard2}>
          <div style={styles.couponRow}>
            <input
              type="text"
              placeholder="Enter COUPON code"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              style={styles.input}
            />
            <button
              style={styles.applyButton}
              onClick={() => handleApplyCoupon(availableCoupons.find(c => c.code === coupon))}
            >
              {appliedCouponState ? 'Remove' : 'Apply'}
            </button>
          </div>

          <div style={styles.couponSection}>
            {availableCoupons.map((availableCoupon, index) => (
              <div key={index} style={styles.couponLine}>
                <p style={styles.couponCode}>{availableCoupon.code}</p>
                <p
                  style={styles.couponDescription}
                  onClick={() => alert(availableCoupon.description)} // Toggle on click
                >
                  {availableCoupon.description}
                </p>
                <button style={styles.transparentButton} onClick={() => handleApplyCoupon(availableCoupon)}>
                  {appliedCouponState?.code === availableCoupon.code ? 'Remove' : 'Apply'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  box: { background: '#f9f9f9', borderRadius: '8px', margin: '10px' },

  totalRow: { display: 'flex', justifyContent: 'space-between', marginTop: '10px' },
  totalLabel: { fontSize: '18px', fontWeight: 'bold' },
  totalValue: { fontSize: '18px', fontWeight: 'bold', color: '#ff4500' },

  companyDetails: {

    flex: 1,
    overflowY: 'auto', // make the address scrollable
    maxHeight: '150px', // Limit the height to make it scrollable
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 0, // Remove gap
    paddingBottom: 0, // Remove gap
  },
  summaryLabel: {
    fontSize: '16px',
    margin: '0 10px 10px 0',
  
  },
  summaryValue: {
    fontSize: '16px',
    margin: 0,
  // Adjust margins to make text touch
  },
  couponDescription: {
    whiteSpace: 'normal',
    overflow: 'visible',
    textOverflow: 'clip',
    maxWidth: '200px', // Allow description to expand
    cursor: 'pointer', // Show pointer on hover
  },
  couponCode: {
    color: '#E9611E',
    fontWeight: 'bold',
  },
  addButton: {
   // Hide the button after clicking
    backgroundColor: '#E9611E',
    color: '#fff',
    marginTop: 20,
    padding: '10px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  couponRow: { display: 'flex', alignItems: 'center', gap: '10px', margin: '10px 0' },
  couponSection: { display: 'flex', flexDirection: 'column', gap: '10px' },

  submitButton: { background: '#333', color: '#fff', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' },
  input: { padding: '8px', margin: '5px 0', width: '100%', borderRadius: '4px', border: '1px solid #ccc' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px' },
  header: { fontSize: '24px', fontWeight: 'bold', margin: '20px 0' },

  couponLine: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '5px 0',
  },

  totalRow: { display: 'flex', justifyContent: 'space-between', marginTop: '10px' },
  totalLabel: { fontSize: '18px', fontWeight: 'bold' },
  totalValue: { fontSize: '18px', fontWeight: 'bold' },
  input: { padding: '10px', borderRadius: '4px', border: '1px solid #ddd', marginRight: '10px' },
  couponRow: { display: 'flex', alignItems: 'center', marginTop: '10px' },
  transparentButton: { background: 'transparent', color: '#E9611E', border: 'none', cursor: 'pointer', padding: '10px' },
  couponSection: { marginTop: '10px' },
  couponRow: { display: 'flex', alignItems: 'center', marginTop: '10px' },
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
  buttonContainer: {
    display: 'flex',
    gap: '10px',
    marginTop: '5px',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    color: '#000',
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
    marginLeft: 20,
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
  companyCard2: {
    padding: '10px',


  },
  radioButton: {
    marginRight: '10px',
  },
  companyCard3:  {
    padding: '10px',
    maxHeight: '30vh',
    overflowY: 'scroll',

  },

};

export default OfferAndPaymentSummary;
