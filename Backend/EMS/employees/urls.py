from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EmployeeViewSet, UserRegistrationView

# Create a router and register the EmployeeViewSet
router = DefaultRouter()
router.register(r'employees', EmployeeViewSet, basename='employee')

urlpatterns = [
    # Include the router URLs
    path('', include(router.urls)),
    # User registration endpoint (open to everyone)
    path('register/', UserRegistrationView.as_view(), name='user-register'),
]