import React, { useState } from "react";
import { useCart } from "../components/CartContext";
import LeftSection from "../components/cart/LeftSection";
import RightSection from "../components/cart/RightSection";
import EmptyCartScreen from "../components/cart/EmptyCartScreen";
import TaskBar from "../components/TaskBar";
import Footer from "../components/Footer";

const CartScreen = () => {
  const { cart } = useCart();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
  };

  const handlePriceChange = (price) => {
    setFinalAmount(price);
    console.log("price", price);
  };

  if (cart.length === 0) {
    return <EmptyCartScreen />;
  }

  return (
    <div>
      <div style={styles.container}>
        <TaskBar />
        <LeftSection
          cart={cart}
          totalAmount={setTotalAmount}
          address={selectedAddress}
          finalAmount={finalAmount} // Pass finalAmount as a value
        />
        <RightSection
          totalAmount={totalAmount}
          onPriceChange={handlePriceChange}
          onAddressChange={handleAddressSelect}
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
