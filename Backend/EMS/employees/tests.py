from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth.models import User
from .models import Employee

class EmployeeTests(APITestCase):
    def setUp(self):
        """
        Set up test data and authenticate the test client.
        """
        # Delete all existing employees
        Employee.objects.all().delete()

        # Create a test user
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        
        # Authenticate the test client
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

        # Create a test employee
        self.employee = Employee.objects.create(
            name='John Doe',
            email='john@example.com',
            phone='1234567890',
            department='IT',
            designation='Developer',
            salary=50000.00,
        )
        self.url = reverse('employee-list')  # URL for the employee list

    def test_get_employees(self):
        """
        Test retrieving a list of employees.
        """
        response = self.client.get(self.url)
        print(response.data)  # Print the response data
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)  # Check the length of the 'results' key

    def test_create_employee(self):
        """
        Test creating a new employee.
        """
        data = {
            'name': 'Jane Doe',
            'email': 'jane@example.com',
            'phone': '0987654321',
            'department': 'HR',
            'designation': 'Manager',
            'salary': 60000.00,
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Employee.objects.count(), 2)  # Check if the employee was created

    def test_get_single_employee(self):
        """
        Test retrieving a single employee.
        """
        url = reverse('employee-detail', args=[self.employee.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'John Doe')  # Check the employee's name

    def test_update_employee(self):
        """
        Test updating an employee.
        """
        url = reverse('employee-detail', args=[self.employee.id])
        data = {'name': 'John Smith'}
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'John Smith')  # Check if the name was updated

    def test_delete_employee(self):
        """
        Test deleting an employee.
        """
        url = reverse('employee-detail', args=[self.employee.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Employee.objects.count(), 0)  # Check if the employee was deleted