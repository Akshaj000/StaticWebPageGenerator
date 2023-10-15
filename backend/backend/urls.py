from django.contrib import admin
from django.urls import path

from user.views import (
    me_view, update_user_view, user_logout_view, user_login_view, authenticate_google_view
)
from llm.views import (
    get_session_view, update_session_view, delete_session_view, create_session_view,
    get_sessions_view, update_content_view, delete_deployed_webpage_view, publish_webpage_view,
    regenerate_webpage_view, generate_webpage_view
)

urlpatterns = [
    path('api/admin/', admin.site.urls),

    # User
    path('api/auth/google/', authenticate_google_view),
    path('api/user/login/', user_login_view),
    path('api/user/logout/', user_logout_view),
    path('api/me/', me_view),
    path('api/me/update/', update_user_view),

    path('api/sessions/', get_sessions_view, name='get-session'),
    path('api/session/', get_session_view, name='get-session'),
    path('api/session/create/', create_session_view, name='create-session'),
    path('api/session/update/', update_session_view, name='update-session'),
    path('api/session/delete/', delete_session_view, name='delete-session'),

    path('api/webpage/update-content/', update_content_view, name='update-content'),
    path('api/webpage/generate/', generate_webpage_view, name='generate-webpage'),
    path('api/webpage/regenerate/', regenerate_webpage_view, name='regenerate-webpage'),
    path('api/webpage/publish/', publish_webpage_view, name='publish-webpage'),
    path('api/webpage/delete-deployment/', delete_deployed_webpage_view, name='delete-deployed-webpage'),
]
