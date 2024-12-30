from django.contrib import admin
from django.urls import include, path


urlpatterns = [
    path('', include('home.urls')),
    path('login/', admin.site.urls),
    path('monospaceweb/', include('monospaceweb.urls')),
    path('nostramo/', include('nostramo.urls')),
]
