// src/components/ContactScreen.js
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import TaskBar from '../components/TaskBar';
import BrowseCategories from '../components/BrowseCategories';
import { FaPhone, FaWhatsapp, FaEnvelope } from 'react-icons/fa';

const ContactScreen = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogoClick = () => {
    navigate('/'); // Navigate to the landing page
  };

  const handleCall = () => {
    window.location.href = 'tel:9289881135';
  };

  const handleWhatsApp = () => {
    window.location.href = 'https://wa.me/9289881135';
  };

  const handleMail = () => {
    window.location.href = 'mailto:your-email@example.com';
  };

  const categories = [
    "Abrasives",
    "Adhesives Sealants and Tape",
    "Agriculture Garden & Landscaping",
    "Automotive Maintenance and Lubricants",
    "Bearings",
    "Cleaning",
    "Electrical",
    "Furniture, Hospitality and Food Service",
    "Hand Tools",
    "Hardware",
    "Hydraulics and Pneumatics",
    "IT Security",
    "Industrial Automation",
    "LED & Lights",
    "Lab Supplies",
    "Material Handling and Packaging",
    "Medical Supplies & Equipment",
    "Motors & Power Transmission",
    "Office Supplies",
    "Plumbing",
    "Power Tools",
    "Pumps",
    "Safety",
    "Solar",
    "Testing and Measuring Instruments",
    "Tooling and Cutting",
    "Welding",
  ];

  return (
    <div className="contact-screen" style={styles.contactScreen}>
      <TaskBar />
      <div style={styles.whiteBox}>
        <div style={styles.grayBox}>
          <div style={styles.contactHeader}>
            <p style={styles.contactText}>Contact Us</p>
          </div>
          <div style={styles.buttonContainer}>
            <button style={styles.contactButton} onClick={handleCall}>
              <FaPhone style={styles.icon} /> Call Us
            </button>
            <button style={styles.contactButton} onClick={handleWhatsApp}>
              <FaWhatsapp style={styles.icon} /> WhatsApp
            </button>
            <button style={styles.contactButton} onClick={handleMail}>
              <FaEnvelope style={styles.icon} /> Mail
            </button>
          </div>
          <BrowseCategories categories={categories} />
        </div>
        <button style={styles.shopNowButton} onClick={handleLogoClick}>
          Start Shopping
        </button>
      </div>
      <p style={styles.termsText}>
        By clicking on Place Order button you agree to{" "}
        <a href="/terms" style={styles.linkText}>
          Terms & Conditions
        </a>{" "}
        and{" "}
        <a href="/privacy" style={styles.linkText}>
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
};

const styles = {
  contactScreen: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '20px',
  },
  whiteBox: {
    backgroundColor: '#FFFFFF',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    borderRadius: '10px',
    width: '100%',
    maxWidth: '1500px',
  },
  grayBox: {
    backgroundColor: '#EEEEEE',
    padding: '20px',
    borderRadius: '10px',
  },
  contactHeader: {
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  contactText: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#666666',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  contactButton: {
    backgroundColor: '#00000020', // Updated to #EEEEEE
    border: '1px solid black',
    color: 'black',
    cursor: 'pointer',
    padding: '0', // Remove padding to ensure uniform button size
    margin: '5px',
    borderRadius: '5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', // Center the content horizontally
    width: '200px', // Set width to ensure buttons are the same size
    height: '50px', // Set height to ensure buttons are the same size
    textAlign: 'center', // Center text inside the button
  },
  icon: {
    marginRight: '10px',
  },
  shopNowButton: {
    marginTop: '20px',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    backgroundColor: '#FA832A',
    color: '#fff',
    width: '40%',
  },
  termsText: {
    marginTop: '20px',
    fontSize: '12px',
    color: '#777',
    textAlign: 'center',
  },
  linkText: {
    color: '#007BFF',
    textDecoration: 'none',
  },
};

export default ContactScreen;
