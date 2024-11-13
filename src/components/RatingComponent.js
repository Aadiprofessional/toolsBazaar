import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../firebaseConfig'; // Adjust the import to your Firebase config location

const RatingComponent = ({ productId, hasRated }) => {
  const [rating, setRating] = useState(null);
  const [uid, setUid] = useState(null);

  // Get the current user's UID
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUid(currentUser.uid);
    }
  }, []);

  const handleRating = async (selectedRating) => {
    setRating(selectedRating);
    if (!uid) {
      console.error('User is not logged in');
      return;
    }

    try {
        console.log(productId);
        console.log(uid);
        console.log(selectedRating);
        
        
        // Call /rateOrder API
      await axios.post('https://toolsbazaar-server-1036279390366.asia-south1.run.app/rateOrder', {
        
        productId,
        rating: selectedRating,
        uid, // Send the UID along with the rating and product ID
      });
    } catch (error) {
      console.error('Error rating product:', error);
    }
  };

  if (hasRated) {
    return <div style={{ color: 'green' }}>Thank you for rating!</div>;
  }

  return (
    <div style={{ display: 'flex' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => handleRating(star)}
          style={{
            fontSize: '24px',
            fontFamily: "'Outfit', sans-serif", 
            cursor: 'pointer',
            color: star <= rating ? '#FFD700' : '#ccc', // Selected star color vs unselected star color
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default RatingComponent;
