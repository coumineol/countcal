from django.conf.urls import url, include
from django.contrib import admin
from rest_framework import routers
from toptalproject.countcal import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)

urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^admin/', admin.site.urls),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^countcal/', include('toptalproject.countcal.urls')),
]