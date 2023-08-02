from django.contrib import admin
from .models import Webpage, Session, Deployment

admin.site.register(Webpage)
admin.site.register(Session)
admin.site.register(Deployment)
