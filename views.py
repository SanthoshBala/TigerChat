from django.http import HttpResponse
from django.shortcuts import render_to_response
import datetime

def home(request):
	return HttpResponse('THIS. IS. NOT. TIGERCHAT!!!')
	

def current_datetime(request):
   return render_to_response('echobot.html');

def new_datetime(request):
	now = datetime.datetime.now()
	return render_to_response('datetime_template.html', {'current_date': now});
