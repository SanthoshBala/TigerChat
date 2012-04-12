from communication.models import *

def json_handler(obj):
    from django.db.models.query import QuerySet

    # Student
    if isinstance(obj, Person):
        base_dict = {
            'username': obj.username,
            'first_name': obj.first_name,
            'last_name': obj.last_name,
            'jid': obj.jid
            }

        return base_dict

    elif isinstance(obj, User):
        base_dict = {
            'username': obj.username,
            'first_name': obj.first_name,
            'last_name': obj.last_name,
            }
        return base_dict
    elif isinstance(obj, QuerySet):
        return list(obj)
    else:
        raise TypeError, 'Could not parse json for object'
