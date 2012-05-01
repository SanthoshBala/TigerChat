# Create your views here.
from django.db.models import Q
from communication.models import *
from lib.django_json_handlers import json_handler
from django.contrib.auth.decorators import login_required
from django.core.mail import send_mail, EmailMultiAlternatives
from django.template.loader import render_to_string
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseServerError
import os
import simplejson
import string
from commands import getoutput
from communication.models import *

## create_room(): create a new room
@login_required
def create_room(request):
	try:
		room_name = request.GET.get('name')
		room_jid = request.GET.get('jid')
	except:
		return HttpResponseBadRequest()
	try:
		room_private = request.GET.get('room_private')
	except:
		room_private = True
	try:
		room_persistent = request.GET.get('persistent')
	except:
		room_persistent = True
	owner = request.user.person
	room, created = Room.objects.get_or_create(jid=room_jid, name=room_name, private=room_private, persistent=room_persistent)
	
	if not created:
		response_dict = {'name': room_name, 'created': 'False', 'jid': room_jid, 'persistent': room_persistent, 'room_private':room_private}
		response = simplejson.dumps(response_dict, default=json_handler)
		return HttpResponse(response, mimetype='application/javascript')
	room.members.add(owner)
	room.admins.add(owner)
	response_dict = {'name': room_name, 'created': 'True', 'jid': room_jid, 'persistent': room_persistent, 'room_private':room_private}
	response = simplejson.dumps(response_dict, default=json_handler)
	return HttpResponse(response, mimetype='application/javascript')

## invite_person_to_room(): invite person to a room
@login_required
def invite_person_to_room(request):
	inviter_person = request.user.person
	try:
		invitee_jid = request.GET.get('invitee_jid')
		room_jid = request.GET.get('room_jid')
	except:
		return HttpResponseBadRequest()
	# verify this is a valid room
	try:
		room_object = Room.objects.get(jid=room_jid)
	except:
		return HttpResponseBadRequest('room %s does not exist' % room_jid)
	# see if person with invitee_jid exists
	invitees = Person.objects.filter(jid=invitee_jid)
	if len(invitees) is not 1:
		response_dict = {'invited': False, 'error': True}
		response = simplejson.dumps(response_dict, default=json_handler)
		return HttpResponse(response, mimetype='application/javascript')
	else:
		invitee_person = invitees[0]
		invitation = RoomInvitation.objects.create(invitee=invitee_person, room=room_object, inviter=inviter_person)
		response_dict = {'inviter_jid': inviter_person.jid, 'invitee_jid': invitee_jid, 'invited':True}
		response = simplejson.dumps(response_dict, default=json_handler)
		return HttpResponse(response, mimetype='application/javascript')

## leave_room(): make person leave room
@login_required
def leave_room(request):
	person = request.user.person
	try:
		room_jid = request.GET.get('room_jid')
	except:
		return HttpResponseBadRequest()
	rooms = Room.objects.filter(jid=room_jid)
	if len(rooms) is not 1:
		return HttpResponseServerError()
	else:
		room = rooms[0]
		room.members.remove(person)
		## WHAT DO WE DO WHEN THE LEAVING PERSON IS ADMIN???
		if len(room.members) == 0:
			room.delete()
		return HttpResponse('%s removed from %s' % (person.jid, room_jid))

## accept_invitation(): accept_invitation to room
def accept_invitation(request):
	person = request.user.person
	try:
		room_jid = request.GET.get('room_jid')
		inviter = request.GET.get('inviter_jid')
	except:
		return HttpResponseBadRequest()
	invitation = RoomInvitation.objects.filter(invitee=person)
	room = Room.objects.get(room_jid='room_jid')
	room.members.add(person)
	invitation.delete()
	room.save()
	
