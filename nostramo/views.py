from django.shortcuts import render
from django.http import HttpResponse, JsonResponse

def index(request):
    return render(request, 'nostramo/index.html')
def about(request):
    return render(request, 'nostramo/about.html')
def sitemap(request):
    return render(request, 'nostramo/sitemap.html')
