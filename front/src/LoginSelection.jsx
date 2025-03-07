import React from "react";
import { useNavigate } from "react-router-dom";
import "./LoginSelection.css";
const LoginSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="login-selection-container">
      <div className="login-box">
        <div className="institute-header">
          <img src="https://t4.ftcdn.net/jpg/03/41/47/73/360_F_341477352_FPoRvWnWWqdzVFnIWn3on34gYWaSEX2K.jpg" alt="" className="institute-logo" />
          {/* <h2>Indian Institute of Information Technology</h2>
          <p>Bhopal, Madhya Pradesh, India - 462003</p> */}
        </div>

        <div className="login-options">
          <div className="login-card" onClick={() => navigate("/login")}>
            <i className="fas fa-user-tie"></i>
            <p>Admin Login</p>
          </div>
          <div className="login-card" onClick={() => navigate("/userpanel")}>
            <i className="fas fa-user-graduate"></i>
            <p> User Login</p>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default LoginSelection;
