from django.db import models


class Deployment(models.Model):
    id = models.AutoField(primary_key=True)
    repo_name = models.CharField(max_length=200)
    webpage = models.ForeignKey("llm.webpage", on_delete=models.CASCADE)

    class Meta:
        verbose_name = 'Deployment'
        verbose_name_plural = 'Deployments'

    def __str__(self):
        return self.repo_name


__all__ = ['Deployment']

