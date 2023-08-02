from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from user.models import User
from .serializers import UserRegistrationSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from datetime import datetime, timedelta


class MeView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = {
            'email': request.user.email,
            'name': request.user.name,
            'openAIKey': request.user.openai_key,
            'githubUsername': request.user.github_username,
            'githubToken': request.user.github_token,
        }
        return Response(
            data=user,
            status=200
        )


class UpdateUserView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        data = request.data
        user = request.user
        if data.get("name"):
            user.name = data.get("name")
        if data.get("githubUsername"):
            user.github_username = data.get("githubUsername")
        if data.get("githubToken"):
            user.github_token = data.get("githubToken")
        if data.get("openAIKey"):
            user.openai_key = data.get("openAIKey")
        user.save()
        return Response(
            data={
                'email': user.email,
                'name': user.name,
                'openAIKey': user.openai_key,
                'githubUsername': user.github_username,
                'githubToken': user.github_token,
            },
            status=200
        )


class UserLoginView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        # Get the token data from the response
        token_data = response.data

        # Set the access token as a cookie
        access_token = token_data['access']
        response.set_cookie(
            key='access',
            value=access_token,
            expires=datetime.now() + timedelta(hours=1),  # Set the expiration time for the cookie
            samesite='Lax',  # Set samesite attribute to 'Lax' to prevent cross-site request forgery (CSRF) attacks
        )

        # Set the refresh token as a cookie
        refresh_token = token_data['refresh']
        response.set_cookie(
            key='refresh',
            value=refresh_token,
            expires=datetime.now() + timedelta(days=30),  # Set the expiration time for the cookie (30 days for refresh token)
            samesite='Lax',
        )
        return response


class UserRegisterView(generics.CreateAPIView):
    permission_classes = []
    serializer_class = UserRegistrationSerializer

    def post(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return Response({'message': 'You are already logged in'}, status=400)
        data = request.data
        if not data.get('email'):
            return Response({'message': 'Email is required'}, status=400)
        if not data.get('password'):
            return Response({'message': 'Password is required'}, status=400)
        if not data.get('name'):
            return Response({'message': 'Name is required'}, status=400)
        if User.objects.filter(email=data.get('email')).exists():
            return Response({'message': 'User already exists'}, status=400)
        user = User.objects.create_user(
            email=data.get('email'),
            name=data.get('name'),
            username=data.get('username')
        )
        user.set_password(data.get('password'))
        user.save()
        return Response({
            'email': user.email,
            'name': user.name
        }, status=200)


class UserLogoutView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        response = Response()
        response.delete_cookie('access')
        response.delete_cookie('refresh')
        response.data = {
            'message': 'You have been logged out'
        }
        return response


__all__ = [
    'MeView',
    'UserRegisterView',
    'UserLoginView',
    'UserLogoutView',
    'UpdateUserView',
]
