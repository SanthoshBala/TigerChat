# Create your views here.
from django.db.models import Q
from communication.models import *
from lib.django_json_handlers import json_handler
from django.http import HttpResponse
import os
import simplejson
import string

def users(request):
    user_set = User.objects.all()
    data = simplejson.dumps(user_set, default=json_handler)
    http_response = HttpResponse(data, mimetype='application/javascript')
    return http_response

def people(request):
    people_set = Person.objects.all()
    data = simplejson.dumps(people_set, default=json_handler)
    http_response = HttpResponse(data, mimetype='application/javascript')

def search(request):
    # Create command from search query term
    query = request.GET.get('query')
    cmd = '/usr/bin/ldapsearch -x -h ldap.princeton.edu -u -b o=\'Princeton University,c=US\' \"(cn=*%s*)\" uid givenName sn purescollege puclassyear puhomedepartmentnumber' % query
    fin, fout = os.popen4(cmd)
    # Get all entries from ldapsearch
    entries = fout.read().split('#')[8:-3]
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
    response = simplejson.dumps(data)
    return HttpResponse(response, mimetype='application/javascript')


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
    
def get_pending(request):
    user = request.user
    friendships = Friendship.objects.filter( Q(creator=user.person))
    friendships = friendships.filter(status='Pending')

    data = simplejson.dumps(friendships, default=json_handler)
    http_response = HttpResponse(data, mimetype='application/javascript')
    return http_response
        


def get_requests(request):
    user = request.user
    friendships = Friendship.objects.filter(Q(receiver=user.person))
    friendships = friendships.filter(status='Pending')

    data = simplejson.dumps(friendships, default=json_handler)
    http_response = HttpResponse(data, mimetype='application/javascript')
    return http_response



def add_friend(request):
    user = request.user
    friend_jid = request.GET.get('jid')
    friend, created = Person.objects.get_or_create(jid=friend_jid)

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
        
        
