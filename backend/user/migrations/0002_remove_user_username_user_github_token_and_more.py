# Generated by Django 4.2.3 on 2023-08-01 10:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='username',
        ),
        migrations.AddField(
            model_name='user',
            name='github_token',
            field=models.CharField(blank=True, max_length=500, null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='github_username',
            field=models.CharField(blank=True, max_length=500, null=True),
        ),
    ]