from django.db import models
from django.contrib.auth.models import User
# Create your models here.

FRIENDSHIP_STATUS_CHOICES = (('C', 'Confirmed'),
                             ('P', 'Pending'))

GROUP_STATUS_CHOICES = (('C', 'Confirmed'),
                             ('P', 'Pending'))

# Person
class Person(models.Model):
    user = models.OneToOneField(User, null=True, blank=True)
    jid = models.CharField(max_length=30)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    major = models.CharField(max_length=30)
    dorm = models.CharField(max_length=30)
    year = models.IntegerField(null=True, blank=True)
    has_jabber_acct = models.BooleanField(default=False)
    
# 1:1 relationship
class Friendship(models.Model):
    status = models.CharField(max_length=30, choices=FRIENDSHIP_STATUS_CHOICES)
    creator = models.ForeignKey(Person, related_name='creator', null=True, blank=True)
    receiver = models.ForeignKey(Person, related_name='receiver')

# Way of managing multi-user chat
class Room(models.Model):
    name = models.CharField(max_length=30)
    jid = models.CharField(max_length=30)
    members = models.ManyToManyField(Person, related_name='room_members')
    admins = models.ManyToManyField(Person, related_name='admins')
    private = models.BooleanField(default=True)
    persistent = models.BooleanField(default=True)
    
# Way of managing what friends belong to what groups in buddy list
class Group(models.Model):
	owner = models.OneToOneField(Person, related_name='owner')
	members = models.ManyToManyField(Person, related_name='group_members')

# System invitations
class SystemInvitation:
	inviter = models.ManyToManyField(Person, related_name='sys_inviter')
	invitee_netid = models.CharField(max_length=30)

# Way of managing invitations to a room
class RoomInvitation:
	inviter = models.ManyToManyField(Person, related_name='room_inviter')
	invitee = models.ManyToManyField(Person, related_name='room_invitee')
	room = models.ManyToManyField(Room, related_name='room')
