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
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lockedEmployees, setLockedEmployees] = useState({});
  const [pdfEmployee, setPdfEmployee] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [deleteId, setDeleteId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
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
      setFilteredEmployees(response.data);
      const savedLocks = JSON.parse(localStorage.getItem('lockedEmployees')) || {};
      setLockedEmployees(savedLocks);
    } catch (error) {
      setError('Error fetching employees');
    } finally {
      setLoading(false);
    }
  };

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

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const cancelDelete = () => {
    setDeleteId(null);
    setShowConfirm(false);
  };

  const deleteEmployee = async () => {
    if (!deleteId) return;

    try {
      await axios.delete(`http://localhost:8000/employees/${deleteId}`);
      const updatedEmployees = employees.filter((emp) => emp._id !== deleteId);
      setEmployees(updatedEmployees);
      setFilteredEmployees(updatedEmployees);
    } catch (error) {
      setError('Error deleting employee');
    } finally {
      setShowConfirm(false);
      setDeleteId(null);
    }
  };

  const generatePDF = async (employee) => {
    const doc = new jsPDF();

    // Add Title
    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text('Employee Details', 14, 20);

    // Draw a line below the title
    doc.setLineWidth(0.5);
    doc.line(14, 25, 196, 25);

    const imageUrl = `http://localhost:8000${employee.f_Image}`;
    try {
      const imageResponse = await axios.get(imageUrl, { responseType: 'blob' });
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;

        // Add Employee Image
        doc.addImage(base64Image, 'JPEG', 14, 30, 40, 40);

        // Add Employee Details in a Table
        doc.autoTable({
          startY: 80,
          margin: { left: 14, right: 14 },
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
          theme: 'grid',
          headStyles: {
            fillColor: [40, 100, 200],
            textColor: 255,
            fontStyle: 'bold',
          },
          bodyStyles: { textColor: 50 },
          alternateRowStyles: { fillColor: [240, 240, 240] },
          tableLineColor: 200,
          tableLineWidth: 0.5,
        });

        setPdfEmployee(doc.output('bloburl'));
      };

      reader.readAsDataURL(imageResponse.data);
    } catch (error) {
      console.error('Error loading image for PDF:', error);
      alert('Failed to load employee image for PDF.');
    }
  };

  const closePDFViewer = () => {
    setPdfEmployee(null);
  };

  const handleSearch = () => {
    const lowerCaseKeyword = searchKeyword.toLowerCase();
    const results = employees.filter((employee) => {
      return (
        String(employee.f_Id || '').toLowerCase().includes(lowerCaseKeyword) ||
        String(employee.f_Name || '').toLowerCase().includes(lowerCaseKeyword) ||
        String(employee.f_Email || '').toLowerCase().includes(lowerCaseKeyword) ||
        String(employee.f_Mobile || '').toLowerCase().includes(lowerCaseKeyword) ||
        String(employee.f_Designation || '').toLowerCase().includes(lowerCaseKeyword) ||
        String(employee.f_gender || '').toLowerCase().includes(lowerCaseKeyword) ||
        String(employee.f_Course || '').toLowerCase().includes(lowerCaseKeyword)
      );
    });
    setFilteredEmployees(results);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredEmployees.length / pageSize);

  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (direction) => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
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
            <strong className='total-counts'>Total Count: {filteredEmployees.length}</strong>
          </div>
          
          <Link to="/employeeform">
            <button className="create-employee-button" id='createbtn'>Create Employee</button>
          </Link>
        </div>

        <div className="search-row" >
          <input
            type="text"
            placeholder="Enter Search"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="search-input"
          />
          <button className="search-button" onClick={handleSearch}>
            Search
          </button>
        </div>

        <div className="pagination-controls">
          <label htmlFor="pageSize">Page Size:</label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
        </div>

        <div className="employee-list">
          <table className="employee-table">
            <thead>
              <tr>
                <th>Id</th>
                <th>Image</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile No</th>
                <th>Gender</th>
                <th>Course</th>
                <th>Create date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEmployees.map((employee) => (
                <tr key={employee.f_Id}>
                  <td>{employee.f_Id}</td>
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
                      onClick={() => confirmDelete(employee._id)}
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
        
         {/* Confirmation Modal */}
      {showConfirm && (
        <>
          <div className="modal-overlay"></div>
          <div className="confirmation-modal">
            <h3>Are you sure you want to delete this employee?</h3>
            <div className="confirmation-buttons">
              <button className="confirm-btn" onClick={deleteEmployee}>OK</button>
              <button className="cancel-btn" onClick={cancelDelete}>Cancel</button>
            </div>
          </div>
        </>
      )}





        <div className="pagination-buttons">
          <button
            onClick={() => handlePageChange('prev')}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange('next')}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {pdfEmployee && (
        <div className="pdf-viewer-modal">
          <div className="pdf-viewer-overlay" onClick={closePDFViewer}></div>
          <div className="pdf-viewer-container">
            <div className="pdf-viewer-header">
              <h3>Employee PDF Viewer</h3>
              <button className="close-pdf-button" onClick={closePDFViewer}>
                ✖
              </button>
            </div>
            <iframe src={pdfEmployee} title="Employee PDF Viewer" className="pdf-iframe" />
            {/* <div className="pdf-viewer-footer">
              <button
                className="download-pdf-button"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = pdfEmployee;
                  link.download = 'Employee_Details.pdf';
                  link.click();
                }}
              >
                Download PDF
              </button>
            </div> */}
          </div>
        </div>
      )}
    </>
  );
};

export default Employee;
