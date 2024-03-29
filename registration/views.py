### REGISTRATION/VIEWS.PY

import os
import simplejson
import string
from commands import getoutput
from communication.models import *
from django.db.models import Q
from django.contrib.auth.decorators import login_required
from django.core.mail import send_mail, EmailMultiAlternatives
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render_to_response
from django.template.loader import render_to_string
from lib.django_json_handlers import json_handler
from communication.views import *
from search.views import get_ldap_record

##### USER VIEWS ######

## register_new_user(): Creates person for newly created user
@login_required
def register_new_user(request):
	#  if request.method == 'POST':
		# handle POST request
	#  else:
		# handle GET
	
	#  return render_to_response('new_user.html', {'form', form})
	
	person, created = Person.objects.get_or_create(jid=request.user.username)

	if (created):
		person.user = request.user
		person.has_jabber_acct = True
	else:
		return HttpResponseRedirect('/home/')

	# Check if a system invitation exists for this person

	invites = SystemInvitation.objects.filter(invitee_netid=person.jid)
	if len(invites) == 1:
		invite = invites[0]
		invite.delete()
	else:
		pass

	ldap_record = get_ldap_record(person.jid)
	try:
		# set first_name
		if 'first_name' in ldap_record:
			person.first_name = ldap_record['first_name']
		# set last_name
		if 'last_name' in ldap_record:
			person.last_name = ldap_record['last_name']
		# set dorm
		if 'dorm' in ldap_record:
			person.dorm = ldap_record['dorm']
		# set classyear
		if 'year' in ldap_record:
			person.year = ldap_record['year']
		# set department
		if 'major' in ldap_record:
			person.major = ldap_record['major']
	except:
		person.first_name = person.jid
	person.save()
	return render_to_response('newuser.html', {'user_name': person.jid, 'first_name': person.first_name, 'last_name': person.last_name})
	#return HttpResponseRedirect('/tigerchat/')


@login_required
def get_profile(request):
	person = request.user.person
	data = simplejson.dumps(person, default=json_handler)
	return HttpResponse(data, mimetype='application/javascript')
	
##### ADMIN VIEWS #####

## users(): Returns list of all users in database
def users(request):
    user_set = User.objects.all()
    data = simplejson.dumps(user_set, default=json_handler)
    http_response = HttpResponse(data, mimetype='application/javascript')
    return http_response

## people(): Returns list of all people in database
def people(request):
	people_set = Person.objects.all()
	data = simplejson.dumps(people_set, default=json_handler)
	http_response = HttpResponse(data, mimetype='application/javascript')
	return http_response

## remove_everything(): Deletes all currently existing views
def remove_everything(request):
    Friendship.objects.all().delete()
    Person.objects.all().delete()
    User.objects.all().delete()
    Room.objects.all().delete()
    RoomInvitation.objects.all().delete()
    return HttpResponse('Everything Cleared');
