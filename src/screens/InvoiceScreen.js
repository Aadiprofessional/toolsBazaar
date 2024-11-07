import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Updated import
import { getAuth } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import jsPDF from 'jspdf';
import html2pdf from 'html2pdf.js';
import Toast from '../components/Toast';
import { storage } from '../firebaseConfig';
import { doc } from 'firebase/firestore';

const InvoiceScreen = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Use navigate instead of history
  const { invoiceData, quotationId, url } = location.state;

  const [pdfPath, setPdfPath] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      alert('User not authenticated');
      navigate('/login'); // Use navigate instead of history.push
      return;
    }
    setUserId(user.uid);

    const fetchPhoneNumber = async () => {
      const savedPhoneNumber = localStorage.getItem('phoneNumber');
      setPhoneNumber(savedPhoneNumber || 'N/A');
    };

    fetchPhoneNumber();
  }, [navigate]);

  useEffect(() => {
    if (pdfPath) {
      sendQuotation();
    }
  }, [pdfPath]);

  const sendQuotation = async () => {
    const formattedNumber = phoneNumber.replace(/^91/, '');
    const body = {
      url: pdfPath,
      phone: formattedNumber,
    };

    try {
      const response = await fetch('https://crossbee-server-1036279390366.asia-south1.run.app/sendQuotation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Quotation sent successfully:', data);
        Toast.success('Quotation sent successfully!');
      } else {
        console.error('Error sending quotation:', data);
        Toast.error('Failed to send quotation.');
      }
    } catch (error) {
      console.error('Network error:', error);
      Toast.error('Network error while sending quotation.');
    }
  };

  const generatePdf = async () => {
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
                <li>${invoiceData.email || 'N/A'}</li>
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
              <p>Invoice No: ${invoiceData.uid || 'N/A'}</p>
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
                  <td>${item.price || '0.00'}</td>
                  <td>${item.discountedPrice || '0.00'}</td>
                  <td>${item.quantity || 0}</td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
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


    doc.html(htmlContent, {
      callback: (doc) => {
        const pdfOutput = doc.output('blob');
        const storageRef = ref(storage, `invoices/${userId}/${quotationId}`);
        uploadBytes(storageRef, pdfOutput).then((snapshot) => {
          getDownloadURL(snapshot.ref).then((url) => {
            setPdfPath(url);
            Toast.success('PDF uploaded and saved successfully.');
          });
        });
      },
    });
  };

  const handleOpenInvoice = (url) => {
    if (url && /^https?:\/\//i.test(url)) {
      window.open(url, '_blank').catch((err) => console.error('Failed to open URL:', err));
    } else {
      console.log('No valid invoice URL provided');
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#fff' }}>
      <h1>Invoice</h1>
      <h2>Total Amount: ₹{invoiceData.totalAmount.toFixed(2)}</h2>
      <h3>Shipping Charges: ₹{invoiceData.shippingCharges.toFixed(2)}</h3>

      <div>
        <button onClick={() => navigate('/')}>Explore More</button> {/* Updated to navigate */}
        {url && (
          <button onClick={() => handleOpenInvoice(url)}>Download Quotation</button>
        )}
      </div>

      <div>
        <button onClick={generatePdf}>Generate PDF</button>
      </div>
    </div>
  );
};

export default InvoiceScreen;
