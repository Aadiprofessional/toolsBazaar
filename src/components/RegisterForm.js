import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import "./RegisterForm.css";
import loginImage from "../assets/login.png";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "../firebaseConfig";

const OTP_LENGTH = 6;

const RegisterForm = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [gst, setGst] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [mainAddress, setMainAddress] = useState("");
  const [optionalAddress, setOptionalAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [orderId, setOrderId] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const otpRefs = useRef([]);

  const navigate = useNavigate();

  // Automatically focus the first OTP input box when the OTP block appears
  useEffect(() => {
    if (otpSent && otpRefs.current[0]) {
      otpRefs.current[0].focus();
    }
  }, [otpSent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const otpResponse = await axios.get(
        `https://toolsbazaar-server-1036279390366.asia-south1.run.app/sendRegisterOtp?phoneNumber=91${phoneNumber}`
      );

      const receivedOrderId = otpResponse.data.orderId;
      setOrderId(receivedOrderId);
      setOtpSent(true);

      toast.success("OTP sent successfully.");
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.get(
        `https://toolsbazaar-server-1036279390366.asia-south1.run.app/verifyOtp?phoneNumber=91${phoneNumber}&orderId=${orderId}&otp=${otp.join("")}`
      );
      if (response.data.isOTPVerified) {
        const tokenResponse = await axios.post(
          "https://toolsbazaar-server-1036279390366.asia-south1.run.app/getRegisterCustomToken",
          {
            phoneNumber: "91" + phoneNumber,
            companyName: "1212313",
            gst: "asdasdsd",
            email,
            address: `${mainAddress}, ${city}, ${state}, ${pincode}`,
            ownerName,
            orderId,
          }
        );
        const { token } = tokenResponse.data;
        if (token) {
          await signInWithCustomToken(auth, token);
          localStorage.setItem("loggedIn", "true");
          localStorage.setItem("phoneNumber", phoneNumber);
          toast.success("Phone number verified!");
          navigate("/landing");
        } else {
          throw new Error("Failed to receive custom token");
        }
      } else {
        toast.error("Invalid OTP. Please enter the correct OTP.");
      }
    } catch (error) {
      console.error("Error confirming OTP:", error);
      toast.error("Failed to verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e, index) => {
    const newOtp = e.target.value;

    if (/^[0-9]?$/.test(newOtp) || e.nativeEvent.inputType === "deleteContentBackward") {
      const updatedOtp = [...otp];

      if (e.nativeEvent.inputType === "deleteContentBackward") {
        // Handle backspace
        updatedOtp[index] = "";
        if (index > 0) {
          otpRefs.current[index - 1].focus();
        }
      } else {
        // Handle new input
        updatedOtp[index] = newOtp;
        setOtp(updatedOtp);
        if (index < OTP_LENGTH - 1 && newOtp) {
          otpRefs.current[index + 1].focus();
        }
      }

      setOtp(updatedOtp);
    }
  };

  const resendOTP = async () => {
    if (!orderId) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `https://toolsbazaar-server-1036279390366.asia-south1.run.app/sendRegisterOtp?phoneNumber=91${phoneNumber}`
      );
      if (response.status !== 200) throw new Error("Failed to resend OTP");
      toast.success("OTP resent successfully.");
    } catch (error) {
      toast.error("Failed to resend OTP. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    // Allow only digits and limit length to 10
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
      <form
        onSubmit={otpSent ? handleOtpSubmit : handleSubmit}
        className="register-form"
      >
          <input
            type="text"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            placeholder="Enter Your Name"
            className="register-input"
            disabled={loading || otpSent}
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
            disabled={loading || otpSent}
            required
          />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Your Email"
            className="register-input"
            disabled={loading || otpSent}
            required
          />


          <input
            type="text"
            value={mainAddress}
            onChange={(e) => setMainAddress(e.target.value)}
            placeholder="Enter Main Address"
            className="register-input"
            disabled={loading || otpSent}
            required
          />
          <input
            type="text"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            placeholder="Enter Pincode"
            className="register-input"
            disabled={loading || otpSent}
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
            disabled={loading || otpSent}
            required
          />
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="Enter State"
            className="register-input"
            disabled={loading || otpSent}
            required
          />

          {otpSent && (
            <div className="otp-input-container">
              {otp.map((value, index) => (
                <input
                  key={index}
                  type="text"
                  value={value}
                  onChange={(e) => handleOtpChange(e, index)}
                  maxLength="1"
                  className="otp-block"
                  ref={(el) => (otpRefs.current[index] = el)}
                  disabled={loading}
                  required
                />
              ))}
            </div>
          )}

          <button type="submit" className="register-button" disabled={loading}>
            {loading ? "Processing..." : otpSent ? "Verify OTP" : "Send OTP"}
          </button>

          {otpSent && (
            <button
              type="button"
              className="resend-otp-button"
              onClick={resendOTP}
              disabled={loading}
            >
              {loading ? "Resending..." : "Resend OTP"}
            </button>
          )}
        </form>
      </div>
    </div>

  );
};

export default RegisterForm;
