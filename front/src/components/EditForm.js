import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EditForm.css';
import Navbar from './navbar.js';
const EditForm = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    f_Name: '',
    f_Email: '',
    f_Mobile: '',
    f_Designation: '',
    f_gender: '',
    f_Course: '',
  });

  useEffect(() => {
    
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/employees/${id}`);
        setFormState(response.data);
      } catch (error) {
        console.error('Error fetching employee details', error);
      }
    };

    fetchEmployee();
  }, [id]);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8000/employees/${id}`, formState);
      navigate('/employee'); 
    } catch (error) {
      console.error('Error updating employee', error);
    }
  };

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  return (
    <>
    <Navbar />
    <div className="employee-form-container">
      
      <h2>Edit Employee</h2>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          name="f_Name"
          value={formState.f_Name}
          onChange={handleInputChange}
        />
        
        <label>Email:</label>
        <input
          type="email"
          name="f_Email"
          value={formState.f_Email}
          onChange={handleInputChange}
        />
        
        <label>Mobile:</label>
        <input
          type="text"
          name="f_Mobile"
          value={formState.f_Mobile}
          onChange={handleInputChange}
        />
        
        <label>Designation:</label>
        {/* <input
          type="text"
          name="f_Designation"
          value={formState.f_Designation}
          onChange={handleInputChange}
        /> */}
        <select
              name="f_Designation"
              value={formState.f_Designation}
              onChange={handleInputChange}
              required
            >
               
              <option value=" Software Developer"> Software Developer </option>
              <option value=" Web Developer"> Web Developer</option>
              <option value="Data Analyst"> Data Analyst </option>
              <option value="Data Scientist"> Data Scientist </option>
              <option value="Mobile Application Developer"> Mobile Application Developer </option>
              <option value="Database Administrator"> Database Administrator </option>
              <option value="Cloud Engineer"> Cloud Engineer </option>
            </select>
    
      
          <label>Gender:</label>
          {/* <label>
            <input
              type="radio"
              name="f_gender"
              value="Male"
              checked={formState.f_gender === 'Male'}
              onChange={handleInputChange}
            />
            Male
          </label> */}
        
          {/* <label>
            <input
              type="radio"
              name="f_gender"
              value="Female"
              checked={formState.f_gender === 'Female'}
              onChange={handleInputChange}
            />
            Female
          </label>
          <label>
            <input
            id='gen'
              type="radio"
              name="f_gender"
              value="Other"
              checked={formState.f_gender === 'Other'}
              onChange={handleInputChange}
            />
            Other
          </label> */}

<select className='m'
              name="f_gender"
              value={formState.f_gender}
              onChange={handleInputChange}
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            
       
       
        <label>Course:</label>
{/*        
        <input
          type="text"
          name="f_Course"
          value={formState.f_Course}
          onChange={handleInputChange}
        />
         */}
           <select
              name="f_Course"
              value={formState.f_Course}
              onChange={handleInputChange}
              required
            >
               
              <option value="B Tech"> B Tech</option>
              <option value="M Tech"> M Tech</option>
              <option value="BSC"> BSC </option>
              <option value="MSC"> MSC </option>
              <option value="DCA"> DCA </option>
              <option value="PGDCA"> PGDCA </option>
              <option value="Diploma"> Diploma </option>
            </select>
        <button type="submit">Update Employee</button>
      </form>
    </div>
    </>
  );
};

export default EditForm;
