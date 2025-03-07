import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./navbar.css";
import { faBars, faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faCircleUser, faEnvelope } from '@fortawesome/free-regular-svg-icons'
import { faFaceLaughWink, faTachographDigital, faUsers } from '@fortawesome/free-solid-svg-icons'
const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    const checkLoginStatus = () => {
      const storedUser = localStorage.getItem('user'); 

      if (storedUser) {
        const user = JSON.parse(storedUser); 
        setIsLoggedIn(true);
        setUsername(user.f_userName); 
      } else {
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  
  const handleLogout = async () => {
    try {
      
      await axios.post('http://localhost:8000/logout', {}, { withCredentials: true });
      
      
      localStorage.removeItem('user');
   
      setIsLoggedIn(false);
      setUsername('');
      
     
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="navbar">
      <div className="nav-left">
        <a href="/admin">Home</a>
         <FontAwesomeIcon icon={faTachographDigital} style={{ marginRight: "0.5rem" }} />
        <a href="/employee">Employee List</a>
        <div className='icon'>
          <FontAwesomeIcon icon={faUsers} style={{ marginRight: "0.5rem" }} />
          </div>
      </div>
       <form
                      className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                      <div className="input-group">
                          {/* <input type="text" className="form-control bg-light border-0 small" placeholder="Search for..."
                              aria-label="Search" aria-describedby="basic-addon2" /> */}
                          {/* <div className="input-group-append">
                              <button className="btn btn-primary" type="button">
                                  <FontAwesomeIcon icon={faSearch} />
                              </button>
                          </div> */}
                      </div>
                  </form>

                   
      
      <div className="nav-right">
        {isLoggedIn ? (
          <>
           <FontAwesomeIcon icon={faBell} className="icon bell-icon" />
            <span className="username">{username}</span>
              
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
            
          </>
        ) : (
          <>
            <a href="/">Signup</a>
            <a href="/login">Login</a>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
