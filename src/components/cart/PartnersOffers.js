import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../../firebaseConfig';

const API_BASE_URL = 'https://toolsbazaar-server-1036279390366.asia-south1.run.app';

const PartnersOffers = ({ onAddressSelect }) => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    phoneNumber: '',
    ownerName: '',
    address: '',
  });
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const currentUser = auth.currentUser;
        setUser(currentUser);
        if (currentUser) {
          const response = await axios.post(`${API_BASE_URL}/getAddress`, { uid: currentUser.uid });
          setCompanies(response.data);
          if (response.data.length > 0) {
            // Set the first address as the default selected address
            setSelectedCompanyId(response.data[0].id);
            if (typeof onAddressSelect === 'function') {
              onAddressSelect(response.data[0].id); // Notify parent about the selected company
            }
          }
        } else {
          console.error('User is not authenticated');
        }
      } catch (err) {
        console.error('Error fetching companies:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phoneNumber' && value.length > 10) return; // Limit phone number to 10 digits
    setNewAddress({ ...newAddress, [name]: value });
  };

  const handleSelectCompany = (companyId) => {
    setSelectedCompanyId(companyId);
    if (typeof onAddressSelect === 'function') {
      onAddressSelect(companyId); // Notify parent about the selected company
    }
  };

  const handleAddAddress = async () => {
    try {
      await axios.post(`${API_BASE_URL}/addAddress`, {
        uid: user.uid,
        ...newAddress,
      });
      setNewAddress({ phoneNumber: '', address: '', ownerName: '' });
      setShowForm(false);
      fetchAddresses();
    } catch (error) {
      setError('Error adding address.');
    }
  };
  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const currentUser = auth.currentUser;
        setUser(currentUser);
        if (currentUser) {
          const response = await axios.post(`${API_BASE_URL}/getAddress`, { uid: currentUser.uid });
          setCompanies(response.data);
        } else {
          console.error('User is not authenticated');
        }
      } catch (err) {
        console.error('Error fetching companies:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const fetchAddresses = async () => {
    if (!user) return;
    try {
      const response = await axios.post(`${API_BASE_URL}/getAddress`, { uid: user.uid });
      setCompanies(response.data);
    } catch (err) {
      setError('Error fetching addresses.');
    }
  };

 

 
 
  return (
    <div style={styles.box}>
      <h2 style={styles.header}>Your Addresses</h2>
      <div style={styles.summaryBox}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          companies.map((company) => (
            <div key={company.id} style={styles.companyCard}>
              <input
                type="radio"
                name="company"
                checked={selectedCompanyId === company.id}
                onChange={() => handleSelectCompany(company.id)}
                style={styles.radioButton}
              />
              <div style={styles.companyDetails}>
                <p style={styles.companyDetailText}>{company.owner}</p>
                <p style={styles.companyDetailText}>{company.phoneNumber}</p>
                <p style={styles.companyDetailText}>{company.address}</p>
              </div>
              <hr />
            </div>
          ))
        )}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        <button onClick={() => setShowForm(!showForm)} style={styles.addButton}>
          {showForm ? 'Cancel' : 'Add New Company'}
        </button>
        {showForm && (
          <div style={styles.form}>
            <input
              type="text"
              name="ownerName"
              placeholder="Owner Name"
              value={newAddress.ownerName}
              onChange={handleInputChange}
              style={styles.input}
            />
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              value={newAddress.phoneNumber}
              onChange={handleInputChange}
              style={styles.input}
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={newAddress.address}
              onChange={handleInputChange}
              style={styles.input}
            />
            <button onClick={handleAddAddress} style={styles.submitButton}>
              Submit Address
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  box: {
    marginTop: -20,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#4D4D4D',
    color: '#fff',
    padding: '10px',
    marginBottom: '10px',
  },
  summaryBox: {
    padding: '10px',
    backgroundColor: '#FFFFFF',
  },
  companyCard: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  radioButton: {
    marginRight: '10px',
  },
  companyDetails: {
    marginLeft: '10px',
  },
  companyDetailText: {
    margin: 0, // Remove margin to make texts close to each other
    padding: 0, // Remove padding to make texts close to each other
  },
  addButton: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#E9611E',
    color: '#fff',
    cursor: 'pointer',
    marginTop: '20px',
  },
  form: {
    marginTop: '20px',
  },
  input: {
    display: 'block',
    margin: '10px 0',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    width: '40%',
  },
  submitButton: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#E9611E',
    color: '#fff',
    cursor: 'pointer',
    marginTop: '10px',
  },
};

export default PartnersOffers;
