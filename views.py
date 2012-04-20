from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.conf import settings
from django.contrib.sites.models import Site
from communication.models import *
import datetime
import os
import subprocess


def home(request):
	return HttpResponse('THIS. IS. NOT. TIGERCHAT!!!')

def current_datetime(request):
   return render_to_response('echobot.html');
   
def tigerchat_main(request):
	# Create Person profile if one does not already exist
	person, created = Person.objects.get_or_create(jid=request.user.username)
	output = 'shit'
	# Create ejabberd user if necessary
	if (created):
		person.user = request.user
		person.save()
		args = 'sudo /usr/sbin/ejabberdctl register %s localhost pd' % person.jid
		args = args.split()
		out = subprocess.check_output(args, shell=False)
		return render_to_response('tigerchathome.html')

	return render_to_response('tigerchathome.html')


def new_datetime(request):
	now = datetime.datetime.now()
	return render_to_response('datetime_template.html', {'current_date': now});
