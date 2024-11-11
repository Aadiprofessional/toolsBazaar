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
import html2pdf from "html2pdf.js";
import jsPDF from "jspdf";
import { toast } from "react-toastify";

const OrderPlacedScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const orderId = state?.orderId;
  const address = state?.address;
  const cartItems = state?.cartItems || [];
  const totalAmount = state?.totalAmount || 0;
  const [currentUser, setCurrentUser] = useState(null);
  const [pdfPath, setPdfPath] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  console.log('Add', address);

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
      owner: address.owner || "N/A",
      address: address.address || "N/A",
      phoneNumber: address?.phoneNumber || "N/A",
      totalAmount: totalAmount,
      shippingCharges: 0,
      cartItems: cartItems,
      timestamp: new Date().toISOString(),
      orderId: orderId
    };

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice</title>
        <style>
          body { font-family: 'Roboto', sans-serif; }
          .logo { width: 150px; height: auto; }
          .invoice-section { display: flex; justify-content: space-between; margin-top: 20px; }
          .invoice-to, .invoice-from { width: 50%; }
          .invoice-to { text-align: left; }
          .invoice-from { text-align: right; }
          .invoice-header { border-top: 3px solid #FCCC51; border-bottom: 3px solid #FCCC51; margin: 30px 0; padding: 10px 0; }
          .invoice-header h2 { font-size: 2rem; font-weight: bold; color: #000; }
          .text-primary { color: #FCCC51; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 8px 12px; text-align: left; }
          th { background-color: #f2f2f2; }
          td { background-color: #ffffff; }
          tr:nth-child(odd) td { background-color: #f2f2f2; }
          .quantity-title { color: #000; font-weight: bold; }
        </style>
      </head>
      <body>
        <section id="invoice">
          <div class="text-center pb-5">
            <img src="https://firebasestorage.googleapis.com/v0/b/crossbee.appspot.com/o/logo.png?alt=media&token=b7622c61-0fff-4083-ac26-a202a0cd970d" alt="Company Logo" class="logo">
          </div>

          <div class="invoice-section">
            <div class="invoice-to">
              <p class="text-primary">Invoice To</p>
              <h4>${invoiceData.owner || 'N/A'}</h4>
              <ul>
                <li>${invoiceData.address || 'N/A'}</li>
                <li>${invoiceData.phoneNumber || 'N/A'}</li>
              </ul>
            </div>
            <div class="invoice-from">
              <p class="text-primary">Invoice From</p>
              <h4>Your Company Name</h4>
              <ul>
                <li>Your Company Address</li>
                <li>Your Company Email</li>
                <li>Your Company Phone</li>
              </ul>
            </div>
          </div>

          <div class="invoice-header">
            <h2>Invoice</h2>
            <div>
              <p>Invoice No: ${invoiceData.orderId || 'N/A'}</p>
              <p>Invoice Date: ${invoiceData.timestamp.split('T')[0]}</p>
              <p>Due Date: ${invoiceData.timestamp.split('T')[0]}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>No.</th>
                <th>Description</th>
                <th>Price</th>
                <th>Discounted Price</th>
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
                  <td>${item.discountedPrice || '0.00'}</td>
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
        </section>
      </body>
      </html>
    `;

    const pdfBlob = await html2pdf()
      .set({
        margin: 1,
        filename: `${orderId}_invoice.pdf`,
        html2canvas: { scale: 4 }, // Increase resolution
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
      })
      .from(htmlContent)
      .toPdf()
      .outputPdf("blob");

    // Upload the PDF blob to Firebase
    const storageRef = ref(storage, `invoices/${currentUser.uid}/${orderId}`);
    await uploadBytes(storageRef, pdfBlob);
    const pdfUrl = await getDownloadURL(storageRef);
    setPdfPath(pdfUrl);
    toast.success("Invoice PDF created and saved.");
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
