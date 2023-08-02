from django.db import models


class Webpage(models.Model):
    STATE = (
        ('GENERATING', 'Generating'),
        ('GENERATED', 'Generated'),
        ('PUBLISHING', 'Publishing'),
        ('PUBLISHED', 'Published')
    )
    id = models.AutoField(primary_key=True)
    session = models.OneToOneField('llm.Session', on_delete=models.CASCADE)
    topic = models.CharField(max_length=200)
    repo_name = models.CharField(max_length=200, null=True, blank=True)
    hostOnGithub = models.BooleanField(default=False)
    specifications = models.CharField(max_length=500)
    state = models.CharField(
        max_length=20,
        choices=STATE,
        default='GENERATING'
    )

    htmlContent = models.TextField()
    jsContent = models.TextField()
    cssContent = models.TextField()

    def generate_webpage(self):
        from llm.tasks import generate_static_pages
        generate_static_pages(self)

    def update_webpage(self):
        from llm.tasks import update_static_page
        update_static_page(self)

    def publish_webpage(self):
        from llm.tasks import publish_webpage
        publish_webpage(self)

    def update_deployment(self, old_code=None):
        from llm.tasks import update_deployment
        update_deployment(self, old_code=old_code)

    def delete_deployment(self):
        from llm.tasks import delete_deployment
        delete_deployment(self)

    def deployment_status(self):
        from llm.utils.github import check_deployment_status
        return check_deployment_status(
            username=self.session.user.github_username,
            token=self.session.user.github_token,
            repo_id=self.repo_name
        )

    def get_url(self):
        return f"https://{self.session.user.github_username}.github.io/{self.repo_name}"

    class Meta:
        verbose_name = 'Webpage'
        verbose_name_plural = 'Webpages'

    def __str__(self):
        return self.topic


__all__ = ['Webpage']
