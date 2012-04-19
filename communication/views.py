# Create your views here.
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
