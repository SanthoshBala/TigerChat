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

@login_required   
def tigerchat_main(request):
	# Create Person profile if one does not already exist
	person, created = Person.objects.get_or_create(jid=request.user.username)

	# Create ejabberd user if necessary
	if (not person.has_jabber_acct):
		person.user = request.user
		person.has_jabber_acct = True
		person.save()
		# redirect to /register/ for ejabberd creation
		http_response = HttpResponseRedirect('/register/')
		return http_response

	return render_to_response('tigerchathome.html', {'this_user_name': person.jid})



def datetime(request):
	now = datetime.datetime.now()
	return render_to_response('datetime_template.html', {'current_date': now});
