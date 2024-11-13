import React, { useState, useEffect } from "react";
import axios from "axios";
import { getAuth } from "firebase/auth"; // Correct import for Firebase auth

const OfferAvailable = ({ totalAmount }) => {
  const [coupon, setCoupon] = useState("");
  const [discountedAmount, setDiscountedAmount] = useState(totalAmount);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [unavailableCoupons, setUnavailableCoupons] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Fetch coupons when totalAmount changes
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

  const applyCoupon = (selectedCoupon) => {
    if (appliedCoupon && appliedCoupon.code !== selectedCoupon.code) {
      // Revert the previous coupon's discount
      setDiscountedAmount(totalAmount);
    }

    if (appliedCoupon && appliedCoupon.code === selectedCoupon.code) {
      // Remove the currently applied coupon
      setAppliedCoupon(null);
      setDiscountedAmount(totalAmount);
    } else {
      // Apply the new coupon
      setAppliedCoupon(selectedCoupon);
      setDiscountedAmount(totalAmount - selectedCoupon.value);
     
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountedAmount(totalAmount);
  };

  return (
    <div style={styles.box}>
      <h2 style={styles.header}>Offer Available</h2>
      <div style={styles.summaryBox}>
        <div style={styles.itemTotalLine}>
          <p style={styles.itemTotalText}>Item(s) Total</p>
          <p style={styles.itemTotalPrice}>Rs. {discountedAmount}</p>
        </div>
        <hr style={styles.line} />

        <div style={styles.pincodeBox}>
          <input
            type="text"
            placeholder="Enter COUPON code"
            value={coupon}
            onChange={handleCouponChange}
            style={styles.input}
          />
          <button style={styles.checkButton} onClick={() => applyCoupon(availableCoupons.find((c) => c.code === coupon))}>
            Apply
          </button>
        </div>

        <div style={styles.couponSection}>
          <p style={styles.applicableCoupons}>Available Coupons</p>
          {availableCoupons.map((coupon, index) => (
            <div key={index} style={styles.couponLine}>
              <p style={styles.couponCode}>{coupon.code}</p>
              <p style={styles.couponText}>{coupon.description}</p>
              <button
                style={styles.applyButton}
                onClick={() => applyCoupon(coupon)}
              >
                {appliedCoupon && appliedCoupon.code === coupon.code
                  ? "Remove"
                  : "Apply"}
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
    marginTop: -20,
    backgroundColor: "#FFFFFF",
  },
  header: {
    backgroundColor: "#4D4D4D",
    color: "#fff",
    padding: "10px",
    marginBottom: "10px",
    textAlign: "left",
  },
  summaryBox: {
    padding: "10px",
    backgroundColor: "#FFFFFF",
  },
  itemTotalLine: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  itemTotalText: {
    fontSize: "16px",
    fontFamily: "'Outfit', sans-serif", 
    color: "#333",
  },
  itemTotalPrice: {
    fontSize: "16px",
    fontWeight: "bold",
    fontFamily: "'Outfit', sans-serif", 
    color: "#333",
  },
  line: {
    border: "none",
    borderTop: "1px solid #ddd",
    margin: "10px 0",
  },
  pincodeBox: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
  },
  input: {
    flex: "1",
    padding: "10px",
    borderRadius: "5px 0 0 5px",
    border: "1px solid #ddd",
  },
  checkButton: {
    padding: "10px 20px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#FB8339",
    color: "#fff",
  },
  couponLine: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "10px",
  },
  couponCode: {
    fontSize: "14px",
    fontWeight: "bold",
    fontFamily: "'Outfit', sans-serif", 
    color: "#333",
  },
  couponText: {
    fontSize: "14px",
    fontFamily: "'Outfit', sans-serif", 
    color: "#333",
    marginLeft: "10px",
  },
  applyButton: {
    padding: "5px 10px",
    border: "none",
    backgroundColor: "transparent",
    color: "#FB8339",
    cursor: "pointer",
    fontWeight: "bold",
    fontFamily: "'Outfit', sans-serif", 
  },
  removeCouponButton: {
    marginTop: "10px",
    padding: "10px",
    backgroundColor: "#E9611E",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    textAlign: "center",
  },
};

export default OfferAvailable;
