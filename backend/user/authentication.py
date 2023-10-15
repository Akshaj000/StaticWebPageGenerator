from datetime import datetime, timedelta

from django.conf import settings
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from cryptography.fernet import Fernet
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken

SECRET_KEY = settings.AUTH_KEY


def encrypt_tokens(access_token, refresh_token):
    cipher_suite = Fernet(SECRET_KEY)
    token_data = f"{access_token}:{refresh_token}".encode('utf-8')
    encrypted_token = cipher_suite.encrypt(token_data)
    return encrypted_token.decode('utf-8')


def decrypt_auth_token(auth_token):
    try:
        cipher_suite = Fernet(SECRET_KEY)
        decrypted_data = cipher_suite.decrypt(auth_token.encode('utf-8')).decode('utf-8')
        access_token, refresh_token = decrypted_data.split(':')
        return access_token, refresh_token
    except Exception:
        return None, None


def generate_auth_token(user):
    refresh_token = RefreshToken.for_user(user)
    access_token = str(refresh_token.access_token)
    auth_token = encrypt_tokens(access_token, str(refresh_token))
    return auth_token


def set_token_cookie(response, auth_token=None, refresh_token=None, access_token=None):
    if not auth_token:
        auth_token = encrypt_tokens(access_token, refresh_token)
    response.set_cookie(
        key='AUTH_TOKEN',
        value=auth_token,
        expires=datetime.now() + timedelta(hours=1),
        httponly=True,
        secure=True,
    )
    return response


def get_user_from_auth_token(auth_token):
    access_token, refresh_token = decrypt_auth_token(auth_token)
    if not access_token or not refresh_token:
        return None
    try:
        authentication = JWTAuthentication()
        validated_token = authentication.get_validated_token(access_token)
        user = authentication.get_user(validated_token)
        return user
    except AuthenticationFailed:
        pass
    return None


class CookieTokenAuthentication(BaseAuthentication):
    """
    Token-based authentication using cookies.
    """

    def authenticate(self, request):
        auth_token = request.COOKIES.get('AUTH_TOKEN')
        if not auth_token:
            return None, None
        access_token, refresh_token = decrypt_auth_token(auth_token)
        if not access_token or not refresh_token:
            return None, None
        try:
            authentication = JWTAuthentication()
            validated_token = authentication.get_validated_token(access_token)
            user = authentication.get_user(validated_token)
            return user, {
                "ACCESS_TOKEN": access_token,
                "REFRESH_TOKEN": refresh_token,
            }
        except AuthenticationFailed:
            pass
        return None, None


__all__ = [
    'CookieTokenAuthentication',
    'set_token_cookie',
    'generate_auth_token',
    'get_user_from_auth_token'
]
