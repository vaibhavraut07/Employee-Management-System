import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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

  useEffect(() => {
    fetchUser(); // Fetch user data
    const fetchData = async () => {
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
        });

        // Log the response for debugging
        console.log('API Response:', response);

        // Check if the response data is in the expected format
        let employees = [];
        if (response.data && Array.isArray(response.data)) {
          // Handle non-paginated response
          employees = response.data;
        } else if (response.data && response.data.results && Array.isArray(response.data.results)) {
          // Handle paginated response
          employees = response.data.results;
        } else {
          setError('Invalid data format received from the server');
          return;
        }

        // Process data for the chart
        const departmentCounts = employees.reduce((acc, employee) => {
          acc[employee.department] = (acc[employee.department] || 0) + 1;
          return acc;
        }, {});

        const chartData = Object.keys(departmentCounts).map((department) => ({
          department,
          employees: departmentCounts[department],
        }));

        setEmployeeData(chartData);
      } catch (err) {
        if (err.response) {
          // Backend returned an error response
          setError(err.response.data.detail || 'Failed to fetch employee data');
        } else if (err.request) {
          // No response received from the backend
          setError('No response from the server. Please check your connection.');
        } else {
          // Other errors
          setError('An error occurred. Please try again.');
        }
        console.error('Error fetching employee data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login'); // Redirect to login page
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="dashboard-actions">
        <button onClick={() => navigate('/employees')}>Employee List</button>
        {/* Add Employee button - visible only to admins */}
        {user && user.is_staff && (
          <button onClick={() => navigate('/employees/add')}>Add Employee</button>
        )}
        <button onClick={handleLogout}>Logout</button>
      </div>
      <div className="summary-cards">
        <div className="card">
          <h3>Total Employees</h3>
          <p>{employeeData.reduce((acc, curr) => acc + curr.employees, 0)}</p>
        </div>
        <div className="card">
          <h3>Active Employees</h3>
          <p>{employeeData.reduce((acc, curr) => acc + curr.employees, 0)}</p> {/* Update with actual active count */}
        </div>
        <div className="card">
          <h3>Inactive Employees</h3>
          <p>0</p> {/* Update with actual inactive count */}
        </div>
      </div>
      <div className="charts">
        <h2>Employees by Department</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={employeeData}>
            <XAxis dataKey="department" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="employees" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;