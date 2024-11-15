import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { doc, getDoc } from "firebase/firestore"; // Firestore methods
import { auth, firestore } from "../firebaseConfig"; // Make sure you import firestore correctly
import loginImage from "../assets/login.png";
import "react-toastify/dist/ReactToastify.css";
import "./RegisterForm.css";

const RegisterForm2 = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState(location.state?.email || "");
  const [companyName, setCompanyName] = useState("");
  const [gst, setGst] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [mainAddress, setMainAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAuthAndFirestore = async () => {
      if (!auth.currentUser.uid) {
        navigate("/login"); // Redirect to login if not authenticated
        return;
      }
  
      // Use doc() to refer to the document within the "users" collection
      const userDocRef = doc(firestore, "users", auth.currentUser.uid); // Make sure `firestore` is correctly imported and initialized
  
      try {
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          navigate("/landing"); // Redirect to landing if user data exists in Firestore
        }
      } catch (error) {
        console.error("Error checking user data:", error);
      }
    };

    checkAuthAndFirestore();

    // Warn if leaving without completing form
    const handleBeforeUnload = (e) => {
      if (!phoneNumber || !companyName || !ownerName || !mainAddress || !city || !state || !pincode) {
        e.preventDefault();
        e.returnValue = ""; // Prompt user with confirmation
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [navigate, phoneNumber, companyName, ownerName, mainAddress, city, state, pincode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        "https://toolsbazaar-server-1036279390366.asia-south1.run.app/registerGoogle",
        {
          uid: auth.currentUser?.uid,
          phoneNumber: `91${phoneNumber}`,
          email,
          address: `${mainAddress}, ${city}, ${state}, ${pincode}`,
          ownerName,
        }
      );

      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("phoneNumber", phoneNumber);
      toast.success("Details saved successfully!");
      navigate("/landing");
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 10) {
      setPhoneNumber(value);
    }
  };

  return (
    <div className="register-container">

      <div className="register-left">
        <img src={loginImage} alt="Login" className="login-image" />
      </div>
      <div className="register-right">
        <h2 className="register-title">Register</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="text"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            placeholder="Enter Your Name"
            className="register-input"
            disabled={loading}
            required
          />
          <input
            type="tel"
            value={phoneNumber}
            onChange={handleChange}
            placeholder="Enter Your Phone Number"
            className="register-input"
            maxLength={10}
            minLength={10}
            disabled={loading}
            required
          />
          <input
            type="email"
            value={email}
            placeholder="Enter Your Email"
            className="register-input"
            disabled={true}
            required
          />
          <input
            type="text"
            value={mainAddress}
            onChange={(e) => setMainAddress(e.target.value)}
            placeholder="Enter Main Address"
            className="register-input"
            disabled={loading}
            required
          />
          <input
            type="text"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            placeholder="Enter Pincode"
            className="register-input"
            disabled={loading}
            minLength={6}
            maxLength={6}
            required
          />
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter City"
            className="register-input"
            disabled={loading}
            required
          />
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="Enter State"
            className="register-input"
            disabled={loading}
            required
          />
          <button type="submit" className="register-button" disabled={loading}>
            {loading ? "Processing..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm2;
