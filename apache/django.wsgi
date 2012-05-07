import os
import sys

# os.environ['PATH_TO_TIGERCHAT'] is what we want to maximize
# generality, but for some reason this reference generates a
# KeyError exception

<<<<<<< HEAD
PATH_TO_WORKSPACE = '/home/vyas/workspace/'
PATH_TO_TIGERCHAT = '/home/vyas/workspace/TigerChat/'
=======
PATH_TO_WORKSPACE = '/home/bansal/workspace/'
PATH_TO_TIGERCHAT = '/home/bansal/workspace/TigerChat/'
>>>>>>> 4dbebe28c674b3424b4d8a4eae59fdf175d4b05d

if PATH_TO_WORKSPACE not in sys.path:
    sys.path.append(PATH_TO_WORKSPACE)

if PATH_TO_TIGERCHAT not in sys.path:
    sys.path.append(PATH_TO_TIGERCHAT)

os.environ['DJANGO_SETTINGS_MODULE'] = 'TigerChat.settings'

import django.core.handlers.wsgi
application = django.core.handlers.wsgi.WSGIHandler()
