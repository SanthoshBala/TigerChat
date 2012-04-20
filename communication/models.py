from django.db import models
from django.contrib.auth.models import User
# Create your models here.

FRIENDSHIP_STATUS_CHOICES = (('C', 'Confirmed'),
                             ('P', 'Pending'))

GROUP_STATUS_CHOICES = (('C', 'Confirmed'),
                             ('P', 'Pending'))


class Person(models.Model):
    user = models.OneToOneField(User, null=True, blank=True)
    jid = models.CharField(max_length=30)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    major = models.CharField(max_length=30)
    
class Friendship(models.Model):
    status = models.CharField(max_length=30, choices=FRIENDSHIP_STATUS_CHOICES)
    creator = models.ForeignKey(Person, related_name='creator', null=True, blank=True)
    receiver = models.ForeignKey(Person, related_name='receiver')

class Group(models.Model):
    jid = models.CharField(max_length=30)
    members = models.ManyToManyField(Person, related_name='members')
    status = models.CharField(max_length=30, choices=FRIENDSHIP_STATUS_CHOICES)
    admins = models.ManyToManyField(Person, related_name='admins')
