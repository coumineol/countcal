from django import forms
from toptalproject.countcal.models import Meal

class AddMeal(forms.Form):
    date = forms.DateField(widget=forms.TextInput(attrs=
                                {
                                    'class':'datepicker'
                                }))
    cal = forms.IntegerField(widget=forms.TextInput())

    fields = ['cal','date']