from django.db import models


class Session(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200, default='Session')
    user = models.ForeignKey('user.User', on_delete=models.CASCADE)
    memory = models.JSONField(null=True, blank=True)

    class Meta:
        verbose_name = 'Session'
        verbose_name_plural = 'Sessions'

    def __str__(self):
        return str(self.id)


__all__ = ['Session']
