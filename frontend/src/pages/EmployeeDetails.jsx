import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EmployeeDetails = () => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchEmployee = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/employees/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEmployee(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch employee data');
        setLoading(false);
        console.error(err);
      }
    };

    fetchEmployee();
  }, [id, navigate]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!employee) return <p>Employee not found</p>;

  return (
    <div className="employee-details">
      <h1>Employee Details</h1>
      <div className="details">
        <p><strong>Name:</strong> {employee.name}</p>
        <p><strong>Email:</strong> {employee.email}</p>
        <p><strong>Phone:</strong> {employee.phone}</p>
        <p><strong>Department:</strong> {employee.department}</p>
        <p><strong>Designation:</strong> {employee.designation}</p>
        <p><strong>Salary:</strong> {employee.salary}</p>
        <p><strong>Status:</strong> {employee.is_active ? 'Active' : 'Inactive'}</p>
      </div>
      <button onClick={() => navigate(`/employees/edit/${employee.id}`)}>Edit</button>
      <button onClick={() => navigate('/employees')}>Back to List</button>
    </div>
  );
};

export default EmployeeDetails;