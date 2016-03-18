from django.contrib.auth import views as auth_views
from django.conf.urls import url, include
from django.views.generic import ListView, TemplateView
from django.views.generic.base import RedirectView
from rest_framework.urlpatterns import format_suffix_patterns
from toptalproject.countcal import views
from toptalproject.countcal.models import Meal
from toptalproject.countcal.views import RedirectToList, MealListView, MealCreateView, MealListCreateAPIView, \
                                         MealRetrieveUpdateDestroyAPIView, UserListView, UserListCreateAPIView, \
                                         UserRetrieveUpdateDestroyAPIView, register_view, UserCreateView, MealUpdateView, \
                                         register_by_exterminator_view


urlpatterns = [
    url(r'^$', TemplateView.as_view(template_name="countcal/index.html")),
    url(r'^login/$', auth_views.login, {'template_name': 'countcal/login.html'}),
    url(r'^logout/$', 'django.contrib.auth.views.logout', {'next_page': '/countcal/login/'}),  # !!!
    url(r'^register/$', TemplateView.as_view(template_name='countcal/register.html')),
    url(r'^registered/$', register_view),
    url(r'^redirect/$', RedirectToList.as_view()),
    url(r'^meals/$', MealListView.as_view(), name='meal_list'),
    url(r'^meals/create/$', MealCreateView.as_view(), name='meal_create'),
    url(r'^meals/update/$', MealUpdateView.as_view(), name='meal_update'),
    url(r'^meals/(?P<pk>[0-9]+)/update/$', views.MealUpdateView.as_view(), name='meal_edit'),
    url(r'^meals/(?P<pk>[0-9]+)/delete/$', views.MealDeleteView.as_view(), name='meal_delete'),
    url(r'^users/$', UserListView.as_view(), name='user_list'),
    url(r'^users/create/$', UserCreateView.as_view(), name='user_create'),
    url(r'^users/create_by_exterminator/$', register_by_exterminator_view),
    url(r'^users/(?P<pk>[0-9]+)/update/$', views.UserUpdateView.as_view(), name='user_edit'),
    url(r'^users/(?P<pk>[0-9]+)/delete/$', views.UserDeleteView.as_view(), name='user_delete'),
    url(r'^api/meals/$', MealListCreateAPIView.as_view()),
    url(r'^api/meals/(?P<pk>[0-9]+)/$', MealRetrieveUpdateDestroyAPIView.as_view()),
    url(r'^api/users/$', UserListCreateAPIView.as_view()),
    url(r'^api/users/(?P<pk>[0-9]+)/$', UserRetrieveUpdateDestroyAPIView.as_view()),
]


# urlpatterns = format_suffix_patterns(urlpatterns) # !!!