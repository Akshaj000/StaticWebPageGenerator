from functools import wraps

from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated

from user.authentication import CookieTokenAuthentication, set_token_cookie


def handle_refresh_token(func):
    def wrapper(request, *args, **kwargs):
        response = func(request, *args, **kwargs)
        user, tokens = CookieTokenAuthentication().authenticate(request)
        if tokens:
            response = set_token_cookie(
                response,
                access_token=tokens['ACCESS_TOKEN'],
                refresh_token=tokens['REFRESH_TOKEN']
            )
        return response
    return wrapper


def auth_and_perms(view_func):
    @wraps(view_func)
    @authentication_classes([CookieTokenAuthentication])
    @permission_classes([IsAuthenticated])
    @handle_refresh_token
    def wrapper(request, *args, **kwargs):
        return view_func(request, *args, **kwargs)

    return wrapper


__all__ = [
    'handle_refresh_token',
    'auth_and_perms',
]


