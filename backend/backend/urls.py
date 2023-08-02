from django.contrib import admin
from django.urls import path

from user.views import (
    MeView, UserRegisterView, UserLoginView, UserLogoutView, UpdateUserView
)
from llm.views import (
    GetSessionsView, CreateSessionView, UpdateSessionView,
    DeleteSessionView, GetSessionView, GenerateWebPageView,
    PublishWebPageView, DeleteDeployedWebPageView, RegenerateWebPageView, UpdateContentView
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/me/', MeView.as_view(), name='me'),
    path('api/login/', UserLoginView.as_view(), name='login'),
    path('api/logout/', UserLogoutView.as_view(), name='logout'),
    path('api/register/', UserRegisterView.as_view(), name='register'),
    path('api/me/update/', UpdateUserView.as_view(), name='update'),

    path('api/sessions/', GetSessionsView.as_view(), name='get-session'),
    path('api/session/', GetSessionView.as_view(), name='get-session'),
    path('api/session/create/', CreateSessionView.as_view(), name='create-session'),
    path('api/session/update/', UpdateSessionView.as_view(), name='update-session'),
    path('api/session/delete/', DeleteSessionView.as_view(), name='delete-session'),

    path('api/webpage/update-content/', UpdateContentView.as_view(), name='update-content'),
    path('api/webpage/generate/', GenerateWebPageView.as_view(), name='generate-webpage'),
    path('api/webpage/regenerate/', RegenerateWebPageView.as_view(), name='regenerate-webpage'),
    path('api/webpage/publish/', PublishWebPageView.as_view(), name='publish-webpage'),
    path('api/webpage/delete-deployment/', DeleteDeployedWebPageView.as_view(), name='delete-deployed-webpage'),
]
