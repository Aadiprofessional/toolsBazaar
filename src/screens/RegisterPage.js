import React from 'react';
import RegisterForm from '../components/RegisterForm';

const RegisterPage = () => {
  return (
    <div style={styles.container}>
      <RegisterForm />
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
    width: "100%",
    background: 'linear-gradient(to bottom, #E9621E68, #FFFFFF)', // Same gradient as login
  },
};

export default RegisterPage;
