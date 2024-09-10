import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const { exp } = jwtDecode(token);

    if (exp < Date.now() / 1000) {
      localStorage.removeItem("token");
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
};

const PrivateRoute = ({ component: Component, ...rest }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/"); // Redirect to the home page or login page
    }
  }, [navigate]);

  return isAuthenticated() ? <Component {...rest} /> : null;
};

export default PrivateRoute;
