# Create your views here.
from django.db.models import Q
from commands import getoutput
from django.http import HttpResponse
import string
import simplejson
from lib.django_json_handlers import json_handler
from communication.models import *

## search(): Returns list of all people that match query term
## at the moment, cannot search by individual fields
def search_ldap(request):
    # Create command from search query term
    query = request.GET.get('query')
   # cmd = '/usr/bin/ldapsearch -x -h ldap.princeton.edu -u -b o=\'Princeton University,c=US\' \"(cn=*%s*)\" uid givenName sn purescollege puclassyear puhomedepartmentnumber' % query
    #fin, fout = os.popen4(cmd)
    # Get all entries from ldapsearch
    
    #entries = fout.read().split('#')[8:-3]
    fout = getoutput('/usr/bin/ldapsearch -x -h ldap.princeton.edu -u -b o="Princeton University, c=US" "(cn=*%s*)"' % query)
    entries = fout.split('#')[8:-3]
#   data = {}
    data = []
#   data['results'] = []
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
            if fields[0] == 'mail:':
                try:
                    uid = fields[1].split('@')[0]
                    result['mail'] = fields[1]
                    result['username'] = uid
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
#       data['results'].append(result)
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
                else:       # check if I have sent a request
                    if friendship[0].creator == request.user.person:
                        POI['friendship_status'] = 'Pending'
                    else:
                        POI['friendship_status'] = 'To_Accept'
            else:
                raise Exception('more than one user with username')

    response = simplejson.dumps(data, default=json_handler)
    return HttpResponse(response, mimetype='application/javascript')


# returns a dictionary representing user_netid's ldap record
def get_ldap_record(user_netid):
    fout = getoutput('/usr/bin/ldapsearch -x -h ldap.princeton.edu -u -b o="Princeton University, c=US" "(mail=%s@princeton.edu)"' % user_netid)
    entries = fout.split('#')[8:-3]
    entry = entries[0]
    result = {}
    # Parse each entry to create dict
    entry = entry.strip().split('\n')
    # Parse each line in entry
    for line in entry:
        fields = line.split()
        if fields[0] == 'uid:':
            try:
                result['username'] = fields[1]
            except:
                continue
        elif fields[0] == 'mail:':
                try:
                    uid = fields[1].split('@')[0]
                    result['mail'] = fields[1]
                    result['username'] = uid
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
                result['year'] = fields[1]
            except:
                continue
        elif fields[0] == 'puhomedepartmentnumber:':
            try:
                result['dept'] = fields[1]
            except:
                continue
        else:
            continue
    return result
