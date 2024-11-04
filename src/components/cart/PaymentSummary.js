import React from 'react';

const PaymentSummary = ({ totalAmount, location, pincode, handlePincodeChange }) => (
  <div style={styles.box}>
    <h2 style={styles.header}>Payment Summary</h2>

    <div style={styles.summaryBox}>
      <div style={styles.itemTotalLine}>
        <p style={styles.itemTotalText}>Item(s) Total</p>
        <p style={styles.itemTotalPrice}>Rs. {totalAmount}</p>
      </div>
      <hr style={styles.line} />

      {/* <div style={styles.estimateShipping}>
        <p style={styles.estimateText}><strong>Estimate Shipping Price</strong></p>
        <div style={styles.pincodeBox}>
          <input
            type="text"
            placeholder="Enter your pincode"
            value={pincode}
            onChange={handlePincodeChange}
            style={styles.input}
          />
          <button style={styles.checkButton}>Check</button>
        </div>
        <hr style={styles.line} />
        <p style={styles.shippingNote}>Shipping charges may apply</p>
      </div> */}
    </div>
  </div>
);

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
    marginBottom: '10px',
  },
  itemTotalText: {
    fontSize: '16px',
    color: '#333',
  },
  itemTotalPrice: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
  },
  line: {
    border: 'none',
    borderTop: '1px solid #ddd',
    margin: '10px 0',
  },
  estimateShipping: {
    marginTop: '20px',
  },
  estimateText: {
    marginBottom: '10px',
    fontSize: '16px',
    color: '#333',
  },
  pincodeBox: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  input: {
    flex: '1',
    padding: '10px',
    borderRadius: '5px 0 0 5px',
    border: '1px solid #ddd',
  },
  checkButton: {
    padding: '10px 20px',
    border: 'none',
 
    cursor: 'pointer',
    backgroundColor: '#4D4D4D',
    color: '#fff',
  },
  shippingNote: {
    fontSize: '12px',
    color: '#888',
  },
};

export default PaymentSummary;
