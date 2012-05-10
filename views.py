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

def home(request):
	if request.user.is_authenticated():
		return HttpResponseRedirect('/tigerchat/')
	return render_to_response('welcome.html')

def terms(request):
	return render_to_response('Information.html')
@login_required   
def tigerchat_main(request):
	try:
		person = Person.objects.get(jid=request.user.username)
	except:
		return HttpResponseRedirect('/register/')

	return render_to_response('tigerchathome.html', {'this_user_name': person.jid})
