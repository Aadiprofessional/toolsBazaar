import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TaskBar from "../components/TaskBar";
import BrowseCategories from "../components/BrowseCategories";
import Lottie from "lottie-react";
import animationData from "../assets/Animation - 1724952662598.json";
import { FaEnvelope } from "react-icons/fa";
import { auth, storage } from "../firebaseConfig";
import axios from "axios";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import jsPDF from "jspdf";
import { toast } from "react-toastify";

const OrderPlacedScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const orderId = state?.orderId;
  const cartItems = state?.cartItems || [];
  const totalAmount = state?.totalAmount || 0;
  const [currentUser, setCurrentUser] = useState(null);
  const [pdfPath, setPdfPath] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Fetch current user's phone number
  useEffect(() => {
    if (currentUser) {
      // Generate the PDF once the user is authenticated
      generatePdf();
    }
  }, [currentUser]);

  useEffect(() => {
    if (pdfPath) {
      sendInvoice();
    }
  }, [pdfPath]);
console.log(cartItems);

  const generatePdf = async () => {
    const invoiceData = {
      owner: currentUser?.displayName || "N/A",
      address: "User's Address",
      email: currentUser?.email || "N/A",
      phoneNumber: currentUser?.phoneNumber || "N/A",
      totalAmount: totalAmount,
      shippingCharges: 50,
      cartItems: cartItems,
      timestamp: new Date().toISOString(),
    };

    const invoiceDate = invoiceData.timestamp ? invoiceData.timestamp.split('T')[0] : new Date().toISOString().split('T')[0];
    
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
          }
          .text-center {
            text-align: center;
          }
          .text-primary {
            color: #FA832A;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            padding: 6px 10px;
            text-align: left;
            border: 1px solid #ddd;
            font-size: 12px;
          }
          th {
            background-color: #f4f4f4;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          .logo {
            max-width: 150px;
            margin-bottom: 20px;
          }
          .invoice-header {
            margin-bottom: 20px;
          }
          .invoice-footer {
            margin-top: 30px;
            text-align: center;
          }
          .line {
            border-bottom: 2px solid #ddd;
            margin: 15px 0;
          }
        </style>
      </head>
      <body>
        <section id="invoice">
          <div class="text-center pb-5">
            <img src="assets/logo.png" alt="Company Logo" class="logo">
          </div>
          <div class="invoice-header">
            <h2>Invoice</h2>
            <p>Invoice No: ${invoiceData.uid || 'N/A'}</p>
            <p>Invoice Date: ${invoiceDate}</p>
            <p>Due Date: ${invoiceDate}</p>
          </div>
          <div class="invoice-section" style="display: flex; justify-content: space-between;">
            <div class="invoice-to">
              <p class="text-primary">Invoice To</p>
              <h4>${invoiceData.owner || 'N/A'}</h4>
              <ul style="list-style-type: none; padding-left: 0;">
                <li>${invoiceData.address || 'N/A'}</li>
                <li>${invoiceData.email || 'N/A'}</li>
                <li>${invoiceData.phoneNumber || 'N/A'}</li>
              </ul>
            </div>
            <div class="invoice-from">
              <p class="text-primary">Invoice From</p>
              <h4>Your Company Name</h4>
              <ul style="list-style-type: none; padding-left: 0;">
                <li>Your Company Address</li>
                <li>Your Company Email</li>
                <li>Your Company Phone</li>
              </ul>
            </div>
          </div>
          <div class="line"></div>
          <table>
            <thead>
              <tr>
                <th>No.</th>
                <th>Description</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${invoiceData.cartItems.map((item, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${item.productName || 'N/A'}</td>
                  <td>${item.product.price || '0.00'}</td>
                  <td>${item.product.additionalDiscount || '0.00'}</td>
                  <td>${item.quantity || 0}</td>
                  <td>${(item.product.price * item.quantity).toFixed(2)}</td>
                </tr>`).join('')}
              <tr>
                <td colspan="4">Sub-Total</td>
                <td colspan="2">${invoiceData.totalAmount.toFixed(2)}</td>
              </tr>
              <tr>
                <td colspan="4">Shipping Charges</td>
                <td colspan="2">${invoiceData.shippingCharges.toFixed(2)}</td>
              </tr>
              <tr>
                <td colspan="4" class="text-primary">Grand Total</td>
                <td colspan="2" class="text-primary">${(invoiceData.totalAmount + invoiceData.shippingCharges).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          <div class="invoice-footer">
            <p>Thank you for your purchase!</p>
          </div>
        </section>
      </body>
      </html>
    `;
    
    const doc = new jsPDF();
    doc.html(htmlContent, {
      callback: async (doc) => {
        // Use addPage for setting the page size
        doc.addPage([210, 297]); // A4 size
        doc.setFontSize(10);  // Adjust font size
        
        // Output the PDF
        const pdfOutput = doc.output("blob");
        const storageRef = ref(storage, `invoices/${currentUser.uid}/${orderId}`);
        uploadBytes(storageRef, pdfOutput).then((snapshot) => {
          getDownloadURL(snapshot.ref).then((url) => {
            setPdfPath(url);
            toast.success("PDF uploaded and saved successfully.");
          });
        });
      },
      x: 10,
      y: 10,
      width: 180,
      windowWidth: 800,
    });
};
  
  const sendInvoice = async () => {
    const body = {
      url: pdfPath,
      phone: currentUser?.phoneNumber,
    };

    try {
      const response = await axios.post("https://toolsbazaar-server-1036279390366.asia-south1.run.app/sendInvoice", body, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 200) {
        toast.success("Invoice sent successfully!");
      } else {
        toast.error("Failed to send invoice.");
      }
    } catch (error) {
      console.error("Error sending invoice:", error);
      toast.error("Network error while sending invoice.");
    }
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
    <div className="order-placed-screen" style={styles.orderPlacedScreen}>
      <TaskBar />
      <div style={styles.whiteBox}>
        <div style={styles.grayBox}>
          <div style={styles.orderPlacedContainer}>
            <div style={styles.animationBox}>
              <Lottie animationData={animationData} loop autoplay style={{ height: 200, width: 200 }} />
            </div>
            <div style={styles.messageBox}>
              <p style={styles.orderPlacedText}>Order Placed Successfully!</p>
              <p style={styles.welcomeText}>
                Welcome to the Toolbazar! Your order has been placed successfully. We will notify you via email when it is shipped.
              </p>
            </div>
            <div style={styles.iconBox}>
              <FaEnvelope size={32} />
              <p style={styles.mailText}>A copy of the invoice has been sent to your WhatsApp</p>
            </div>
          </div>
        </div>
        <div style={styles.browseCategoriesBox}>
          <BrowseCategories categories={categories} />
        </div>
      </div>
    </div>
  );
};

const styles = {
  orderPlacedScreen: {
    minHeight: "100vh",
    backgroundColor: "#F8F9F9",
  },
  whiteBox: {
    width: "90%",
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    margin: "50px auto",
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
  },
  grayBox: {
    backgroundColor: "#FAFAFA",
    borderRadius: "15px",
    padding: "40px",
  },
  orderPlacedContainer: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
  },
  animationBox: {
    marginBottom: "30px",
  },
  messageBox: {
    textAlign: "center",
    paddingBottom: "20px",
  },
  orderPlacedText: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  welcomeText: {
    fontSize: "16px",
    color: "#555",
  },
  iconBox: {
    display: "flex",
    alignItems: "center",
  },
  mailText: {
    marginLeft: "10px",
    fontSize: "14px",
    color: "#555",
  },
  browseCategoriesBox: {
    padding: "20px",
  },
};

export default OrderPlacedScreen;
