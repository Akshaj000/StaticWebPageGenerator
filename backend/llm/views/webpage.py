from rest_framework.decorators import api_view
from rest_framework.response import Response
from llm.models import Session, Webpage
from user.decorators import auth_and_perms


@api_view(['POST'])
@auth_and_perms
def update_content_view(request):
    user = request.user
    data = request.data
    if "sessionID" not in data:
        return Response(status=400)
    try:
        session = Session.objects.get(id=data['sessionID'], user=user)
    except Session.DoesNotExist:
        return Response(status=400)
    webpage = Webpage.objects.filter(session=session)
    if not webpage.exists():
        return Response(status=400)
    webpage = webpage.first()
    old_code = webpage.htmlContent + webpage.cssContent + webpage.jsContent
    if "htmlContent" in data:
        webpage.htmlContent = data['htmlContent']
    if "cssContent" in data:
        webpage.cssContent = data['cssContent']
    if "jsContent" in data:
        webpage.jsContent = data['jsContent']
    webpage.save()
    if "publish" in data and data['publish']:
        if webpage.state == "PUBLISHED":
            webpage.update_deployment(old_code=old_code)
        else:
            webpage.publish_webpage()
    return Response(status=200)


@api_view(['POST'])
@auth_and_perms
def generate_webpage_view(request):
    user = request.user
    data = request.data
    if "sessionID" not in data:
        return Response(status=400)
    try:
        session = Session.objects.get(id=data['sessionID'], user=user)
    except Session.DoesNotExist:
        return Response(status=400)
    if "topic" not in data:
        return Response(status=400)
    if "specifications" not in data:
        return Response(status=400)
    if "hostOnGithub" in data and (user.github_username is None or user.github_token is None):
        return Response(status=400)
    session.name = data['topic']
    session.save()
    webpage = Webpage.objects.create(
        session=session,
        topic=data['topic'],
        specifications=data['specifications'],
        hostOnGithub=data['hostOnGithub'] if "hostOnGithub" in data else False,
    )
    webpage.generate_webpage()
    return Response(status=200)


@api_view(['POST'])
@auth_and_perms
def regenerate_webpage_view(request):
    user = request.user
    data = request.data
    if "sessionID" not in data:
        return Response(status=400)
    try:
        session = Session.objects.get(id=data['sessionID'], user=user)
    except Session.DoesNotExist:
        return Response(status=400)
    webpage = Webpage.objects.filter(session=session)
    if not webpage.exists():
        return Response(status=400)
    if "topic" not in data:
        return Response(status=400)
    if "specifications" not in data:
        return Response(status=400)
    webpage = webpage.first()
    webpage.topic = data['topic']
    webpage.specifications = data['specifications']
    webpage.save()
    webpage.update_webpage()
    return Response(status=200)


@api_view(['POST'])
@auth_and_perms
def publish_webpage_view(request):
    user = request.user
    data = request.data
    if "sessionID" not in data:
        return Response(status=400)
    try:
        session = Session.objects.get(id=data['sessionID'], user=user)
    except Session.DoesNotExist:
        return Response(status=400)
    webpage = Webpage.objects.filter(session=session)
    if not webpage.exists():
        return Response(status=400)
    if user.github_username is None or user.github_token is None:
        return Response(status=400)
    webpage = webpage.first()
    if webpage.state != "GENERATED":
        return Response(status=400)
    webpage.hostOnGithub = True
    webpage.save()
    webpage.publish_webpage()
    return Response(status=200)


@api_view(['POST'])
@auth_and_perms
def delete_deployed_webpage_view(request):
    user = request.user
    data = request.data
    if "sessionID" not in data:
        return Response(status=400)
    try:
        session = Session.objects.get(id=data['sessionID'], user=user)
    except Session.DoesNotExist:
        return Response(status=400)
    webpage = Webpage.objects.filter(session=session)
    if not webpage.exists():
        return Response(status=400)
    if user.github_username is None or user.github_token is None:
        return Response(status=400)
    webpage = webpage.first()
    if webpage.state != "PUBLISHED":
        return Response(status=400)
    webpage.delete_deployment()
    return Response(status=200)


__all__ = [
    'update_content_view',
    'generate_webpage_view',
    'regenerate_webpage_view',
    'publish_webpage_view',
    'delete_deployed_webpage_view',
]
