import React, { useState } from "react";
import { useCart } from "../components/CartContext"; // Import the custom hook
import LeftSection from "../components/cart/LeftSection";
import RightSection from "../components/cart/RightSection";
import EmptyCartScreen from "../components/cart/EmptyCartScreen"; // Import the new component
import TaskBar from "../components/TaskBar";
import Footer from "../components/Footer";

// CartScreen.js
const CartScreen = () => {
  const { cart } = useCart();
  const [selectedAddress, setSelectedAddress] = useState(null); // Manage selected address in CartScreen

  const handleAddressSelect = (address) => {
    setSelectedAddress(address); // Update address when selected
    console.log(address); // You can log or use it further
  };

  const gstRate = 0.12;

  const totalAmount = cart.reduce((acc, item) => {
    const discountedPrice = item.product.price - (item.product.price * (item.product.additionalDiscount / 100));
    const totalPrice = discountedPrice * item.quantity;
    const gstAmount = totalPrice * gstRate;
    const finalPrice = totalPrice + gstAmount;
    return acc + finalPrice;
  }, 0);

  if (cart.length === 0) {
    return <EmptyCartScreen />;
  }

  return (
    <div>
      <div style={styles.container}>
        <TaskBar />
        <LeftSection cart={cart}
         address={selectedAddress}/>
        <RightSection
          totalAmount={totalAmount}
          selectedAddress={selectedAddress} // Pass the selected address here
          onAddressSelect={handleAddressSelect} // Pass the callback to update selected address
        />
      </div>
      <Footer />
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "space-between",
    padding: "20px",
    backgroundColor: "#F3F3F3",
  },
};

export default CartScreen;
