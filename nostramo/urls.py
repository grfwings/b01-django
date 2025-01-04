from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("about/", views.about, name="about"),
    path("sitemap/", views.sitemap, name="sitemap"),
    #path("login", views.login, name="login"),
]
