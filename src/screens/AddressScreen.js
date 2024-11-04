import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../firebaseConfig';  // Firebase authentication
import { onAuthStateChanged } from 'firebase/auth';  // Importing the listener for auth changes
import TaskBar from '../components/TaskBar';
import Footer from '../components/Footer';
import Toast from '../components/Toast'; // Assuming you have a Toast component

const API_BASE_URL = 'https://toolsbazaar-server-1036279390366.asia-south1.run.app';

const AddressScreen = () => {
  const [addresses, setAddresses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editAddressId, setEditAddressId] = useState(null);
  const [newAddress, setNewAddress] = useState({ phoneNumber: '', address: '', ownerName: '' });
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);  // Handle auth user state
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    // Listen for changes to the user's auth state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        fetchAddresses(user.uid);  // Fetch addresses if user is authenticated
      } else {
        setError('User not authenticated. Please log in.');
      }
      setLoading(false);  // Remove loading state once the auth state is resolved
    });

    // Cleanup the listener when the component is unmounted
    return () => unsubscribe();
  }, []);

  const fetchAddresses = async (uid) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/getAddress`, { uid });
      setAddresses(response.data);
    } catch (error) {
      setError('Error fetching addresses.');
    }
  };

  const handleAddAddress = async () => {
    if (validateFields()) {
      try {
        await axios.post(`${API_BASE_URL}/addAddress`, {
          uid: currentUser.uid,
          ...newAddress,
        });
        resetForm();
        fetchAddresses(currentUser.uid);
      } catch (error) {
        setError('Error adding address.');
      }
    }
  };

  const handleSaveAddress = async () => {
    if (validateFields()) {
      try {
        await axios.post(`${API_BASE_URL}/saveAddress`, {
          uid: currentUser.uid,
          addressId: editAddressId,
          ...newAddress,
        });
        resetForm();
        fetchAddresses(currentUser.uid);
      } catch (error) {
        setError('Error saving address.');
      }
    }
  };

  const validateFields = () => {
    if (!newAddress.phoneNumber || !newAddress.address || !newAddress.ownerName) {
      setToastMessage('All fields are required.');
      return false;
    }
    if (!/^\d{10}$/.test(newAddress.phoneNumber)) {
      setToastMessage('Phone number must be a 10-digit number.');
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setNewAddress({ phoneNumber: '', address: '', ownerName: '' });
    setShowAddForm(false);
    setEditAddressId(null);
    setToastMessage('');
  };

  const handleEditClick = (address) => {
    setEditAddressId(address.id);
    setNewAddress({
      phoneNumber: address.phoneNumber,
      address: address.address,
      ownerName: address.ownerName,
    });
    setShowAddForm(true);
  };

  const handleRemoveAddress = async (addressId) => {
    const isConfirmed = window.confirm('Are you sure you want to remove this address?');
    if (!isConfirmed) return;

    try {
      await axios.post(`${API_BASE_URL}/removeAddress`, { uid: currentUser.uid, addressId });
      fetchAddresses(currentUser.uid);
    } catch (error) {
      setError('Error removing address.');
    }
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,10}$/.test(value)) {
      setNewAddress({ ...newAddress, phoneNumber: value });
    }
  };

  if (loading) {
    return <p>Loading...</p>; // Display a loading message or spinner
  }

  return (
    <div style={styles.container2}>
      <TaskBar />
      <div style={styles.container}>
        <div style={styles.innerContainer}>
          <h1>Your Addresses</h1>
          {error && <p style={styles.error}>{error}</p>}
          {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}
          <button
            style={styles.addButton}
            onClick={() => {
              resetForm();
              setShowAddForm(true);
            }}
          >
            Add Address
          </button>
          {showAddForm && (
            <div style={styles.formContainer}>
              <input
                type="text"
                placeholder="Phone Number"
                value={newAddress.phoneNumber}
                onChange={handlePhoneNumberChange}
                style={styles.input}
              />
              <input
                type="text"
                placeholder="Address"
                value={newAddress.address}
                onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                style={styles.input}
              />
              <input
                type="text"
                placeholder="Owner Name"
                value={newAddress.ownerName}
                onChange={(e) => setNewAddress({ ...newAddress, ownerName: e.target.value })}
                style={styles.input}
              />
              <button
                style={styles.submitButton}
                onClick={editAddressId ? handleSaveAddress : handleAddAddress}
              >
                {editAddressId ? 'Save Address' : 'Add Address'}
              </button>
            </div>
          )}
          <div style={styles.addressList}>
            {addresses.map((address) => (
              <div key={address.id} style={styles.addressCard}>
                <p style={styles.addressDetailText}>{address.phoneNumber}</p>
                <p style={styles.addressDetailText}>{address.address}</p>
                <p style={styles.addressDetailText}>{address.ownerName}</p>
                <div style={styles.addressButtons}>
                  <button
                    style={styles.editButton}
                    onClick={() => handleEditClick(address)}
                  >
                    Edit
                  </button>
                  <button
                    style={styles.removeButton}
                    onClick={() => handleRemoveAddress(address.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};


const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f0f0f0',
    minHeight: '100vh',
    marginTop: 70,
  },
  innerContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  error: {
    color: 'red',
  },
  addButton: {
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    backgroundColor: '#F59F13',
    color: 'white',
    cursor: 'pointer',
  },
  formContainer: {
    marginBottom: '20px',
  },
  input: {
    display: 'block',
    margin: '10px 0',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    width: '100%',
    maxWidth: '40%',
    boxSizing: 'border-box',
  },
  submitButton: {
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    backgroundColor: '#F59F13',
    color: 'white',
    cursor: 'pointer',
  },
  addressList: {
    marginTop: '20px',
  },
  addressCard: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '10px',
    marginBottom: '10px',
    backgroundColor: 'white',
  },
  addressDetailText: {
    margin: 0,
    padding: 0,
  },
  addressButtons: {
    marginTop: '10px',
  },
  editButton: {
    padding: '5px',
    marginRight: '10px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    backgroundColor: '#F59F13',
    color: 'white',
    cursor: 'pointer',
  },
  removeButton: {
    padding: '5px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    backgroundColor: '#E9611E',
    color: 'white',
    cursor: 'pointer',
  },
};

export default AddressScreen;
