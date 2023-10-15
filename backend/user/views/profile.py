from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK

from user.decorators import auth_and_perms


@api_view(['GET'])
@auth_and_perms
def me_view(request, *args, **kwargs):
    user = request.user
    return Response(data={
        'email': user.email,
        'name': user.name,
        'openAIKey': user.openai_key,
        'githubUsername': user.github_username,
        'githubToken': user.github_token,
    }, status=HTTP_200_OK)


@api_view(['POST'])
@auth_and_perms
def update_user_view(request, *args, **kwargs):
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

    user_data = {
        'email': user.email,
        'name': user.name,
        'openAIKey': user.openai_key,
        'githubUsername': user.github_username,
        'githubToken': user.github_token,
    }

    return Response(data=user_data, status=HTTP_200_OK)


__all__ = [
    'me_view',
    'update_user_view'
]
