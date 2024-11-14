import React, { useState, useEffect } from "react";
import axios from "axios";
import TaskBar from "../components/TaskBar";
import { auth } from "../firebaseConfig";
import { Flex, Rate } from 'antd';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import Lottie from "lottie-react";
import loadingAnimation from "../assets/Animation - 1730717782675.json";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom"; // Import at the top
import './OrderHistory.css';

const OrderHistory = () => {
  const [selectedFilter, setSelectedFilter] = useState("Orders");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState("Past 3 Months");

  const [isMobileView, setIsMobileView] = useState(false);

  const [ratings, setRatings] = useState({}); // To store ratings for each product
  const [value, setValue] = useState(3);
  const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];

  useEffect(() => {
    const fetchOrders = async (user) => {
      try {
        const response = await axios.post(
          'https://toolsbazaar-server-1036279390366.asia-south1.run.app/getOrders',
          { uid: user.uid }
        );
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchOrders(user);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (selectedFilter === "Not Shipped") return order.status === "In Review";
    if (selectedFilter === "Cancelled Orders") return order.status === "Cancelled";
    return true; // "Orders" shows all orders
  });

  const handleToggleDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const handleRatingChange = (itemId, value) => {
    setRatings((prev) => ({ ...prev, [itemId]: value }));
  };

  const handleSubmitRatings = async (orderId) => {
    const order = orders.find(order => order.id === orderId);
    const updatedCartItems = order.cartItems.map(item => ({
      ...item,
      rating: ratings[item.cartId] || 0
    }));

    try {
      await axios.post('https://toolsbazaar-server-1036279390366.asia-south1.run.app/rateOrder', {
        ratings: updatedCartItems,
        id: orderId,
        uid: auth.currentUser.uid,
      });
      toast.success("Ratings submitted successfully");
    } catch (error) {
      toast.error('Error submitting ratings:', error);
    }
  };

  const allItemsRated = (order) => order.cartItems.every(item => item.rating !== undefined);


  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <Lottie animationData={loadingAnimation} loop={true} />
      </div>
    );
  }
  const handleDownloadInvoice = (orderId) => {
    const order = orders.find(order => order.id === orderId);
    const invoiceUrl = order.invoice; // Invoice URL from the order data

    if (invoiceUrl) {
      // Open the invoice URL in a new tab
      window.open(invoiceUrl, '_blank');
    } else {
      console.error('Invoice URL not found');
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await axios.post('https://toolsbazaar-server-1036279390366.asia-south1.run.app/admin/transfer/order', { orderId,from : "In Review",to : "Cancelled" ,uid : auth.currentUser.uid});
      toast.success("Order cancelled successfully");
      // Update order status in state if needed
      setOrders(orders.map(order => order.id === orderId ? { ...order, status: 'Cancelled' } : order));
    } catch (error) {
      toast.error("Failed to cancel order");
    }
  };
  const handleCardClick = (item) => {
    const product = item.product;
    console.log(item);

    if (product) {
      // Use navigate function for navigation
      navigate(
        `/product/${item.mainId}/${item.categoryId}/${item.productId}/${item.attribute1}/${item.attribute2}/${item.attribute3}`,
        {
          state: {
            product: {
              ...product,

              main: product.main,
              product: product,
              category: product.category,
              attribute1ID: product.attribute1Name,
              attribute2ID: product.attribute2Name,
              attribute3ID: product.attribute3Name,
            },
          },
        }
      );
    } else {
      console.error("Product object is undefined");
    }
  };



  const truncateAddress = (address) => {
    if (!address) return ""; // Return an empty string if address is undefined
    const maxLength = 60; // Approximate max characters for two lines
    return address.length > maxLength ? address.slice(0, maxLength) + "..." : address;
  };


  return (
    <div style={styles.container}>
      <TaskBar />
   
      <div style={styles.header}>
        <div style={styles.orderCountBox}>
          <h1>Your Orders: <strong>{filteredOrders.length}</strong></h1>
        </div>
      </div>
      <div className="filterContainer2">
        <div style={styles.filterButtons}>
          <button
            style={selectedFilter === "Orders" ? { ...styles.filterButton, ...styles.activeFilterButton } : styles.filterButton}
            onClick={() => setSelectedFilter("Orders")}
          >
            All Orders
          </button>
          <button
            style={selectedFilter === "Not Shipped" ? { ...styles.filterButton, ...styles.activeFilterButton } : styles.filterButton}
            onClick={() => setSelectedFilter("Not Shipped")}
          >
            Not Shipped
          </button>
          <button
            style={selectedFilter === "Cancelled Orders" ? { ...styles.filterButton, ...styles.activeFilterButton } : styles.filterButton}
            onClick={() => setSelectedFilter("Cancelled Orders")}
          >
            Cancelled Orders
          </button>
        </div>
      </div>
      <div>
        {filteredOrders.map((order) => (
          // Inside the map of filteredOrders in the return
          <div key={order.id} style={styles.orderCard} onClick={() => handleToggleDetails(order.id)}>
            <div style={styles.orderDetailsHeader}>
              <div style={{ ...styles.orderDetailsHeaderItem }}>
                <div style={{ color: '#DB3F1F', marginBottom: '10px' }}>Order Placed</div>
                <div>{new Date(order.timestamp).toLocaleDateString()}</div>
              </div>
              <div style={{ ...styles.orderDetailsHeaderItem }}>
                <div style={{ color: '#DB3F1F', marginBottom: '10px' }}>Total</div>
                <div>₹{order.totalAmount.toFixed(2)}</div>
              </div>
              <div style={{ ...styles.orderDetailsHeaderItem }}>
                <div style={{ color: '#DB3F1F', marginBottom: '10px' }}> Ship To</div>
                <div>{truncateAddress(order.address.address)}</div>
              </div>
              <div style={{ ...styles.orderDetailsHeaderItem }}>
                <div style={{ color: '#DB3F1F', marginBottom: '10px' }}>Order Status</div>
                <div>{order.status}</div>
              </div>
              <div style={styles.orderDetailsHeaderItem}>
                <span style={{ whiteSpace: 'nowrap' }}>Order #{order.id}</span>
                {expandedOrderId === order.id ? (
                  <div style={{ color: '#E9611E', marginTop: 10 }}>View Less <FaChevronUp /></div>
                ) : (
                  <div style={{ color: '#E9611E', marginTop: 10 }}>View More <FaChevronDown /></div>
                )}
              </div>
            </div>

            {expandedOrderId === order.id && (
              <div style={styles.orderDetailsDropdown} onClick={(event) => event.stopPropagation()}>
                {order.cartItems.map((item) => (
                  <div key={item.cartId} style={styles.dropdownContent}>
                    <div style={styles.imageContainer}>
                      <img src={item.product.images[0]} alt={item.productName} style={styles.image} />
                    </div>
                    <div style={styles.textContent}>
                      <p><strong>{item.productName}</strong></p>
                      <p>Return or replace items: Eligible through September 5, 2024</p>
                      <Flex gap="middle" direction="vertical">
                        <Rate
                          tooltips={desc}
                          onChange={(value) => handleRatingChange(item.cartId, value)}
                          value={item.rating ?? (ratings[item.cartId] || 0)}
                        />
                      </Flex>
                      {/* <div style={styles.buttonContainer}>
                        <button onClick={() => handleCardClick(item)} style={styles.viewButton}>View Item</button>

                      </div> */}
                    </div>
                    <div className="contactBox ">
                      <p style={styles.contactText}>Send Us A Message</p>
                      <p style={styles.contactText}>If you are not able to find your answer, please contact Us.</p>
                      <button style={styles.contactButton}>Contact Us</button>
                    </div>
                  </div>
                ))}

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  {!allItemsRated(order) && (
                    <button onClick={() => handleSubmitRatings(order.id)} style={{ ...styles.contactButton, flex: 1 }}>
                      Submit All Ratings
                    </button>
                  )}
                  {order.status === "In Review" && (
                    <button onClick={() => handleCancelOrder(order.id)} style={{ ...styles.contactButton2, flex: 1 }}>
                      Cancel
                    </button>
                  )}
                  <button onClick={() => handleDownloadInvoice(order.id)} style={{ ...styles.contactButton2, flex: 1 }}>
                    Download Invoice
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}</div></div>
  );
};

const styles = {
  // ...your existing styles with updated color and spacing
  orderDetailsHeaderItem: {
    flex: 1,
    textAlign: "center",
    color: "#DB3F1F", // Updated color for headers
  },
  dropdownContent: {
    display: "flex",
    alignItems: "center",
    padding: "10px 0",
    borderBottom: "1px solid #ddd",
    gap: "10px", // Added gap for spacing
  },
  container: {
    padding: "20px",
    backgroundColor: "#f0f0f0",
    minHeight: "100vh",
  },
  contactButton: {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#F59F13", // You can change this color
    cursor: "pointer",
    color: "white",
    marginRight : 10,
   
  },
  header: {
    marginBottom: "20px",
    marginTop: "50px",
  },
  orderCountBox: {

    padding: "10px",
    display: "inline-block",
  },
  '.dropdownContent:last-child': {
    borderBottom: "none",
  },
  filterContainer: {
    display: "flex",


    position: "relative",
  },
  filterContainer2: {
    display: "flex",
    width: "18%", // Set the filter container width to 40%
    height: "auto",
    flexDirection: "column", // Stack buttons vertically
    padding: "10px",
    backgroundColor: "#FFFFFF",
    borderRadius: "8px",
    marginBottom: 40,
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    position: "relative",
  },
  filterButtons: {
    display: "flex",
    flexDirection: "row", // Stack buttons vertically

  },
  filterButton: {


    border: "0px solid #ddd",
    backgroundColor: "white",
    cursor: "pointer",
    fontWeight: "normal",
    fontFamily: "'Outfit', sans-serif", 
    color: '#3E3D3DFF', // Set text color to white
  },
  activeFilterButton: {
    fontWeight: "bold",
    fontFamily: "'Outfit', sans-serif", 
    backgroundColor: "#f0f0f0",
    padding: "10px",
    borderRadius: "8px",
    color: '#000000FF', // Set text color to white
  },


  timeFilter: {
    position: "absolute",
    right: 0,
    top: "50%",
    transform: "translateY(-50%)",
  },
  timeFilterButton: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    backgroundColor: "white",
    cursor: "pointer",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    fontWeight: "normal",
    fontFamily: "'Outfit', sans-serif", 
    color: "#333",
  },
  dropdownMenu: {
    position: "absolute",
    top: "100%",
    left: "0",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    zIndex: 1,
    marginTop: "5px",
  },
  dropdownItem: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    backgroundColor: "white",
    cursor: "pointer",
    textAlign: "left",
    display: "block",
    color: "#333",
  },
  orderCard: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    cursor: "pointer",
    backgroundColor: "white",
    width: "90vw",
    marginBottom: "10px",
    position: "relative",
    // Space for the contact box
  },
  orderDetailsHeader: {
    display: "flex",
    justifyContent: "space-between",
    fontWeight: "semi-bold",
    fontFamily: "'Outfit', sans-serif", 

  },
  orderDetailsHeaderItem: {
    flex: 1,
    textAlign: "center",
  },
  orderDetailsData: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },
  orderDetailsDataItem: {
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
    fontFamily: "'Outfit', sans-serif", 
  },
  orderDetailsDataItem2: {
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
    fontFamily: "'Outfit', sans-serif", 
    color: "#E9611E"
  },
  orderDetailsDropdown: {
    backgroundColor: "#f0f0f0",
    padding: "10px",
    marginTop: "10px",
    display: "flex",
    flexDirection: "column", // Stack items vertically
  },

  dropdownContent: {
    display: "flex",
    alignItems: "center",
    flex: 1,
    padding: "10px 0",  // Add some vertical padding
    borderBottom: "1px solid #ddd", // Line between items
  },

  imageContainer: {
    display: 'flex',           // Use flexbox to align items
    justifyContent: 'center',  // Center horizontally
    alignItems: 'center',      // Center vertically
    width: '170px',
    height: '170px',
    marginRight: '20px',
    borderRadius: '8px',
    backgroundColor: 'white',
  },

  image: {
    width: '150px',
    height: '150px',
    objectFit: 'contain',
  },
  textContent: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  buttonContainer: {
    display: "flex",
    gap: "10px",
  },
  buyButton: {
    marginTop: "10px",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    backgroundColor: "#F59F13", // Buy It Again color
    cursor: "pointer",
    color: "white",
  },


  contactButton2: {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#DB3F1F",
    cursor: "pointer",
    color: "white",
    marginRight : 10,
  },
  orderCard: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    cursor: "pointer",
    backgroundColor: "white",
    width: "90vw",
    marginBottom: "10px",
    padding: "15px",
  },
  orderDetailsHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
    flexWrap: "wrap", // Allow wrapping on smaller screens
  },
  orderDetailsHeaderItem: {
    flex: 1,
    textAlign: "center",
    marginBottom: "10px", // Space between items for mobile
  },
  orderDetailsDropdown: {
    backgroundColor: "#f0f0f0",
    padding: "10px",
    marginTop: "10px",
    display: "flex",
    flexDirection: "column",
  },
  dropdownContent: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap", // Stack items for mobile
    padding: "10px 0",
    borderBottom: "1px solid #ddd",
  },
  imageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "170px",
    height: "170px",
    marginRight: "20px",
    backgroundColor: "white",
    borderRadius: "8px",
  },
  image: {
    width: "150px",
    height: "150px",
    objectFit: "contain",
  },
  textContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
  },
  buttonContainer: {
    display: "flex",
    flexWrap: "wrap", // Allow buttons to stack on smaller screens
    gap: "10px",
  },
  buyButton: {
    padding: "10px",
    backgroundColor: "#F59F13",
    color: "white",
    borderRadius: "8px",
    border: "1px solid #ddd",
    cursor: "pointer",
  },
  viewButton: {
    padding: "10px",
    backgroundColor: "#f0f0f0",
    borderRadius: "8px",
    border: "1px solid #ddd",
    cursor: "pointer",
    color: "black",
  },
  contactBox: {


    borderRadius: "8px",
    textAlign: "center",
    marginTop: "20px", // Align below buttons on mobile
    right: "10px",
    top: "10px",
    border: "2px solid #ddd",
    color: "black",
    padding: "20px",
    borderRadius: "8px",
    width: "180px",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#ffffff",
  },
  contactText: {
    margin: 0,
    marginBottom: "10px",
  },
  contactButton: {
    padding: "10px",
    backgroundColor: "#F59F13",
    color: "white",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    marginRight : 10,
  },
  // Media queries
  "@media (max-width: 768px)": {
    orderDetailsHeader: {
      flexDirection: "column", // Stack items vertically on smaller screens
      alignItems: "center",
    },
    dropdownContent: {
      flexDirection: "column", // Stack image, text, and buttons vertically
      alignItems: "center",
    },
    imageContainer: {
      marginBottom: "10px", // Separate image from text on mobile
    },
    buttonContainer: {
      justifyContent: "center", // Center buttons on mobile
    },
    filterContainer2: {
      display: "flex",
      width: "78%", // Set the filter container width to 40%
      height: "auto",
      flexDirection: "column", // Stack buttons vertically
      padding: "10px",
      backgroundColor: "#FFFFFF",
      borderRadius: "8px",
      marginBottom: 40,
      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
      position: "relative",
    },

    contactBox: {


      borderRadius: "8px",
      textAlign: "center",
      marginTop: "20px", // Align below buttons on mobile
      right: "10px",
      top: "10px",
      border: "2px solid #ddd",
      color: "black",
      padding: "20px",
      borderRadius: "8px",
      width: "980px",
    }
  },

};

export default OrderHistory;
