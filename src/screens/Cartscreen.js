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
  const [selectedCoupon , setSelectedCoupon] = useState(null)
  const [totalAmount, setTotalAmount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
  };

  const handleCouponChange = (coupon) => {
    setSelectedCoupon(coupon);
    console.log("coupon",coupon);
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
      <div
        style={{
          ...styles.container,
          ...(window.innerWidth <= 768 ? styles.containerMobile : {}),
        }}
      >
        <TaskBar />
        <LeftSection
          cart={cart}
          totalAmount={setTotalAmount}
          address={selectedAddress}
          finalAmount={finalAmount}
          coupon={selectedCoupon}
        />
        <RightSection
          cart={cart}
          totalAmount={totalAmount}
          onPriceChange={handlePriceChange}
          onAddressChange={handleAddressSelect}
          onCouponChange={handleCouponChange} // Pass the coupon handler here
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
    flexWrap: "wrap",
  },
  containerMobile: {
    flexDirection: "column", // Stacks items vertically on mobile
  },
};

export default CartScreen;
