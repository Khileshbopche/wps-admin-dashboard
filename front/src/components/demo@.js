import React, { useState, useEffect } from 'react';
import './Employee.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaLock, FaUnlock, FaEdit, FaTrash, FaFilePdf } from 'react-icons/fa';
import Navbar from './navbar.js';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]); // Filtered list of employees
  const [searchKeyword, setSearchKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lockedEmployees, setLockedEmployees] = useState({});
  const [pdfEmployee, setPdfEmployee] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      alert('You must be logged in to access this page.');
      navigate('/login');
    }
  }, [navigate]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:8000/employees');
      setEmployees(response.data);
      setFilteredEmployees(response.data); // Set initial filtered employees
      const savedLocks = JSON.parse(localStorage.getItem('lockedEmployees')) || {};
      setLockedEmployees(savedLocks);
    } catch (error) {
      setError('Error fetching employees');
    } finally {
      setLoading(false);
    }
  }; 
 
  // app.get('/employees/:id/image', (req, res) => {
  //   const { id } = req.params;
  //   const filePath = `/path/to/images/${id}.jpg`; // Replace with actual logic to retrieve the image file
    
  //   res.sendFile(filePath, (err) => {
  //     if (err) {
  //       res.status(404).send({ message: 'Image not found' });
  //     }
  //   });
  // });
  


  useEffect(() => {
    fetchEmployees();
  }, []);

  const saveLockState = (state) => {
    localStorage.setItem('lockedEmployees', JSON.stringify(state));
  };

  const toggleLock = (id) => {
    setLockedEmployees((prev) => {
      const updatedLocks = { ...prev, [id]: !prev[id] };
      saveLockState(updatedLocks);
      return updatedLocks;
    });
  };

  const deleteEmployee = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/employees/${id}`);
      const updatedEmployees = employees.filter((emp) => emp._id !== id);
      setEmployees(updatedEmployees);
      setFilteredEmployees(updatedEmployees); // Update filtered employees after deletion
    } catch (error) {
      setError('Error deleting employee');
    }
  };

  // const generatePDF = (employee) => {
  //   const doc = new jsPDF();
  //   doc.setFontSize(16);
  //   doc.text('Employee Details', 10, 10);
  //   doc.autoTable({
  //     startY: 20,
  //     head: [['Field', 'Details']],
  //     body: [
  //       ['Unique ID', employee.f_Id],
  //       ['Name', employee.f_Name],
  //       ['Email', employee.f_Email],
  //       ['Images', employee.f_Image],
  //       ['Mobile', employee.f_Mobile],
  //       ['Designation', employee.f_Designation],
  //       ['Gender', employee.f_gender],
  //       ['Course', employee.f_Course],
  //       ['Created Date', new Date(employee.f_Createdate).toLocaleDateString()],
  //     ],
  //   });
  //   setPdfEmployee(doc.output('bloburl'));
  // };
  const generatePDF = async (employee) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Employee Details', 10, 10);
  
    // Add table data
    doc.autoTable({
      startY: 20,
      head: [['Field', 'Details']],
      body: [
        ['Unique ID', employee.f_Id],
        ['Name', employee.f_Name],
        ['Email', employee.f_Email],
        ['Mobile', employee.f_Mobile],
        ['Designation', employee.f_Designation],
        ['Gender', employee.f_gender],
        ['Course', employee.f_Course],
        ['Created Date', new Date(employee.f_Createdate).toLocaleDateString()],
      ],
    });
  
    // Add styled image if available
    if (employee.f_Image) {
      try {
        const imageResponse = await axios.get(`http://localhost:8000${employee.f_Image}`, {
          responseType: 'arraybuffer',
        });
        const imageData = `data:image/jpeg;base64,${btoa(
          new Uint8Array(imageResponse.data)
            .reduce((data, byte) => data + String.fromCharCode(byte), '')
        )}`;
  
        const imageX = 10; // X-coordinate for the image
        const imageY = doc.autoTable.previous.finalY + 10; // Y-coordinate after the table
        const imageWidth = 15; // Image width
        const imageHeight = 15; // Image height
        const borderPadding = 5; // Padding around the image for border
          
        // Draw a border around the image
        doc.setDrawColor(0); // Black color
        doc.setLineWidth(0.5); // Border thickness
        doc.rect(
          imageX - borderPadding, // X-position with padding
          imageY - borderPadding, // Y-position with padding
          imageWidth + borderPadding * 2, // Width with padding
          imageHeight + borderPadding * 2 // Height with padding
        );
  
        // Add the image
        doc.addImage(imageData, 'JPEG', imageX, imageY, imageWidth, imageHeight);
  
        // Add caption under the image
        doc.setFontSize(12);
        doc.text('', imageX, imageY + imageHeight + 8); // Caption position
      } catch (error) {
        console.error('Error loading employee image:', error);
      }
    }
  
    setPdfEmployee(doc.output('bloburl'));
  };
  
  const closePDFViewer = () => {
    setPdfEmployee(null);
  };

  const handleSearch = () => {
    const lowerCaseKeyword = searchKeyword.toLowerCase();
    const results = employees.filter((employee) => {
      return (
        String(employee.f_Id || "").toLowerCase().includes(lowerCaseKeyword) ||
        String(employee.f_Name || "").toLowerCase().includes(lowerCaseKeyword) ||
        String(employee.f_Email || "").toLowerCase().includes(lowerCaseKeyword) ||
        String(employee.f_Mobile || "").toLowerCase().includes(lowerCaseKeyword) ||
        String(employee.f_Designation || "").toLowerCase().includes(lowerCaseKeyword) ||
        String(employee.f_gender || "").toLowerCase().includes(lowerCaseKeyword) ||
        String(employee.f_Course || "").toLowerCase().includes(lowerCaseKeyword)
      );
    });
    setFilteredEmployees(results);
  };
  

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <Navbar />
      <div className="employee-container">
        <h2 className="header-title">Employee List</h2>
        <div className="header-row">
          <div className="total-count">
            <strong>Total Count: {filteredEmployees.length}</strong>
          </div>
          <Link to="/employeeform">
            <button className="create-employee-button">Create Employee</button>
          </Link>
        </div>

        <div className="search-row">
          <input
            type="text"
            placeholder="Enter Search "
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="search-input"
          />
          <button className="search-button" onClick={handleSearch}>
            Search
          </button>
        </div>

        <div className="employee-list">
          <table className="employee-table">
            <thead>
              <tr>
                <th> Id</th>
                <th>Image</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile No</th>
                {/* <th>Designation</th> */}
                <th>Gender</th>
                <th>Course</th>
                <th>Create date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => (
                <tr key={employee.f_Id}>
                  <td>{employee.f_Id}</td>
                  {/* <td>
                    <img src={employee.f_Image} alt="employee" className="employee-image" />
                  </td> */}
                   <td>
  <img
    src={`http://localhost:8000${employee.f_Image}`}
    alt="employee"
    className="employee-image"
  />
</td>



                  <td>{employee.f_Name}</td>
                  <td>
                    <a href={`mailto:${employee.f_Email}`} className="employee-email">
                      {employee.f_Email}
                    </a>
                  </td>
                  <td>{employee.f_Mobile}</td>
                  {/* <td>{employee.f_Designation}</td> */}
                  <td>{employee.f_gender}</td>
                  <td>{employee.f_Course}</td>
                  <td>{new Date(employee.f_Createdate).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/editform/${employee._id}`}>
                      <button
                        className="edit-button"
                        disabled={lockedEmployees[employee._id]}
                      >
                        <FaEdit /> 
                      </button>
                    </Link>
                    -
                    <button
                      className="delete-button"
                      disabled={lockedEmployees[employee._id]}
                      onClick={() => deleteEmployee(employee._id)}
                    >
                      <FaTrash /> 
                    </button>
                    -
                    {lockedEmployees[employee._id] ? (
                      <button
                        className="unlock-button"
                        onClick={() => toggleLock(employee._id)}
                      >
                        <FaUnlock /> 
                      </button>
                    ) : (
                      <button
                        className="lock-button"
                        onClick={() => toggleLock(employee._id)}
                      >
                        <FaLock /> 
                      </button>
                    )}
                    -
                    <button
                      className="pdf-button"
                      onClick={() => generatePDF(employee)}
                    >
                      <FaFilePdf /> 
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {pdfEmployee && (
        <div className="pdf-viewer-modal">
          <div className="pdf-viewer-content">
            <iframe src={pdfEmployee} title="Employee PDF Viewer" className="pdf-iframe" />
            <button className="close-pdf-button" onClick={closePDFViewer}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Employee;  