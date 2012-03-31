from django.http import HttpResponse
from django.shortcuts import render_to_response
import datetime

def home(request):
	return HttpResponse('THIS. IS. TIGERCHAT!!!')

def time(request):
	now = datetime.datetime.now()
	return render_to_response('datetime.html', {"name": 'Santhosh Balasu'})
