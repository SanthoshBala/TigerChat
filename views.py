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
	return HttpResponse('Welcome to TigerChat! A chat portal for the Princeton University community. Stay tuned for updates on the final release of our product.')

def current_datetime(request):
   return render_to_response('echobot.html');

@login_required   
def tigerchat_main(request):
	# Create Person profile if one does not already exist
	person, created = Person.objects.get_or_create(jid=request.user.username)

	# Create ejabberd user if necessary
	if (not person.has_jabber_acct):
		person.user = request.user
		person.has_jabber_acct = True
		person.save()
		#args = 'sudo /usr/sbin/ejabberdctl register %s localhost pd' % person.jid
		#args = args.split()
		#out = subprocess.check_output(args, shell=False)
		http_response = HttpResponseRedirect('/register/')
		return http_response

	return render_to_response('tigerchathome.html', {'newperson': False, 'this_user_name': person.jid})

@login_required
def register_new_user(request):
	return render_to_response('LoginPage.html')

def new_datetime(request):
	now = datetime.datetime.now()
	return render_to_response('datetime_template.html', {'current_date': now});
