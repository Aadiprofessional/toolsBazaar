import React, { useState } from "react";
import { useCart } from "../CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { auth } from "../../firebaseConfig";
import { toast } from "react-toastify";
import ProductsGrid5 from "../ProductsGrid copy 3";
import remove from '../../assets/trash.png';
import './LeftSection.css';
import './CartItem.css'
import ProductsGrid2 from "../ProductsGrid";
import ProductsGrid3 from "../ProductsGrid copy";

const LeftSection = () => {
  const { cart, updateCartItemQuantity, removeCartItem } = useCart();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const itemCount = cart.length;
  const totalAmount = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const handleUpdateQuantity = (id, quantity) => {
    updateCartItemQuantity(id, quantity);
  };

  const handleRemoveItem = (id) => {
    removeCartItem(id);
  };

  const handleCheckout = async () => {
    const data = {};
    const useRewardPoints = false;
    const appliedCoupon = false;
    const cartItems = cart;
    const address = {};

    if (!address) {
      toast.error("Please select an address before proceeding to checkout.");
      return;
    }

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
          address: address,
        }
      );

      if (response.data.cartError) {
        toast.error("Some items in your cart are out of stock. Please review your cart.");
      } else if (response.data.orderId) {
        toast.success("Order Placed Successfully");
        navigate("/OrderPlaced", {
          state: {
            invoiceData: response.data.data,
            orderId: response.data.orderId,
            cartItems, totalAmount
          },
        });
      } else {
        toast.error("Failed to process checkout. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred during checkout. Please try again.");
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
        <button
            className="place-order-button-custom"
            onClick={handleCheckout}
            disabled={isLoading}
          >
            Place Order
        </button>
      </div>

      <div className="cart-items-box-custom">
        <div className="cart-items">
          {cart.map((item, index) => {
            const gstRate = item.product.gst ? item.product.gst / 100 : 0;
            const discountedPrice = item.product.price 
              ? item.product.price - (item.product.price * (item.product.additionalDiscount / 100)) 
              : 0;
            const totalPrice = discountedPrice * item.quantity;
            const gstAmount = totalPrice * gstRate;
            const finalPrice = totalPrice + gstAmount;

            const handleIncreaseQuantity = () => {
              if (item.quantity < item.product.inventory) {
                const newQuantity = item.quantity + 1;
                handleUpdateQuantity(item.cartId, newQuantity);
              } else {
                toast.info(`Only ${item.product.inventory} items available in stock.`);
              }
            };

            const handleDecreaseQuantity = () => {
              if (item.quantity > item.product.minCartValue) {
                const newQuantity = item.quantity - 1;
                handleUpdateQuantity(item.cartId, newQuantity);
              } else {
                toast.info(`Minimum quantity is ${item.product.minCartValue}.`);
              }
            };

            const handleRemove = () => {
              handleRemoveItem(item.cartId);
              toast.info("Removing item from cart");
            };

            return (
              <div key={index} className="cart-item">
                <div className="left-part">
                  <h3 className="item-name">{item.productName || "Product Name"}</h3>
                  <div className="left-part-content">
                    <img
                      src={item.product.images ? item.product.images[0] : ""}
                      alt={item.productName || "Product Image"}
                      className="item-image"
                    />
                    <div className="item-details">
                      <p className="detail-text2">
                        <strong className="detail-title">Description:</strong>{" "}
                        {item.product.description ? item.product.description.substring(0, 50) + '...' : 'N/A'}
                      </p>
                      <p className="detail-text">
                        <strong className="detail-title">{item.attribute1 || "Attribute"}:</strong>{" "}
                        {item.selectedAttribute1 || "N/A"}
                      </p>
                      <p className="detail-text">
                        <strong className="detail-title">{item.attribute2}:</strong>{" "}
                        {item.selectedAttribute2}
                      </p>
                      <p className="detail-text">
                        <strong className="detail-title">{item.attribute3}:</strong>{" "}
                        {item.selectedAttribute3}
                      </p>
                      <button onClick={handleRemove} className="remove-button">
                        <span className="remove-text">Remove</span>
                        <img src={remove} alt="Remove" className="remove-icon" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="right-part">
                  <div className="quantity-control">
                    <button
                        className="quantity-buttonCart"
                        onClick={handleDecreaseQuantity}
                        disabled={item.quantity <= item.product.minCartValue}
                    >
                        -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button className="quantity-buttonCart" onClick={handleIncreaseQuantity}>
                        +
                    </button>
                  </div>

                  <div className="right-part-calculations">
                    <p className="right-part-text">
                      <strong className="detail-title">Price:</strong> 
                      {totalPrice.toLocaleString("en-IN", {
                        maximumFractionDigits: 0,
                        style: 'currency',
                        currency: 'INR',
                      })}
                       <button className="details-button">Details</button>
                    </p>
                    <p className="right-part-text">
                      <strong className="detail-title">GST @ {item.product.gst}%:</strong> 
                      {gstAmount.toLocaleString("en-IN", {
                        maximumFractionDigits: 0,
                        style: 'currency',
                        currency: 'INR',
                      })}
                    </p>
                    <p className="final-price">
                      <strong className="detail-title">Final Price:</strong> 
                      {finalPrice.toLocaleString("en-IN", {
                        maximumFractionDigits: 0,
                        style: 'currency',
                        currency: 'INR',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="frequently-bought">Featured Products</p>
      <ProductsGrid3 />
    </div>
  );
};

export default LeftSection;
