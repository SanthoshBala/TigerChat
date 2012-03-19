import os
import sys
from localsettings import PATH_TO_TIGERCHAT


path = PATH_TO_TIGERCHAT
if path not in sys.path:
    sys.path.append(path)

os.environment['DJANGO_SETTINGS_MODULE'] = 'tigerchat.settings'

import django.core.handlers.wsgi
application = django.core.handlers.wsgi.WSGIHandler()
