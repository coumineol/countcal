# -*- coding: utf-8 -*-
# Generated by Django 1.9.2 on 2016-03-15 12:34
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('countcal', '0002_meal_comment'),
    ]

    operations = [
        migrations.AlterField(
            model_name='meal',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='meals', to=settings.AUTH_USER_MODEL),
        ),
    ]
