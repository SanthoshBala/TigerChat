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

## search(): Returns list of all people that match query term
## at the moment, cannot search by individual fields
def search(request):
    # Create command from search query term
    query = request.GET.get('query')
   # cmd = '/usr/bin/ldapsearch -x -h ldap.princeton.edu -u -b o=\'Princeton University,c=US\' \"(cn=*%s*)\" uid givenName sn purescollege puclassyear puhomedepartmentnumber' % query
    #fin, fout = os.popen4(cmd)
    # Get all entries from ldapsearch
    
    #entries = fout.read().split('#')[8:-3]
    fout = getoutput('/usr/bin/ldapsearch -x -h ldap.princeton.edu -u -b o="Princeton University, c=US" "(cn=*%s*)" uid givenName sn purescollege puclassyear puhomedepartmentnumber' % query)
    entries = fout.split('#')[8:-3]
#    data = {}
    data = []
#    data['results'] = []
    # Parse each entry to create dict
    for entry in entries:
        result = {}
        entry = entry.strip().split('\n')
        # Parse each line in entry
        for line in entry:
            fields = line.split()
            if fields[0] == 'uid:':
                try:
                    result['username'] = fields[1]
                except:
                    continue
            elif fields[0] == 'givenName:':
                try:
                    result['first_name'] = fields[1]
                except:
                    continue
            elif fields[0] == 'sn:':
                try:
                    result['last_name'] = fields[1]
                except:
                    continue
            elif fields[0] == 'purescollege:':
                try:
                    result['dorm'] = fields[1]
                except:
                    continue
            elif fields[0] == 'puclassyear:':
                try:
                    result['class'] = fields[1]
                except:
                    continue
            elif fields[0] == 'puhomedepartmentnumber:':
                try:
                    result['dept'] = fields[1]
                except:
                    continue
            else:
                continue
#        data['results'].append(result)
        data.append(result)


    for POI in data:
	person_name = POI.get("username")
	# check if person is an existing user
	poi_user = User.objects.filter(username=person_name)
	if len(poi_user) == 0: # no matching user
		POI['friendship_status'] = 'DNE'
	# result matches existing user
	elif len(poi_user) == 1: 
		poi_user = poi_user[0]
		# check if person is a friend
		friendship = Friendship.objects.filter( Q(creator=request.user.person, receiver=poi_user.person) |
												Q(creator=poi_user.person, receiver=request.user.person))
		if len(friendship) == 0:
			POI['friendship_status'] = 'None'
		elif len(friendship) == 1:
			# check if I have sent a request to person
			if friendship[0].status == 'Confirmed':
				POI['friendship_status'] = 'Confirmed'
			else: 		# check if I have sent a request
				if friendship[0].creator == request.user.person:
					POI['friendship_status'] = 'Pending'
				else:
					POI['friendship_status'] = 'To_Accept'
		else:
			raise Exception('more than one user with username')

    response = simplejson.dumps(data, default=json_handler)
    return HttpResponse(response, mimetype='application/javascript')

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
        http_response = HttpReponse('Invited')
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
                
        data = simplejson.dumps(f, default=json_handler)
    
    http_response = HttpResponse(data, mimetype='application/javascript')
    return http_response
            
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

def remove_everything(request):   
    Friendship.objects.all().delete()
    Person.objects.all().delete()
    User.objects.all().delete()
    return HttpResponse('Everything Cleared');
    
def ldap_search(request):
    # parse params for what to search by
    # set up ldap connection
    server = 'ldap.princeton.edu'
    who = ''
    cred = ''
    ldap_connection = ldap.open(server)
    ldap_connection.simple_bind_s(who, cred)
    scope = ldap.SCOPE_SUBTREE
    base = "o=\'Princeton University,c=US\'"
    retrieve_attrs = None
    
    # perform search
    query = 'subramani'
    query_string = 'cn=*%s*' % query
    count = 0
    result_set = []
    result_id = ldap_connection.search(base, scope, query_string, retrieve_attrs)
    # parse results
    # return results
    
    
    
    
    
	
