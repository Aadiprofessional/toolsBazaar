import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import RegisterForm2 from '../components/RegisterForm copy';

const RegisterPage2 = () => {
  const location = useLocation();
  const [email, setEmail] = useState("");

  // Access the email passed in the location state
  useEffect(() => {
    if (location.state && location.state.email) {
      setEmail(location.state.email); // Set email to state
    }
  }, [location]);

  return (
    <div style={styles.container}>
      {/* Pass the email to RegisterForm2 as a prop */}
      <RegisterForm2 email={email} />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    width: '100%',
    background: 'linear-gradient(to bottom, #E9621E68, #FFFFFF)', // Same gradient as login
  },
};

export default RegisterPage2;
