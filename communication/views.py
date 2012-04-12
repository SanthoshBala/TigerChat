# Create your views here.
from communication.models import *
from lib.django_json_handlers import json_handler
from django.http import HttpResponse
import simplejson

def users(request):
    user_set = User.objects.all()
    data = simplejson.dumps(user_set, default=json_handler)
    http_response = HttpResponse(data, mimetype='application/javascript')
    return http_response

def people(request):
    people_set = Person.objects.all()
    data = simplejson.dumps(people_set, default=json_handler)
    http_response = HttpResponse(data, mimetype='application/javascript')
