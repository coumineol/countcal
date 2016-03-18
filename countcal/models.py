from django.db import models
from django.contrib.auth.models import User


class Meal(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='meal_set')
    date = models.DateTimeField()
    cal = models.IntegerField()
    comment = models.CharField(max_length=200, default='_')

    def __str__(self):
        return str(self.id)