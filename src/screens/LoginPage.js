import React from "react";
import LoginForm from "../components/LoginForm";

const LoginPage = () => {
  const handleLogin = (user) => {
    // Handle login logic here, e.g., save user info to state or context
    console.log("User logged in:", user);
    // You can also redirect or update the authentication status here
  };

  return (
    <div style={styles.container}>
      <LoginForm onLogin={handleLogin} />
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    width: "100%",
    background: "linear-gradient(to bottom, #E9621E68, #FFFFFF)",
  },
};

export default LoginPage;
