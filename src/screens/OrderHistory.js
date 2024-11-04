import React, { useState, useEffect } from "react";

import axios from "axios";
import TaskBar from "../components/TaskBar";
import { auth } from "../firebaseConfig";
import { Flex, Rate } from 'antd'; // Import Flex and Rate from Ant Design
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import Lottie from "lottie-react";

import loadingAnimation from "../assets/Animation - 1730717782675.json"; 


const OrderHistory = () => {
  const [selectedFilter, setSelectedFilter] = useState("Orders");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState("Past 3 Months");
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [loading, setLoading] = useState(true);
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

    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchOrders(user);
      } else {
        setLoading(false);
      }
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      unsubscribe();
    };
  }, []);

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };

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
      rating: ratings[item.cartId] || 0 // Update cartItem with the corresponding rating
    }));

    try {
      console.log(updatedCartItems); // Log updated cart items with ratings
      console.log(orderId);
      console.log(auth.currentUser.uid);

      await axios.post('https://toolsbazaar-server-1036279390366.asia-south1.run.app/rateOrder', {
        ratings: updatedCartItems, // Send updated cartItems as ratings
        id: orderId, // Send order ID
        uid: auth.currentUser.uid,
      });
      console.log("Ratings submitted successfully");
    } catch (error) {
      console.error('Error submitting ratings:', error);
    }
  };
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <Lottie animationData={loadingAnimation} loop={true} />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <TaskBar />
      <div style={styles.header}>
        <div style={styles.orderCountBox}>
          <h1>Your Orders: <strong>{orders.length}</strong></h1>
        </div>
      </div>
      <div style={styles.filterContainer2}>
        <div style={styles.filterContainer}>
          <div style={styles.filterButtons}>
            <button
              style={selectedFilter === "Orders" ? { ...styles.filterButton, ...styles.activeFilterButton } : styles.filterButton}
              onClick={() => handleFilterChange("Orders")}
            >
              Orders
            </button>
            <button
              style={selectedFilter === "Not Shipped" ? { ...styles.filterButton, ...styles.activeFilterButton } : styles.filterButton}
              onClick={() => handleFilterChange("Not Shipped")}
            >
              Not Shipped
            </button>
            <button
              style={selectedFilter === "Cancelled Orders" ? { ...styles.filterButton, ...styles.activeFilterButton } : styles.filterButton}
              onClick={() => handleFilterChange("Cancelled Orders")}
            >
              Cancelled Orders
            </button>
          </div>
        </div>
      </div>
      <div>
        {orders.map((order) => (
          <div key={order.id} style={styles.orderCard} onClick={() => handleToggleDetails(order.id)}>
            <div style={styles.orderDetailsHeader}>
              <div style={styles.orderDetailsHeaderItem}>
                <div>Order Placed</div>
                <div>{new Date(order.timestamp).toLocaleDateString()}</div>
              </div>
              <div style={styles.orderDetailsHeaderItem}>
                <div>Total</div>
                <div>₹{order.totalAmount}</div>
              </div>
              <div style={styles.orderDetailsHeaderItem}>
                <div>Ship To</div>
                <div>Address here</div>
              </div>
              <div style={styles.orderDetailsHeaderItem}>
                <div>Delivered</div>
                <div>N/A</div>
              </div>
              <div style={styles.orderDetailsHeaderItem}>
                <div>Order #{order.id}</div>
                {expandedOrderId === order.id ? (
                  <div style={{ color: '#E9611E', marginTop: 10, }}>View Less <FaChevronUp /></div>
                ) : (
                  <div style={{ color: '#E9611E', marginTop: 10, }}>View More <FaChevronDown /></div>
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
                          onChange={(value) => handleRatingChange(item.cartId, value)} // Update rating per item
                          style={{ marginBottom: 30 }} // Proper inline style syntax
                          value={ratings[item.cartId] || 0} // Use stored rating or default to 0
                        />
                      </Flex>



                      <div style={styles.buttonContainer}>
                        <button style={styles.buyButton}>Buy It Again</button>
                        <button style={styles.viewButton}>View Your Item</button>
                      </div>
                    </div>
                    <div style={styles.contactBox}>
                      <p style={styles.contactText}>Send Us A Message</p>
                      <p style={styles.contactText}>
                        If you are not able to find your answer, please contact Us.
                      </p>
                      <button style={styles.contactButton}>Contact Us</button>
                    </div>
                  </div>
                ))}

                {/* Submit button for all ratings at the bottom of the order */}
                <button onClick={() => handleSubmitRatings(order.id)} style={styles.contactButton}>Submit All Ratings</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};


const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#f0f0f0",
    minHeight: "100vh",
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
    color: '#3E3D3DFF', // Set text color to white
  },
  activeFilterButton: {
    fontWeight: "bold",
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
    marginBottom: "10px",
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
  },
  orderDetailsDataItem2: {
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
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


  contactButton: {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#F59F13",
    cursor: "pointer",
    color: "white",
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
        width: "780px",
      },// Separate contact box on mobile
    },
  },

};

export default OrderHistory;