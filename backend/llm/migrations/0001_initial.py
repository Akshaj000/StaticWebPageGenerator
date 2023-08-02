# Generated by Django 4.2.3 on 2023-08-01 10:27

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Session',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('memory', models.JSONField()),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Session',
                'verbose_name_plural': 'Sessions',
            },
        ),
        migrations.CreateModel(
            name='Webpage',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('topic', models.CharField(max_length=200)),
                ('specifications', models.CharField(max_length=500)),
                ('htmlContent', models.TextField()),
                ('jsContent', models.TextField()),
                ('cssContent', models.TextField()),
                ('session', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='llm.session')),
            ],
            options={
                'verbose_name': 'Webpage',
                'verbose_name_plural': 'Webpages',
            },
        ),
        migrations.CreateModel(
            name='Deployment',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('repo_name', models.CharField(max_length=200)),
                ('webpage', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='llm.webpage')),
            ],
            options={
                'verbose_name': 'Deployment',
                'verbose_name_plural': 'Deployments',
            },
        ),
    ]