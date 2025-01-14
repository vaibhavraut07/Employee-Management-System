import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [user, setUser] = useState(null); // Add state for user
  const navigate = useNavigate();

  const fetchUser = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.get('http://127.0.0.1:8000/api/user/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data); // Set the user data
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  };

  const fetchEmployees = async (page = 1, search = '') => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.get('http://127.0.0.1:8000/api/employees/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page,
          search,
        },
      });

      setEmployees(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 10)); // Assuming 10 items per page
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch employees');
      setLoading(false);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUser(); // Fetch user data
    fetchEmployees(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      await axios.delete(`http://127.0.0.1:8000/api/employees/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchEmployees(currentPage, searchTerm); // Refresh the list
    } catch (err) {
      console.error('Failed to delete employee:', err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="employee-list">
      <h1>Employee List</h1>
      <input
        type="text"
        placeholder="Search employees..."
        value={searchTerm}
        onChange={handleSearch}
      />
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Salary</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.department}</td>
              <td>{employee.designation}</td>
              <td>{employee.salary}</td>
              <td>{employee.is_active ? 'Active' : 'Inactive'}</td>
              <td>
                {/* View button - visible to all users */}
                <button onClick={() => navigate(`/employees/details/${employee.id}`)}>View</button>
                {/* Edit and Delete buttons - visible only to admins */}
                {user && user.is_staff && (
                  <>
                    <button onClick={() => navigate(`/employees/edit/${employee.id}`)}>Edit</button>
                    <button onClick={() => handleDelete(employee.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default EmployeeList;