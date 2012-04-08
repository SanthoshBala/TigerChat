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
