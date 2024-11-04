import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import './CartItem.css'; 
import remove from '../../assets/trash.png';

const CartItem = ({ item, onRemoveItem, onUpdateQuantity }) => {
  const gstRate = 0.12;
  const [quantity, setQuantity] = useState(parseInt(item.quantity));
  const [isExpanded, setIsExpanded] = useState(false);

  const discountedPrice = item.product.price - (item.product.price * (item.product.additionalDiscount / 100));
  const totalPrice = discountedPrice * quantity;
  const gstAmount = totalPrice * gstRate;
  const finalPrice = totalPrice + gstAmount;
  
  const increaseQuantity = () => {
    if (quantity < item.product.inventory) { 
      const newQuantity = Number(quantity) + 1;
      setQuantity(newQuantity);
      onUpdateQuantity(item.cartId, newQuantity);
    } else {
      toast.info(`Only ${item.product.inventory} items available in stock. Cannot increase quantity further.`);
    }
  };
  
  const handleDecrease = () => {
    if (quantity > item.product.minCartValue) {
      console.log(item);
      const newQuantity = Number(quantity) - 1;
      setQuantity(newQuantity);
      onUpdateQuantity(item.cartId, newQuantity); 
    } else {
      toast.info(`Minimum quantity is ${item.product.minCartValue}. Cannot decrease quantity further.`);
    }
  };

  const handleRemoveItem = () => {
    onRemoveItem(item.cartId);
    toast.info("Removing item from cart");
  };

  const handleToggleExpand = () => {
    setIsExpanded(prevState => !prevState);
  };

  const descriptionLimit = 50;
  const truncatedDescription = item.product.description.length > descriptionLimit
    ? `${item.product.description.substring(0, descriptionLimit)}...`
    : item.product.description;

  const formatDescription = (description) => {
    return description
      .match(/.{1,30}/g)
      .map((line, index) => <p key={index}>{line}</p>);
  };

  return (
    <div className="cart-item">
      <ToastContainer />
      <div className="left-part">
        <h3 className="item-name">{item.productName}</h3>
        <div className="left-part-content">
          <img
            src={item.product.images[0]} 
            alt={item.productName}
            className="item-image"
          />
          <div className="item-details">
            <p className="detail-text2">
              <strong className="detail-title">Description:</strong>{" "}
              {formatDescription(truncatedDescription)}
            </p>
            <p className="detail-text">
              <strong className="detail-title">{item.attribute1}:</strong>{" "}
              {item.selectedAttribute1}
            </p>
            <p className="detail-text">
              <strong className="detail-title">{item.attribute2}:</strong>{" "}
              {item.selectedAttribute2}
            </p>
            <p className="detail-text">
              <strong className="detail-title">{item.attribute3}:</strong>{" "}
              {item.selectedAttribute3}
            </p>
            <button onClick={handleRemoveItem} className="remove-button">
              <span className="remove-text">Remove</span>
              <img src={remove} alt="Remove" className="remove-icon" />
            </button>
          </div>
        </div>
      </div>

      <div className={`right-part ${isExpanded ? 'expanded' : ''}`} onClick={handleToggleExpand}>
    <div className="quantity-control">
        <button
            className="quantity-buttonCart"
            onClick={handleDecrease}
            disabled={quantity <= item.product.minCartValue}
        >
            -
        </button>
        <span className="quantity">{quantity}</span>
        <button className="quantity-buttonCart" onClick={increaseQuantity}>
            +
        </button>
    </div>
    <p className="price-text">
        <strong>Rs.{discountedPrice}</strong>
        <button className="details-button">Details</button>
    </p>

    <div className="right-part-calculations">
        <p className="right-part-text">
            <strong className="detail-title">Price:</strong> ₹{totalPrice}
        </p>
        <p className="right-part-text">
            <strong className="detail-title">GST @ 12%:</strong> ₹{gstAmount.toFixed(2)}
        </p>
        <p className="final-price">
            <strong className="detail-title">Final Price:</strong> ₹{finalPrice.toFixed(2)}
        </p>
    </div>
</div>
</div>
  );
};

export default CartItem;
