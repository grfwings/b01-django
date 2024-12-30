from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("about/", views.about, name="about"),
    path("projects/", views.projects, name="projects"),
    path("sitemap/", views.sitemap, name="sitemap"),
    path("status/", views.status, name="status"),
    #path("login", views.login, name="login"),
]
