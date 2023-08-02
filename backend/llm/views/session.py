from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from llm.models import Session, Webpage


class GetSessionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        sessions = user.session_set.all()
        return JsonResponse([{
            'id': session.id,
            'name': session.name,
        } for session in sessions], safe=False, status=200)


class GetSessionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if "id" not in request.GET:
            return Response(status=400)
        try:
            session = Session.objects.get(id=request.GET['id'], user=user)
        except Session.DoesNotExist:
            return Response(status=400)
        page_data = {}
        webpage = Webpage.objects.filter(session=session)
        if webpage.exists():
            webpage = webpage.first()
            page_data = {
                'url': webpage.get_url(),
                'state': webpage.state,
                'deployment_status': webpage.deployment_status(),
                'topic': webpage.topic,
                'specifications': webpage.specifications,
                'hostOnGithub': webpage.hostOnGithub,
                'html': webpage.htmlContent,
                'css': webpage.cssContent,
                'js': webpage.jsContent,
            }

        return JsonResponse({
            'id': session.id,
            'name': session.name,
            'memory': session.memory,
            'webpage': page_data
        }, status=200)


class CreateSessionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        data = request.data
        if "name" not in data:
            data['name'] = 'New Session' + str(user.session_set.count())
        session = Session.objects.create(
            user=user,
            name=data['name'],
        )
        return JsonResponse({
            'id': session.id,
            'name': session.name
        }, status=200)


class UpdateSessionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        if "id" not in request.data:
            return Response(status=400)
        try:
            session = Session.objects.get(id=request.data['id'], user=user)
        except Session.DoesNotExist:
            return Response(status=400)
        data = request.data
        if "name" in data:

            session.name = data['name']
        session.save()
        return JsonResponse({
            'id': session.id,
            'name': session.name
        }, status=200)


class DeleteSessionView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        user = request.user
        if "id" not in request.data:
            return Response(status=400)
        try:
            session = Session.objects.get(id=request.data['id'], user=user)
        except Session.DoesNotExist:
            return Response(status=400)
        session.delete()
        return Response(status=200)


__all__ = [
    'GetSessionsView',
    'GetSessionView',
    'CreateSessionView',
    'UpdateSessionView',
    'DeleteSessionView',
]

