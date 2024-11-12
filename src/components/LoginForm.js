import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./LoginForm.css";
import loginImage from "../assets/login.png";
import loginTopImage from "../assets/login_top.png";
import loginBottomImage from "../assets/login_bottom.png";
import googleIcon from "../assets/google.png"; // Import Google icon image
import axios from "axios";
import { signInWithCustomToken, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { getFirestore, doc, getDoc } from "firebase/firestore";  // Add this line
import { firestore } from "../firebaseConfig"; // Adjust the path to where your firebaseConfig.js is located

const OTP_LENGTH = 6;
const provider = new GoogleAuthProvider();

const LoginForm = ({ onLogin }) => {
  const [inputValue, setInputValue] = useState("");
  const [isPhone, setIsPhone] = useState(false);
  const [isEmail, setIsEmail] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpBlocks, setOtpBlocks] = useState(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    const phoneRegex = /^\d{10}$/;
    setIsPhone(phoneRegex.test(value));

    if (value.includes("@")) {
      setIsEmail(true);
      setIsPhone(false);
    } else {
      setIsEmail(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
  
      // Check if the user exists in the Firestore database
      const userDocRef = doc(firestore, "users", user.uid);  // Reference the user's document
      const userDoc = await getDoc(userDocRef);  // Get the user's document
  
      if (userDoc.exists()) {
        // User exists, navigate to home
        navigate("/");
      } else {
        // User does not exist, navigate to register page with email in state
        navigate("/registerGoogle", {
          state: { email: user.email },  // Pass email to the register page
        });
      }
  
      // Toast notification on successful Google sign-in
      toast.success("Login with Google successful!");
  
      // Trigger login action in parent component
      onLogin({ email: user.email });
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error("Failed to sign in with Google. Please try again.");
    }
  };
  
  

  const handleOtpChange = (e, index) => {
    const newOtp = e.target.value;
    if (/^[0-9]?$/.test(newOtp) || e.nativeEvent.inputType === "deleteContentBackward") {
      const updatedOtpBlocks = [...otpBlocks];
      if (e.nativeEvent.inputType === "deleteContentBackward") {
        updatedOtpBlocks[index] = "";
        if (index > 0) {
          document.getElementById(`otp-block-${index - 1}`).focus();
        }
      } else {
        updatedOtpBlocks[index] = newOtp;
        setOtp(updatedOtpBlocks.join(""));
        if (index < OTP_LENGTH - 1 && newOtp) {
          document.getElementById(`otp-block-${index + 1}`).focus();
        }
      }
      setOtpBlocks(updatedOtpBlocks);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const phoneNumber = `91${inputValue.trim()}`;
    try {
      const otpResponse = await axios.get(`https://toolsbazaar-server-1036279390366.asia-south1.run.app/sendOtp?phoneNumber=${phoneNumber}`);
      const receivedOrderId = otpResponse.data.orderId;
      setOrderId(receivedOrderId);
      setOtpSent(true);
      toast.success("OTP sent successfully.");
    } catch (error) {
      if (error.response.data.error === "User doesn't exist.") {
        toast.error("User not registered. Kindly register first.");
      } else {
        toast.error("Failed to send OTP. Please try again.");
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const phoneNumber = `91${inputValue.trim()}`;
    try {
      const response = await axios.get(`https://toolsbazaar-server-1036279390366.asia-south1.run.app/verifyOtp?phoneNumber=${phoneNumber}&orderId=${orderId}&otp=${otp}`);
      if (response.data.isOTPVerified) {
        const tokenResponse = await axios.get(`https://toolsbazaar-server-1036279390366.asia-south1.run.app/getCustomToken?phoneNumber=${phoneNumber}`);
        const tokenData = tokenResponse.data;
        if (tokenData.token) {
          signInWithCustomToken(auth, tokenData.token)
            .then((userCredential) => {
              const user = userCredential.user;
              toast.success("Login successful!");
              onLogin({ phoneNumber });
              localStorage.setItem("isAuthenticated", "true");
              navigate("/");
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
            });
        } else {
          throw new Error("Failed to get custom token");
        }
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error(`Failed to verify OTP. Please try again.\nError: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    const phoneNumber = `91${inputValue.trim()}`;
    try {
      const response = await axios.get(`https://toolsbazaar-server-1036279390366.asia-south1.run.app/sendOtp?phoneNumber=${phoneNumber}`);
      if (response.status !== 200) throw new Error("Failed to resend OTP");
      toast.success("OTP resent successfully.");
    } catch (error) {
      toast.error(`Failed to resend OTP. Please try again.\nError: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
   
      <div className="login-left">
        <img src={loginImage} alt="Login" className="login-image" />
      </div>
      <div className="login-right">
        <h2 className="login-title">Login/Register</h2>
        <img src={loginTopImage} alt="Login Top" className="login-top-image" />
        <form onSubmit={isPhone && otpSent ? handleOtpSubmit : handleSubmit} className="login-form">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Enter Mobile Number Or Email"
            className="login-input"
            disabled={loading}
          />

          {isPhone && otpSent && (
            <>
              <div className="otp-input-container">
                {otpBlocks.map((block, index) => (
                  <input
                    key={index}
                    id={`otp-block-${index}`}
                    type="text"
                    value={block}
                    onChange={(e) => handleOtpChange(e, index)}
                    maxLength="1"
                    className="otp-block"
                    disabled={loading}
                  />
                ))}
              </div>
              <button type="button" onClick={handleResendOtp} className="resend-otp-button" disabled={loading}>
                {loading ? "Resending..." : "Resend OTP"}
              </button>
            </>
          )}

          {isEmail && (
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Your Password"
              className="login-input"
              disabled={loading}
            />
          )}

          <button type="submit" className="continue-button" disabled={loading}>
            {loading ? "Loading..." : isPhone ? (otpSent ? "Verify OTP" : "Get OTP") : "Continue"}
          </button>

          <button type="button" className="google-button" onClick={handleGoogleSignIn} disabled={loading}>
            <img src={googleIcon} alt="Google icon" className="google-icon" />
            Continue with Google
          </button>
          
          <p className="register-link">
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
