from django.http import HttpResponse
from django.shortcuts import render_to_response
from communication.models import *
import datetime

def home(request):
	return HttpResponse('THIS. IS. NOT. TIGERCHAT!!!')
	

def current_datetime(request):
   return render_to_response('echobot.html');
   
def tigerchat_main(request):
	# Create Person profile if one does not already exist
	#person = Person.objects.get_or_create(username=request.user.username)
	#return HttpResponse(request.user.username)
	return render_to_response('tigerchathome.html');

def new_datetime(request):
	now = datetime.datetime.now()
	return render_to_response('datetime_template.html', {'current_date': now});
