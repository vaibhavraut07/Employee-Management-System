from rest_framework import serializers
from .models import Employee
from django.contrib.auth.models import User

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'email']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data.get('email', '')
        )
        return user

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['id', 'name', 'email', 'phone', 'department', 'designation', 'salary', 'dob', 'address', 'is_active', 'created_at', 'updated_at']

    def to_representation(self, instance):
        """
        Customize the representation of the employee data.
        Hide salary for non-admin and non-self users.
        """
        representation = super().to_representation(instance)
        request = self.context.get('request')
        user = request.user if request else None

        # Hide salary if the user is not an admin or the employee themselves
        if not (user and (user.is_staff or user == instance.user)):
            representation.pop('salary', None)

        return representation