import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import axios from "axios";
import {
  getFirestore,
  collection,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { auth, checkAuth } from "../firebaseConfig"; // Correct import

const firestore = getFirestore();
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Listen for authentication state changes
  useEffect(() => {
    checkAuth((newUser) => {
      if (newUser) {
        setUser(newUser);
      } else {
        setUser(null);
        setCart([]); // Clear cart on logout
      }
    });
  }, []);
  // Fetch cart items from Firestore whenever the user changes
  useEffect(() => {
    if (user) {
      const unsubscribe = onSnapshot(
        collection(firestore, "users", user.uid, "cart"),
        (snapshot) => {
          const newItems = snapshot.docs.map((doc) => ({
            cartId: doc.id,
            ...doc.data(),
          }));
          setCart(newItems);
        }
      );

      return () => unsubscribe(); // Cleanup the listener
    }
  }, [user]);

  // Add item to the cart
  
  const addToCart = async (
    product,
    quantity,
    productName,
    attribute1,
    attribute2,
    attribute3,
    mainId,
    categoryId,
    productId,
    attribute1Id,
    attribute2Id,
    attribute3Id
  ) => {
    setLoading(true);
    console.log(productId);
    if (!user) {
      toast.error("Please log in to add items to the cart.");
      navigate("/login");
      setLoading(false);
      return;
    }

    const item = {
      product,
      quantity,
      productName,
      attribute1,
      attribute2,
      attribute3,
      mainId,
      categoryId,
      productId,
      attribute1Id,
      attribute2Id,
      attribute3Id
    };

    try {
      const response = await axios.post(
        `https://toolsbazaar-server-1036279390366.asia-south1.run.app/addItem`,
        { uid: user.uid, item }
      );

      if (response.data.success) {
        toast.success("Item added to cart successfully!");
      } 
    } catch (error) {
      toast.error(`Error adding item to cart: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // CartProvider
  const updateCartItemQuantity = async (cartId, newQuantity) => {
    setLoading(true);
    try {
      if (user) {
        const cartRef = doc(firestore, "users", user.uid, "cart", cartId);

        if (newQuantity < 1) {
          await deleteDoc(cartRef);
          toast.success("Item removed from cart successfully");
        } else {
          await updateDoc(cartRef, { quantity: newQuantity });
          toast.success("Item quantity updated");
        }
      }
    } catch (error) {
      toast.error(`Error updating cart item: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const removeCartItem = async (cartId) => {
    setLoading(true);
    try {
      if (user) {
        const response = await axios.post(
          `https://toolsbazaar-server-1036279390366.asia-south1.run.app/removeItem`,
          { uid: user.uid, id: cartId }
        );

        if (response.data.success) {
          toast.success("Item removed from cart successfully");
        } else {
          toast.error("Failed to remove item from cart");
        }
      }
    } catch (error) {
      toast.error(`Error removing item from cart: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateCartItemQuantity,
        removeCartItem,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