## get_friends() get this user's friend list
@login_required
def get_friends(request):
    user = request.user
    friendships = Friendship.objects.filter( Q(creator=user.person) |
                                             Q(receiver=user.person))
    friendships = friendships.filter(status='Confirmed')
    results = []
    for friendship in list(friendships):

        if (friendship.creator.jid == request.user.username):
            friend = friendship.receiver
        else:
            friend = friendship.creator
        results.append(friend)
        
    data = simplejson.dumps(results, default=json_handler)
    http_response = HttpResponse(data, mimetype='application/javascript')
    return http_response

## get pending friendships for this user
@login_required
def get_pending(request):
    user = request.user
    friendships = Friendship.objects.filter( Q(creator=user.person))
    friendships = friendships.filter(status='Pending')

    data = simplejson.dumps(friendships, default=json_handler)
    http_response = HttpResponse(data, mimetype='application/javascript')
    return http_response

## get rooms I"m a part of
@login_required
def get_rooms(request):
	person = request.user.person
	rooms = Room.objects.filter(members=person)
	
	data = simplejson.dumps(rooms, default=json_handler)
	return HttpResponse(data, mimetype='application/javascript')
	
## get rooms I"m a part of
@login_required
def get_room_invites(request):
	person = request.user.person
	room_invites = RoomInvitation.objects.filter(invitee_jid=person.jid)
	data = simplejson.dumps(room_invites, default=json_handler)
	return HttpResponse(data, mimetype='application/javascript')


## get request sent by this user
@login_required
def get_requests(request):
    user = request.user
    friendships = Friendship.objects.filter(Q(receiver=user.person))
    friendships = friendships.filter(status='Pending')

    data = simplejson.dumps(friendships, default=json_handler)
    http_response = HttpResponse(data, mimetype='application/javascript')
    return http_response

## set friend request from this user
@login_required
def add_friend(request):
    user = request.user
    friend_jid = request.GET.get('jid')

    potential_friends = Person.objects.filter(jid=friend_jid)
    ## If there is no person with this jid, just email them...
    if (len(potential_friends) == 0):
        ## send an email
        invitee = friend_jid
        inviter = request.user.person
        send_invitation_email(inviter, invitee)
        invitation = SystemInvitation.objects.create(inviter=inviter, invitee_netid=invitee)
        http_response = HttpResponse('Invited')
    elif (len(potential_friends) > 1):
        ## error
        raise Exception('Non-specific jid')
    else:
        friend = Person.objects.get(jid=friend_jid)
    ## see if there are existing friendships with these two
        friendships = Friendship.objects.filter( Q(creator=user.person, receiver=friend) |
                                             Q(creator=friend, receiver=user.person))

    ## if there are no existing friendships, create one
        if len(friendships) == 0:
            f = Friendship.objects.create(creator=user.person, receiver=friend)
            f.status = 'Pending'
            f.save()
        elif len(friendships) == 1:
            f = friendships[0]
            if f.status == 'Pending' and f.receiver == user.person:
                f.status = 'Confirmed'
                f.save()
                # if f.creator is the user.person, then they've already
            # sent this friend request, so ignore this message
            # else friendship already confirmed, so ignore
                
    return HttpResponse("Success")
            
## send email to invited friend
# inviter: string
# invitee: Person
def send_invitation_email(inviter, invitee):
    subject = 'Hello from Princeton TigerChat!'
    from_email = 'TigerChat@tigerchat.net'
    to = '%s@princeton.edu' % invitee
    inviter_name = '%s %s' % (inviter.first_name, inviter.last_name)
    html_content = render_to_string('invite_email.html', {'to_addr': to, 'inviter': inviter_name})
    text_content = '%s has invited you to join TigerChat!\nTigerChat is a chat portal built for the Princeton University community. Now you can always stay connected with your fellow Princetonians. Sign up with your University NetID and instantly chat with all of your friends. Join now at www.tigerchat.net.'
    msg = EmailMultiAlternatives(subject, text_content, from_email, [to])
    msg.attach_alternative(html_content, "text/html")
    msg.send()
