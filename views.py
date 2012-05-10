### VIEWS.PY

from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render_to_response
from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.contrib.sites.models import Site
from communication.models import *
import datetime
import os
import subprocess

def welcome(request):
	if request.user.is_authenticated():
		return HttpResponseRedirect('/home/')
	return render_to_response('welcome.html')

def about(request):
	return render_to_response('Information.html')

def tigerchat(request):
	return HttpResponseRedirect('/home/')

@login_required   
def home(request):
	try:
		person = Person.objects.get(jid=request.user.username)
	except:
		return HttpResponseRedirect('/register/')
	

	return render_to_response('tigerchathome.html', {'first_name': person.first_name, 'last_name': person.last_name})
