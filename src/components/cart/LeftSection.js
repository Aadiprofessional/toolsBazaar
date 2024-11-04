import React from "react";
import { useCart } from "../CartContext";
import CartItem from "./CartItem";
import { useNavigate } from "react-router-dom";
import ProductsGrid2 from "../ProductsGrid";
import axios from "axios";
import { useState } from "react";
import { auth } from "../../firebaseConfig";
import { toast } from "react-toastify";
import "./LeftSection.css"; // Import the CSS file

const LeftSection = () => {
  const { cart, updateCartItemQuantity, removeCartItem } = useCart();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); // Track loading state

  const itemCount = cart.length;
  const totalAmount = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  console.log(totalAmount);
  
  const handleUpdateQuantity = (id, quantity) => {
    updateCartItemQuantity(id, quantity);
  };

  const handleRemoveItem = (id) => {
    removeCartItem(id);
  };

  console.log(cart);

  const handleCheckout = async () => {
    const data = {};
    const useRewardPoints = false;
    const appliedCoupon = false;
    const cartItems = cart;

    setIsLoading(true);

    try {
      const userId = auth.currentUser.uid;

      const response = await axios.post(
        `https://toolsbazaar-server-1036279390366.asia-south1.run.app/checkout`,
        {
          totalAmount,
          data,
          useRewardPoints,
          appliedCoupon,
          cartItems,
          uid: userId,
        
        }
      );

      console.log("Checkout response:", response.data);

      if (response.data.cartError) {
        toast.error("Some items in your cart are out of stock. Please review your cart.");
      } else if (response.data.orderId) {
        console.log("Order placed successfully");
        toast.success("Order Placed Successfully");

        // Navigate to PlaceOrder screen
        navigate("/OrderPlaced", {
          state: {
            invoiceData: response.data.data,
            orderId: response.data.orderId,
          },
        });
      } else {
        console.error("Unexpected response structure");
        toast.error("Failed to process checkout. Please try again.");
      }
    } catch (error) {
      console.error("Error during checkout:", error);

      // Check if the error response contains cartError
      if (error.response && error.response.data && error.response.data.cartError) {
        toast.error("Some items in your cart are out of stock. Please review your cart.");
      } else {
        toast.error("An error occurred during checkout. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="left-section-custom">
      <div className="cart-summary-box-custom">
        <h2 className="cart-summary-title-custom">
          My Cart ({itemCount} item{itemCount > 1 ? "s" : ""})
        </h2>
      
      </div>

      <div className="cart-items-box-custom">
        <div className="cart-items">
          {cart.map((item, index) => (
            <CartItem
              key={index}
              onRemoveItem={() => handleRemoveItem(item.cartId)}
              onUpdateQuantity={handleUpdateQuantity}
              item={{
                cartId: item.cartId, // Make sure to pass cartId
                productName: item.productName,
                quantity: item.quantity,
                attribute1: item.attribute1,
                attribute2: item.attribute2,
                attribute3: item.attribute3,
                product: item.product,
              }}
            />
          ))}
        </div>
      </div>

      <div className="button-container-custom">
        <div className="button-wrapper-custom">
          <button className="continue-button-custom" onClick={() => navigate("/")}>
            Continue Shopping
          </button>
          <button
            className="place-order-button-custom"
            onClick={handleCheckout}
            disabled={isLoading} // Disable the button while loading
          >
            Place Order
          </button>
        </div>
      </div>
      <ProductsGrid2 />
      
    </div>
  );
};

export default LeftSection;