

import React from 'react';
import './AdminPanel.css';
import Navbar from './navbar';
import Dashboard from './Dashboard';

 import "bootstrap/dist/css/bootstrap.min.css";
 import "bootstrap/dist/js/bootstrap.bundle.min";


const AdminPanel = () => {

  

  return (

    
    
  <>

  <Navbar/> 
     {/* <div className="admin-panel">
      
      <main>
          <h1>Welcome to the Admin Panel</h1> 
          <p>Here you can manage your dashboard, view reports, and adjust settings.</p>
      </main>
    </div>  */}

     <Dashboard/>
        {/* <Franchise/>  */}
    </>
  );
};

export default AdminPanel;

