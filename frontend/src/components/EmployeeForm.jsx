import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EmployeeForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
    salary: '',
    is_active: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams(); // For editing an existing employee

  useEffect(() => {
    if (id) {
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
          setFormData(response.data);
        } catch (err) {
          setError('Failed to fetch employee data');
          console.error(err);
        }
      };
      fetchEmployee();
    }
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const url = id
        ? `http://127.0.0.1:8000/api/employees/${id}/`
        : 'http://127.0.0.1:8000/api/employees/';
      const method = id ? 'put' : 'post';

      await axios[method](url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      navigate('/employees'); // Redirect to employee list after submission
    } catch (err) {
      setError('Failed to save employee. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="employee-form">
      <h1>{id ? 'Edit Employee' : 'Add Employee'}</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Department</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Designation</label>
          <input
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Salary</label>
          <input
            type="number"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Status</label>
          <select
            name="is_active"
            value={formData.is_active}
            onChange={handleChange}
          >
            <option value={true}>Active</option>
            <option value={false}>Inactive</option>
          </select>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
};

export default EmployeeForm;