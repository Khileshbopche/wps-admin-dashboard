import React, { useState } from "react";
import axios from 'axios';
import { FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
const employees = [
  { id: 34, name: "Yes Bank", email: "yesbank@gmail.com", image: "https://placehold.co/50" },
  { id: 13, name: "Aditya", email: "aditya@gmail.com", image: "https://via.placeholder.com/50" },
  { id: 52, name: "OverLoad Pizza", email: "peer@gmail.com", image: "https://via.placeholder.com/50" },
  { id: 234, name: "Balveer Da Punjabi Dhaba", email: "pee@gmail.com", image: "https://via.placeholder.com/50" },
];

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const [error, setError] = useState("");
 const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const navigate = useNavigate();
  const handleLogin = () => {
    const user = employees.find((emp) => emp.email === email && emp.id.toString() === id);
    if (user) {
      onLogin(user);
    } else {
      setError("Invalid credentials");
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="body">
      
      <div className="box">
        <div className="Signupform">
          <h2> User   Login</h2>
          {error && <p className="error">{error}</p>}
          <input
            type="text"
            placeholder="email"
            value={email}
            
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="id"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <div className="btnarea">
            <button onClick={handleLogin}>Login</button>
          </div>
            <button className="home-button" onClick={() => navigate('/')}> 
                      <FaHome size={20} />
                    </button>
        </div>
      </div>
    </div>
  );
};

const UserPanel = ({ user, handleLogout }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <img src={user.image} alt={user.name} className="w-20 h-20 rounded-full mx-auto mb-4" />
        
        <h2 className="text-xl font-bold">{user.name}</h2>
        <p className="text-gray-600">{user.email}</p>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

const App = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();  // Get navigate function
  
    const handleLogout = () => {
      localStorage.removeItem('user');
      setUser(null);  // Clear user state
      navigate('/userpanel');  // Navigate to the home page
    };
  
    return user ? <UserPanel user={user} handleLogout={handleLogout} /> : <LoginPage onLogin={setUser} />;
  };
  export default App;