import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cropper from 'react-easy-crop';
import "./EmployeeForm.css";
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar.js';
import getCroppedImg from './cropImageUtility'; // Utility for cropping

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
  const [loading, setLoading] = useState(false); 
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageSrc, setImageSrc] = useState(null); 
  const [croppedImage, setCroppedImage] = useState(null); 
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

  const handleImageUpload = async (e) => {
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

      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCrop = async () => {
    try {
      const croppedImg = await getCroppedImg(imageSrc, croppedAreaPixels);
      setCroppedImage(croppedImg);
      setEmployeeData((prevData) => ({ ...prevData, f_Image: croppedImg }));
      setImageSrc(null);
    } catch (error) {
      console.error('Error cropping image:', error);
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
              onChange={(e) =>
                setEmployeeData((prevData) => ({
                  ...prevData,
                  f_Id: e.target.value,
                }))
              }
              required
            />
            {errors.f_Id && <p className="error">{errors.f_Id}</p>}
          </div>

          <div>
            <label>Upload Image:</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {errors.f_Image && <p className="error">{errors.f_Image}</p>}
          </div>

          {imageSrc && (
            <div className="cropper-container">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
              />
              <button type="button" onClick={handleCrop}>
                Crop & Save
              </button>
            </div>
          )}

          {croppedImage && <img src={croppedImage} alt="Cropped" className="cropped-preview" />}

          <div>
            <label>Name:</label>
            <input
              type="text"
              name="f_Name"
              value={employeeData.f_Name}
              onChange={(e) =>
                setEmployeeData((prevData) => ({
                  ...prevData,
                  f_Name: e.target.value,
                }))
              }
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
              onChange={(e) =>
                setEmployeeData((prevData) => ({
                  ...prevData,
                  f_Email: e.target.value,
                }))
              }
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
              onChange={(e) =>
                setEmployeeData((prevData) => ({
                  ...prevData,
                  f_Mobile: e.target.value,
                }))
              }
              required
            />
            {errors.f_Mobile && <p className="error">{errors.f_Mobile}</p>}
          </div>

          <div>
            <label>Designation:</label>
            <input
              type="text"
              name="f_Designation"
              value={employeeData.f_Designation}
              onChange={(e) =>
                setEmployeeData((prevData) => ({
                  ...prevData,
                  f_Designation: e.target.value,
                }))
              }
              required
            />
            {errors.f_Designation && <p className="error">{errors.f_Designation}</p>}
          </div>

          <div>
            <label>Gender:</label>
            <select
              name="f_gender"
              value={employeeData.f_gender}
              onChange={(e) =>
                setEmployeeData((prevData) => ({
                  ...prevData,
                  f_gender: e.target.value,
                }))
              }
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label>Course:</label>
            <input
              type="text"
              name="f_Course"
              value={employeeData.f_Course}
              onChange={(e) =>
                setEmployeeData((prevData) => ({
                  ...prevData,
                  f_Course: e.target.value,
                }))
              }
            />
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
