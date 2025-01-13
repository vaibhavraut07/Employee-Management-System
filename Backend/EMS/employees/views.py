from rest_framework import viewsets, permissions
from .models import Employee
from .serializers import EmployeeSerializer
from .permissions import IsAdminOrSelf
from rest_framework import generics
from .serializers import UserRegistrationSerializer

class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

class EmployeeViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing employee instances.
    """
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrSelf]

    def get_serializer_context(self):
        """
        Pass the request object to the serializer context.
        """
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def perform_create(self, serializer):
        """
        Override the creation logic to add custom behavior if needed.
        """
        serializer.save()

    def perform_update(self, serializer):
        """
        Override the update logic to add custom behavior if needed.
        """
        serializer.save()

    def perform_destroy(self, instance):
        """
        Override the deletion logic to add custom behavior if needed.
        """
        instance.delete()