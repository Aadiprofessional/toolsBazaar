import React from "react";
import { useCart } from "../components/CartContext"; // Import the custom hook
import LeftSection from "../components/cart/LeftSection";
import RightSection from "../components/cart/RightSection";
import EmptyCartScreen from "../components/cart/EmptyCartScreen"; // Import the new component
import TaskBar from "../components/TaskBar";
import Footer from "../components/Footer";


const CartScreen = () => {
  const { cart } = useCart(); // Get cart from context
  const gstRate = 0.12; // Assuming 12% GST

  // Calculate the total amount including discounted price and GST for all items in the cart
  const totalAmount = cart.reduce((acc, item) => {
    const discountedPrice = item.product.price - (item.product.price * (item.product.additionalDiscount / 100)); // Discounted price
    const totalPrice = discountedPrice * item.quantity; // Total price for the quantity
    const gstAmount = totalPrice * gstRate; // GST amount
    const finalPrice = totalPrice + gstAmount; // Final price including GST

    return acc + finalPrice; // Add to the accumulated total
  }, 0);

  // If the cart is empty, use the EmptyCartScreen component
  if (cart.length === 0) {
    return <EmptyCartScreen />;
  }

  return (
    <div>

      <div style={styles.container}>
        <TaskBar />
        <LeftSection cart={cart} />
        <RightSection totalAmount={totalAmount} />
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
