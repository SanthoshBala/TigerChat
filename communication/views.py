# Create your views here.
from django.db.models import Q
from communication.models import *
from lib.django_json_handlers import json_handler
from django.contrib.auth.decorators import login_required
from django.core.mail import send_mail, EmailMultiAlternatives
from django.template.loader import render_to_string
from django.http import HttpResponse
import os
import simplejson
import string
from commands import getoutput


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

    

    
    
    
    
    
    
