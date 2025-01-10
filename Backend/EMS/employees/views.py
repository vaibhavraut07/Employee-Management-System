from rest_framework import viewsets, permissions
from .models import Employee
from .serializers import EmployeeSerializer

from rest_framework import generics
from .serializers import UserRegistrationSerializer

class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]
class EmployeeViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing employee instances.
    """
    queryset = Employee.objects.all()  # Get all employees
    serializer_class = EmployeeSerializer  # Use the EmployeeSerializer
    permission_classes = [permissions.AllowAny]  # Require authentication

    def perform_create(self, serializer):
        """
        Override the creation logic to add custom behavior if needed.
        """
        serializer.save()  # Save the new employee

    def perform_update(self, serializer):
        """
        Override the update logic to add custom behavior if needed.
        """
        serializer.save()  # Save the updated employee

    def perform_destroy(self, instance):
        """
        Override the deletion logic to add custom behavior if needed.
        """
        instance.delete()  # Delete the employee