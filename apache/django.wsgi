import os
import sys

# os.environ['PATH_TO_TIGERCHAT'] is what we want to maximize
# generality, but for some reason this reference generates a
# KeyError exception
PATH_TO_WORKSPACE = '/home/santhosh/workspace/'
PATH_TO_TIGERCHAT = '/home/santhosh/workspace/TigerChat/'


if PATH_TO_WORKSPACE not in sys.path:
    sys.path.append(PATH_TO_WORKSPACE)

if PATH_TO_TIGERCHAT not in sys.path:
    sys.path.append(PATH_TO_TIGERCHAT)




os.environ['DJANGO_SETTINGS_MODULE'] = 'TigerChat.settings'


import django.core.handlers.wsgi
application = django.core.handlers.wsgi.WSGIHandler()

#def application(environ, start_response):
#    status = '200 OK'
#    output = 'Hello World!'
#    
#   response_headers = [('Content-type', 'text/plain'),
#                        ('Content-Length', str(len(output)))]
#                        
#    start_response(status, response_headers)
#    return [output]
