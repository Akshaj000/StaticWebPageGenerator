from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('User must have an email address')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    EMAIL_FIELD = 'email'
    USERNAME_FIELD = 'email'

    id = models.AutoField(primary_key=True)
    email = models.EmailField(unique=True)
    name = models.CharField(
        max_length=100,
        blank=True, null=True
    )

    openai_key = models.CharField(max_length=500, null=True, blank=True)
    github_username = models.CharField(max_length=500, null=True, blank=True)
    github_token = models.CharField(max_length=500, null=True, blank=True)

    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    meta = models.JSONField(default=dict)
    settings = models.JSONField(default=dict)

    objects = UserManager()

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return self.email


__all__ = [
    'User',
]
