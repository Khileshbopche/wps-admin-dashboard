import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./EmployeeForm.css";
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar.js';

const EmployeeForm = () => {
  const [employeeData, setEmployeeData] = useState({
    f_Id: '',
    f_Image: null,
    f_Name: '',
    f_Email: '',
    f_Mobile: '',
    f_Designation: '',
    f_gender: 'Male',
    f_Course: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // Loader state
  const [uploadProgress, setUploadProgress] = useState(0); // Progress state
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      alert('You need to be logged in to access this page');
      navigate('/login');
    }
  }, [navigate]);

  const validate = () => {
    const errors = {};
    if (!employeeData.f_Id) errors.f_Id = 'Employee ID is required';
    if (!employeeData.f_Name) errors.f_Name = 'Name is required';
    if (!employeeData.f_Email) {
      errors.f_Email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(employeeData.f_Email)) {
      errors.f_Email = 'Email address is invalid';
    }
    if (!employeeData.f_Mobile) {
      errors.f_Mobile = 'Mobile number is required';
    } else if (!/^\d+$/.test(employeeData.f_Mobile)) {
      errors.f_Mobile = 'Mobile number must contain only digits';
    } else if (employeeData.f_Mobile.length !== 10) {
      errors.f_Mobile = 'Mobile number must be 10 digits';
    }
    if (!employeeData.f_Designation) errors.f_Designation = 'Designation is required';
    if (!employeeData.f_Image) errors.f_Image = 'Employee image is required';
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          f_Image: 'Only JPEG and PNG images are allowed',
        }));
        return;
      } else if (file.size > 1024 * 1024) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          f_Image: 'Image size must not exceed 1MB',
        }));
        return;
      }

      setErrors((prevErrors) => ({ ...prevErrors, f_Image: '' }));
      setLoading(true);
      setUploadProgress(0); // Reset progress bar

      try {
        const formData = new FormData();
        formData.append('file', file);

        // Simulated upload process with progress
        const interval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 100) {
              clearInterval(interval);
              return 100;
            }
            return prev + 10;
          });
        }, 200);

        // Simulated delay
        await new Promise((resolve) => setTimeout(resolve, 2000));

        setEmployeeData((prevData) => ({ ...prevData, f_Image: file }));
      } catch (error) {
        console.error('Error uploading image:', error);
        setErrors((prevErrors) => ({
          ...prevErrors,
          f_Image: 'Failed to upload image. Please try again.',
        }));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const formData = new FormData();
      Object.keys(employeeData).forEach((key) => {
        formData.append(key, employeeData[key]);
      });

      const response = await axios.post('http://localhost:8000/employees', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('Employee created:', response.data);
      navigate("/employee");
    } catch (error) {
      console.error('There was an error creating the employee!', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="employee-form-container">
        <h2>Create Employee</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div>
            <label>Employee ID:</label>
            <input
              type="number"
              name="f_Id"
              value={employeeData.f_Id}
              onChange={handleChange}
              required
            />
            {errors.f_Id && <p className="error">{errors.f_Id}</p>}
          </div>

          <div>
            <label>Upload Image:</label>
            <input
              type="file"
              name="f_Image"
              onChange={handleImageChange}
              required
            />
            {errors.f_Image && <p className="error">{errors.f_Image}</p>}
            {loading && (
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${uploadProgress}%` }}
                >
                  {uploadProgress === 100 ? '100% Complete' : `${uploadProgress}%`}
                </div>
              </div>
            )}
          </div>

          {/* Remaining fields */}


          <div>
            <label>Name:</label>
            <input
              type="text"
              name="f_Name"
              value={employeeData.f_Name}
              onChange={handleChange}
              required
            />
            {errors.f_Name && <p className="error">{errors.f_Name}</p>}
          </div>

          <div>
            <label>Email:</label>
            <input
              type="email"
              name="f_Email"
              value={employeeData.f_Email}
              onChange={handleChange}
              required
            />
            {errors.f_Email && <p className="error">{errors.f_Email}</p>}
          </div>

          <div>
            <label>Mobile:</label>
            <input
              type="text"
              name="f_Mobile"
              value={employeeData.f_Mobile}
              onChange={handleChange}
              required
            />
            {errors.f_Mobile && <p className="error">{errors.f_Mobile}</p>}
          </div>

          <div>
            <label>Designation:</label>
            {/* <input
              type="text"
              name="f_Designation"
              value={employeeData.f_Designation}
              onChange={handleChange}
              required
            /> */}


<select
              name="f_Designation"
              value={employeeData.f_Designation}
              onChange={handleChange}
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
            {errors.f_Designation && <p className="error">{errors.f_Designation}</p>}
          </div>

          <div>
            <label>Gender:</label>
            <select
              name="f_gender"
              value={employeeData.f_gender}
              onChange={handleChange}
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
        
            {/* <input
              type="text"
              name="f_Course"
              value={employeeData.f_Course}
              onChange={handleChange}
            /> */}
             <label>Course:</label>
            <select
              name="f_Course"
              value={employeeData.f_Course}
              onChange={handleChange}
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
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Submit'}
          </button>
        </form>
      </div>
    </>
  );
};

export default EmployeeForm;
