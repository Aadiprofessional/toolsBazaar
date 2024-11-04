import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, firestore } from "../../firebaseConfig"; // Import Firestore and auth
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const DropdownMenu = ({ onClose }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [userName, setUserName] = useState("");
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserName = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = doc(firestore, `users/${user.uid}`);
        const docSnap = await getDoc(userDoc);
        if (docSnap.exists()) {
          let fullName = docSnap.data().name || "User";
          // Split the name by space and take the first part (first name)
          let firstName = fullName.split(" ")[0];
          // Limit the first name to 12 characters
          if (firstName.length > 12) {
            firstName = firstName.substring(0, 12);
          }
          setUserName(firstName);
        }
      }
    };
  
    fetchUserName();
  }, []);
  

  const handleItemClick = (item, path) => {
    setSelectedItem(item);
    setActiveItem(item);
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div style={styles.dropdownMenu} ref={dropdownRef}>
      <div style={styles.accountTitle}>Hi {userName}!</div>
      <div style={styles.menuItems}>
        <div
          style={
            activeItem === "My Profile"
              ? styles.menuItemActive
              : styles.menuItem
          }
          onClick={() => handleItemClick("My Profile", "/profile")}
        >
          My Profile
        </div>
        <div
          style={
            activeItem === "My Orders" ? styles.menuItemActive : styles.menuItem
          }
          onClick={() => handleItemClick("My Orders", "/orders")}
        >
          My Orders
        </div>

        {/* <div
          style={
            activeItem === "My Purchase List"
              ? styles.menuItemActive
              : styles.menuItem
          }
          onClick={() => handleItemClick("My Purchase List", "/purchase-list")}
        >
          My Purchase List
        </div> */}
        <div
          style={
            activeItem === "Contact Us"
              ? styles.menuItemActive
              : styles.menuItem
          }
          onClick={() => handleItemClick("Contact Us", "/contact")}
        >
          Contact Us
        </div>
        <div
          style={
            activeItem === "Address Book"
              ? styles.menuItemActive
              : styles.menuItem
          }
          onClick={() => handleItemClick("Address Book", "/Address")}
        >
          Address Book
        </div>
      
        {/* <div
          style={
            activeItem === "Manage Password"
              ? styles.menuItemActive
              : styles.menuItem
          }
          onClick={() => handleItemClick("Manage Password", "/manage-password")}
        >
          
          Manage Password
        </div> */}
        <div
          style={styles.menuItem}
          onClick={handleLogout}
        >
          Logout
        </div>
      </div>
    </div>
  );
};

const styles = {
  dropdownMenu: {
    position: "absolute",
    top: "90px",
    right: "20px",
    backgroundColor: "#ffffff",
    borderRadius: "4px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    width: "200px",
    zIndex: 1000,
    display: "flex",
    flexDirection: "column",
    cursor: "pointer",
  },
  accountTitle: {
    padding: "10px",
    fontWeight: "bold",
    backgroundColor: "#FFFFFF",
    color: "#4D4D4D",
    textAlign: "left",
    borderRadius: "4px 4px 0 0",
  },
  menuItems: {
    display: "flex",
    flexDirection: "column",
  },
  menuItem: {
    padding: "10px",
    cursor: "pointer",
    borderBottom: "1px solid #ddd",
    backgroundColor: "#FFFFFF",
    color: "#4D4D4D",
    transition: "background-color 0.3s, color 0.3s",
  },
  menuItemActive: {
    padding: "10px",
    cursor: "pointer",
    borderBottom: "1px solid #ddd",
    backgroundColor: "#E9611E",
    color: "#FFFFFF",
    transition: "background-color 0.3s, color 0.3s",
  },
};

export default DropdownMenu;
