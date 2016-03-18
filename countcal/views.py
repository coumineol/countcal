from django import forms
from django.shortcuts import render
from django.contrib.auth import logout
from django.contrib.auth.models import User, Group, UserManager
from django.contrib.auth.decorators import login_required
from django.http import Http404, JsonResponse, HttpResponse, HttpResponsePermanentRedirect
from django.shortcuts import get_object_or_404
from django.views.generic import ListView, TemplateView, CreateView, UpdateView, DeleteView
from django.views.generic.base import RedirectView
from django.views.generic.detail import SingleObjectTemplateResponseMixin
from django.views.generic.edit import ModelFormMixin, ProcessFormView, BaseCreateView, BaseUpdateView
from django.core.urlresolvers import reverse_lazy
from rest_framework import viewsets
from rest_framework import status
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import mixins
from rest_framework import generics
from toptalproject.countcal.serializers import UserSerializer, GroupSerializer, MealSerializer
from toptalproject.countcal.models import Meal
from toptalproject.countcal.forms import AddMeal


class JSONResponseMixin(object):

    def render_to_json_response(self, context, **response_kwargs):
        return JsonResponse(
            self.get_data(context),
            **response_kwargs
        )

    def get_data(self, context):
        return context


class UserViewSet(viewsets.ModelViewSet):

    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer

    def get_queryset(self):
        return self.request.user.accounts.all()


class GroupViewSet(viewsets.ModelViewSet):

    queryset = Group.objects.all()
    serializer_class = GroupSerializer


class RedirectToList(RedirectView):

    def get_redirect_url(self, *args, **kwargs):
        if self.request.user.groups.filter(name='peon'):
            self.url = '/countcal/meals/'
        elif self.request.user.groups.filter(name='exterminator'):
            self.url = '/countcal/users/'
        elif self.request.user.is_staff:
            self.url = '/admin/'
        else:
            self.url = '/countcal/login/'

        return super(RedirectToList, self).get_redirect_url(*args, **kwargs)


class MealListView(ListView):

    model = Meal
    template_name='countcal/meals.html'

    def get_queryset(self):
        username = None
        if self.request.user.is_authenticated():
            active_user = self.request.user
            queryset = Meal.objects.filter(user=active_user).order_by('date')
            return queryset
        else:
            return None


class MealCreateView(BaseCreateView):

    model = Meal
    serializer_class = MealSerializer
    template_name = 'countcal/meal_create.html'
    fields = ['cal', 'date', 'comment']
    success_url = '/countcal/meals/'

    def form_valid(self, form):
        active_user = self.request.user
        form.instance.user = active_user
        response = super(MealCreateView, self).form_valid(form)
        if self.request.is_ajax():
            data = {
                'id': self.object.id,
                'cal': self.object.cal,
                'date': self.object.date,
                'comment': self.object.comment,
            }
            return JsonResponse(data)
        else:
            return response

    def render_to_response(self, context, **response_kwargs):
        return self.render_to_json_response(context, **response_kwargs)


class MealUpdateView(BaseUpdateView):

    model = Meal
    template_name='countcal/meal_edit.html'
    fields = ['cal', 'date', 'comment']
    success_url = reverse_lazy('meal_list')

    def form_valid(self, form):
        active_user = self.request.user
        form.instance.user = active_user
        response = super(MealUpdateView, self).form_valid(form)
        if self.request.is_ajax():
            data = {
                'id': self.object.id,
                'cal': self.object.cal,
                'date': self.object.date,
                'comment': self.object.comment,
            }
            return JsonResponse(data)
        else:
            return response

    def render_to_response(self, context, **response_kwargs):
        return self.render_to_json_response(context, **response_kwargs)


class MealDeleteView(DeleteView):

    model = Meal
    template_name='countcal/meal_delete.html'
    success_url = reverse_lazy('meal_list')


class UserListView(ListView):

    model = User
    template_name='countcal/users.html'

    def get_queryset(self):
        username = None
        if self.request.user.is_superuser:
            queryset = User.objects.filter()
            return queryset
        elif self.request.user.groups.filter(name='exterminator'):
            queryset = User.objects.filter(groups__name='peon')
            return queryset
        else:
            return None


# I didn't use this
class UserCreateView(CreateView):

    model = User
    serializer_class = UserSerializer
    template_name = 'countcal/user_create.html'
    fields = ['username', 'password']
    success_url = '/countcal/users/'

    def form_valid(self, form):
        active_user = self.request.user
        response = super(UserCreateView, self).form_valid(form)
        if self.request.is_ajax():
            data = {
                'id': self.object.id,
                'username': self.object.username,
            }
            return JsonResponse(data)
        else:
            return response

    def render_to_response(self, context, **response_kwargs):
        return self.render_to_json_response(context, **response_kwargs)


class UserUpdateView(UpdateView):

    model = User
    serializer_class = UserSerializer
    template_name = 'countcal/user_edit.html'
    fields = ['username']
    success_url = '/countcal/users/'


class UserDeleteView(DeleteView):

    model = User
    success_url = reverse_lazy('meal_list')


def logout_view(request):
    logout(request)


def register_view(request):
    username = request.POST.get('username')
    password = request.POST.get('password')
    group = request.POST.get('group')
    user = User.objects.create_user(username=username, password=password)
    user.groups.add(Group.objects.get(name=group))
    user.save()

    return HttpResponsePermanentRedirect("/countcal/login/")


def register_by_exterminator_view(request):
    username = request.POST.get('username')
    password = request.POST.get('password')
    user = User.objects.create_user(username=username, password=password)
    user.save()
    user.groups.add(Group.objects.get(name='peon'))

    data = {
        'id': user.id,
        'username': user.username,
    }

    return JsonResponse(data)


### REST API ###


class UserListCreateAPIView(generics.ListCreateAPIView):

    model = User
    serializer_class = UserSerializer

    def get_queryset(self):
        username = None
        if self.request.user.is_superuser:
            queryset = User.objects.filter()
            return queryset
        elif self.request.user.is_authenticated():
            queryset = User.objects.filter(groups__name='peon')
            return queryset
        else:
            queryset = User.objects.filter(groups__name='peon')
            return queryset


class UserRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):

    model = User
    queryset = User.objects.all()
    serializer_class = UserSerializer


class MealListCreateAPIView(generics.ListCreateAPIView):

    model = Meal
    queryset = Meal.objects.all()
    serializer_class = MealSerializer


class MealRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):

    model = Meal
    queryset = Meal.objects.all()
    serializer_class = MealSerializer