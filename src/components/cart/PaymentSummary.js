import React from 'react';

const PaymentSummary = ({
  totalAmount,
  location,
  pincode,
  handlePincodeChange
}) => {
  // Mock Data
  const shippingCharges = Math.floor(Math.random() * 500) + 50; // Random shipping charges between 50 and 500
  const appliedDiscount = { discount: Math.floor(Math.random() * 20) }; // Random discount between 0 and 20%
  const totalAdditionalDiscountValue = Math.floor(Math.random() * 300) + 50; // Random additional discount between 50 and 300
  const appliedCoupon = { value: Math.floor(Math.random() * 500) + 100 }; // Random coupon discount between 100 and 500
  const useRewardPoints = true; // Example: Assuming reward points are applied
  const data = {
    shippingCharges: shippingCharges,
    rewardPointsPrice: Math.floor(Math.random() * 150) + 20 // Random reward points value between 20 and 150
  };

  // Calculate subtotal
  const calculateSubtotal = () => totalAmount - (totalAmount * (appliedDiscount.discount / 100));

  // Calculate GST
  const calculateGSTTotal = () => (calculateSubtotal() + totalAdditionalDiscountValue) * 0.18; // 18% GST

  return (
    <div style={styles.box}>
      <h2 style={styles.header}>Payment Summary</h2>

      <div style={styles.summaryBox}>
        <div style={styles.itemTotalLine}>
          <p style={styles.itemTotalText}>Item(s) Total</p>
          <p style={styles.itemTotalPrice}>
            ₹{totalAmount.toFixed(2)}
          </p>
        </div>
        <hr style={styles.line} />

        <div style={styles.summaryRow}>
          <p style={styles.summaryLabel}>Shipping Charges:</p>
          <p style={styles.summaryValue}>
            ₹{shippingCharges.toFixed(2)}
          </p>
        </div>

        {appliedDiscount && (
          <div style={styles.summaryRow}>
            <p style={styles.summaryLabel}>
              Discount ({appliedDiscount.discount}%):
            </p>
            <p style={styles.summaryValue}>
              -₹{(calculateSubtotal() * appliedDiscount.discount / 100).toFixed(2)}
            </p>
          </div>
        )}

        <div style={styles.summaryRow}>
          <p style={styles.summaryLabel}>Additional Discount:</p>
          <p style={styles.summaryValue}>
            -₹{totalAdditionalDiscountValue.toFixed(2)}
          </p>
        </div>

        {appliedCoupon && (
          <div style={styles.summaryRow}>
            <p style={styles.summaryLabel}>Coupon Discount:</p>
            <p style={styles.couponDiscount}>
              -₹{appliedCoupon.value.toFixed(2)}
            </p>
          </div>
        )}

        {useRewardPoints && (
          <div style={styles.summaryRow}>
            <p style={styles.summaryLabel}>Wallet Points Discount:</p>
            <p style={styles.couponDiscount}>
              -₹{data.rewardPointsPrice.toFixed(2)}
            </p>
          </div>
        )}

        <div style={styles.summaryRow}>
          <p style={styles.summaryLabel}>GST:</p>
          <p style={styles.summaryValue}>
            +₹{calculateGSTTotal().toFixed(2)}
          </p>
        </div>

        <div style={styles.totalRow}>
          <p style={styles.totalLabel}>Total:</p>
          <p style={styles.totalValue}>
            ₹{(totalAmount + calculateGSTTotal() - totalAdditionalDiscountValue - appliedCoupon.value).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  box: {
    backgroundColor: '#FFFFFF',
    marginTop: -20,
  },
  header: {
    backgroundColor: '#4D4D4D',
    color: '#fff',
    padding: '10px',
    marginBottom: '10px',
    textAlign: 'left',
  },
  summaryBox: {
    padding: '10px',
    backgroundColor: '#FFFFFF',
  },
  itemTotalLine: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1px',
  },
  itemTotalText: {
    fontSize: '16px',
    color: '#333',
    fontFamily: "'Outfit', sans-serif", 
  },
  itemTotalPrice: {
    fontSize: '16px',
    fontFamily: "'Outfit', sans-serif", 
    fontWeight: 'bold',
    color: '#333',
  },
  line: {
    border: 'none',
    borderTop: '1px solid #ddd',
    margin: '10px 0',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '-20px',
  },
  summaryLabel: {
    fontSize: '16px',
    fontFamily: "'Outfit', sans-serif", 
    color: '#333',
  },
  summaryValue: {
    fontSize: '16px',
    fontWeight: 'bold',
    fontFamily: "'Outfit', sans-serif", 
    color: '#333',
  },
  couponDiscount: {
    fontSize: '16px',
    fontWeight: 'bold',
    fontFamily: "'Outfit', sans-serif", 
    color: '#E74C3C', // Red for discount
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '20px',
    borderTop: '2px solid #ddd',
    paddingTop: '10px',
  },
  totalLabel: {
    fontSize: '18px',
    fontWeight: 'bold',
    fontFamily: "'Outfit', sans-serif", 
    color: '#333',
  },
  totalValue: {
    fontSize: '18px',
    fontWeight: 'bold',
    fontFamily: "'Outfit', sans-serif", 
    color: '#333',
  },
};

export default PaymentSummary;
