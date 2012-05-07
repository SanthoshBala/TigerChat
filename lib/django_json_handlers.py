from communication.models import *
from django.db.models.query import QuerySet

def json_handler(obj):
	# Student
	if isinstance(obj, Person):
		base_dict = {
			'username': obj.user.username,
			'first_name': obj.first_name,
			'last_name': obj.last_name,
			'jid': obj.jid,
			'major': obj.major,
			}

		return base_dict

	elif isinstance(obj, User):
		base_dict = {
			'username': obj.username,
			'first_name': obj.first_name,
			'last_name': obj.last_name,
			}
		return base_dict

	elif isinstance(obj, Friendship):
		base_dict = {
			'status': obj.status,
			'creator': obj.creator.jid,
			'receiver': obj.receiver.jid,
			}
		return base_dict
	elif isinstance(obj, Room):
		base_dict = {
			'room_name': obj.name,
			'room_jid': obj.jid,
			'persistent': obj.persistent,
			'room_private': obj.private,
			'admin': obj.admins.all(),
		}
		return base_dict
	elif isinstance(obj, RoomInvitation):
		base_dict = {
			'invitee_jid': obj.invitee.jid,
			'inviter_jid': obj.inviter.jid,
			'room_jid': obj.room.jid,
			'room_name': obj.room.name,
		}
		return base_dict
	elif isinstance(obj, QuerySet):
		return list(obj)
	else:
		raise TypeError, 'Could not parse json for object'
