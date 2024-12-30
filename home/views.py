from django.http import HttpResponse
from django.template import loader
from django.shortcuts import render

def index(request):
    return render(request, 'home/index.html')
def about(request):
    return render(request, 'home/about.html')
def projects(request):
    return render(request, 'home/projects.html')
def sitemap(request):
    return render(request, 'home/sitemap.html')
def status(request):
    return render(request, 'home/status.html')
