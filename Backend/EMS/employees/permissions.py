from rest_framework.permissions import BasePermission

class IsAdminOrSelf(BasePermission):
    """
    Allow access only to admins or the user themselves.
    """
    def has_object_permission(self, request, view, obj):
        # Allow admins or the user who created the employee to access the object
        return request.user.is_staff or obj.created_by == request.user