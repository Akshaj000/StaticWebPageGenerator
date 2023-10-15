from urllib.parse import urlencode
import requests
from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import transaction
from django.shortcuts import redirect
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from user.authentication import CookieTokenAuthentication, generate_auth_token, set_token_cookie
from user.models import User

GOOGLE_ACCESS_TOKEN_OBTAIN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USER_INFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo"


def google_get_access_token(*, code: str, redirect_uri: str) -> str:
    data = {
        "code": code,
        "client_id": settings.GOOGLE_CLIENT_ID,
        "client_secret": settings.GOOGLE_CLIENT_SECRET,
        "redirect_uri": redirect_uri,
        "grant_type": "authorization_code",
    }
    response = requests.post(GOOGLE_ACCESS_TOKEN_OBTAIN_URL, data=data)
    if not response.ok:
        raise ValidationError("Failed to obtain access token from Google.")
    return response.json()["access_token"]


def google_get_user_info(*, access_token: str):
    response = requests.get(GOOGLE_USER_INFO_URL, params={"access_token": access_token})
    if not response.ok:
        raise ValidationError("Failed to obtain user info from Google.")
    return response.json()


@api_view(['GET'])
@authentication_classes([])
@permission_classes([])
def authenticate_google_view(request):
    with transaction.atomic():
        data = request.GET.dict()
        code = data.get("code")
        error = data.get("error")
        redirect_url = data.get("state")
        if error or not code:
            params = urlencode({"error": error})
            return redirect(f"{redirect_url}?{params}")
        try:
            access_token = google_get_access_token(code=code, redirect_uri=settings.REDIRECT_URI)
        except Exception as e:
            return redirect(f"{redirect_url}?error={e}")
        user_data = google_get_user_info(access_token=access_token)
        email = user_data['email']
        name = user_data['name']
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            user = User.objects.create_user(email=email, name=name)
            user.set_unusable_password()
            user.save()
        auth_token = generate_auth_token(user)
        response = redirect(redirect_url)
        set_token_cookie(response, auth_token=auth_token)
        return response


@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def user_login_view(request):
    response = TokenObtainPairView.as_view()(request)
    token_data = response.data
    access_token = token_data['access']
    refresh_token = token_data['refresh']
    response = Response(status=200)
    set_token_cookie(response, access_token=access_token, refresh_token=refresh_token)
    return response


@api_view(['POST'])
@authentication_classes([CookieTokenAuthentication])
@permission_classes([IsAuthenticated])
def user_logout_view(request):
    response = Response(status=200)
    response.delete_cookie('AUTH_TOKEN')
    return response


__all__ = [
    'authenticate_google_view',
    'user_login_view',
    'user_logout_view',
]
