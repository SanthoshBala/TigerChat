# encoding: utf-8
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models

class Migration(SchemaMigration):

    def forwards(self, orm):
        
        # Adding model 'Person'
        db.create_table('communication_person', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('user', self.gf('django.db.models.fields.related.OneToOneField')(to=orm['auth.User'], unique=True, null=True, blank=True)),
            ('jid', self.gf('django.db.models.fields.CharField')(max_length=30)),
            ('first_name', self.gf('django.db.models.fields.CharField')(max_length=30)),
            ('last_name', self.gf('django.db.models.fields.CharField')(max_length=30)),
            ('major', self.gf('django.db.models.fields.CharField')(max_length=30)),
            ('dorm', self.gf('django.db.models.fields.CharField')(max_length=30)),
            ('year', self.gf('django.db.models.fields.IntegerField')(null=True, blank=True)),
            ('has_jabber_acct', self.gf('django.db.models.fields.BooleanField')(default=False)),
        ))
        db.send_create_signal('communication', ['Person'])

        # Adding model 'Friendship'
        db.create_table('communication_friendship', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('status', self.gf('django.db.models.fields.CharField')(max_length=30)),
            ('creator', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='creator', null=True, to=orm['communication.Person'])),
            ('receiver', self.gf('django.db.models.fields.related.ForeignKey')(related_name='receiver', to=orm['communication.Person'])),
        ))
        db.send_create_signal('communication', ['Friendship'])

        # Adding model 'Room'
        db.create_table('communication_room', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=30)),
            ('jid', self.gf('django.db.models.fields.CharField')(max_length=30)),
            ('private', self.gf('django.db.models.fields.BooleanField')(default=True)),
            ('persistent', self.gf('django.db.models.fields.BooleanField')(default=True)),
        ))
        db.send_create_signal('communication', ['Room'])

        # Adding M2M table for field members on 'Room'
        db.create_table('communication_room_members', (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('room', models.ForeignKey(orm['communication.room'], null=False)),
            ('person', models.ForeignKey(orm['communication.person'], null=False))
        ))
        db.create_unique('communication_room_members', ['room_id', 'person_id'])

        # Adding M2M table for field admins on 'Room'
        db.create_table('communication_room_admins', (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('room', models.ForeignKey(orm['communication.room'], null=False)),
            ('person', models.ForeignKey(orm['communication.person'], null=False))
        ))
        db.create_unique('communication_room_admins', ['room_id', 'person_id'])

        # Adding model 'Group'
        db.create_table('communication_group', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('owner', self.gf('django.db.models.fields.related.OneToOneField')(related_name='owner', unique=True, to=orm['communication.Person'])),
        ))
        db.send_create_signal('communication', ['Group'])

        # Adding M2M table for field members on 'Group'
        db.create_table('communication_group_members', (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('group', models.ForeignKey(orm['communication.group'], null=False)),
            ('person', models.ForeignKey(orm['communication.person'], null=False))
        ))
        db.create_unique('communication_group_members', ['group_id', 'person_id'])

        # Adding model 'SystemInvitation'
        db.create_table('communication_systeminvitation', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('inviter', self.gf('django.db.models.fields.related.ForeignKey')(related_name='sys_inviter', to=orm['communication.Person'])),
            ('invitee_netid', self.gf('django.db.models.fields.CharField')(max_length=30)),
        ))
        db.send_create_signal('communication', ['SystemInvitation'])

        # Adding model 'RoomInvitation'
        db.create_table('communication_roominvitation', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('inviter', self.gf('django.db.models.fields.related.ForeignKey')(related_name='room_inviter', to=orm['communication.Person'])),
            ('invitee', self.gf('django.db.models.fields.related.ForeignKey')(related_name='room_invitee', to=orm['communication.Person'])),
            ('room', self.gf('django.db.models.fields.related.ForeignKey')(related_name='room', to=orm['communication.Room'])),
        ))
        db.send_create_signal('communication', ['RoomInvitation'])


    def backwards(self, orm):
        
        # Deleting model 'Person'
        db.delete_table('communication_person')

        # Deleting model 'Friendship'
        db.delete_table('communication_friendship')

        # Deleting model 'Room'
        db.delete_table('communication_room')

        # Removing M2M table for field members on 'Room'
        db.delete_table('communication_room_members')

        # Removing M2M table for field admins on 'Room'
        db.delete_table('communication_room_admins')

        # Deleting model 'Group'
        db.delete_table('communication_group')

        # Removing M2M table for field members on 'Group'
        db.delete_table('communication_group_members')

        # Deleting model 'SystemInvitation'
        db.delete_table('communication_systeminvitation')

        # Deleting model 'RoomInvitation'
        db.delete_table('communication_roominvitation')


    models = {
        'auth.group': {
            'Meta': {'object_name': 'Group'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '80'}),
            'permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'})
        },
        'auth.permission': {
            'Meta': {'ordering': "('content_type__app_label', 'content_type__model', 'codename')", 'unique_together': "(('content_type', 'codename'),)", 'object_name': 'Permission'},
            'codename': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'content_type': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['contenttypes.ContentType']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        'auth.user': {
            'Meta': {'object_name': 'User'},
            'date_joined': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime(2012, 5, 1, 0, 2, 23, 977338)'}),
            'email': ('django.db.models.fields.EmailField', [], {'max_length': '75', 'blank': 'True'}),
            'first_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'groups': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['auth.Group']", 'symmetrical': 'False', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'is_staff': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'is_superuser': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'last_login': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime(2012, 5, 1, 0, 2, 23, 977283)'}),
            'last_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'password': ('django.db.models.fields.CharField', [], {'max_length': '128'}),
            'user_permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'}),
            'username': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '30'})
        },
        'communication.friendship': {
            'Meta': {'object_name': 'Friendship'},
            'creator': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'creator'", 'null': 'True', 'to': "orm['communication.Person']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'receiver': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'receiver'", 'to': "orm['communication.Person']"}),
            'status': ('django.db.models.fields.CharField', [], {'max_length': '30'})
        },
        'communication.group': {
            'Meta': {'object_name': 'Group'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'members': ('django.db.models.fields.related.ManyToManyField', [], {'related_name': "'group_members'", 'symmetrical': 'False', 'to': "orm['communication.Person']"}),
            'owner': ('django.db.models.fields.related.OneToOneField', [], {'related_name': "'owner'", 'unique': 'True', 'to': "orm['communication.Person']"})
        },
        'communication.person': {
            'Meta': {'object_name': 'Person'},
            'dorm': ('django.db.models.fields.CharField', [], {'max_length': '30'}),
            'first_name': ('django.db.models.fields.CharField', [], {'max_length': '30'}),
            'has_jabber_acct': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'jid': ('django.db.models.fields.CharField', [], {'max_length': '30'}),
            'last_name': ('django.db.models.fields.CharField', [], {'max_length': '30'}),
            'major': ('django.db.models.fields.CharField', [], {'max_length': '30'}),
            'user': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['auth.User']", 'unique': 'True', 'null': 'True', 'blank': 'True'}),
            'year': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'})
        },
        'communication.room': {
            'Meta': {'object_name': 'Room'},
            'admins': ('django.db.models.fields.related.ManyToManyField', [], {'related_name': "'admins'", 'symmetrical': 'False', 'to': "orm['communication.Person']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'jid': ('django.db.models.fields.CharField', [], {'max_length': '30'}),
            'members': ('django.db.models.fields.related.ManyToManyField', [], {'related_name': "'room_members'", 'symmetrical': 'False', 'to': "orm['communication.Person']"}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '30'}),
            'persistent': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'private': ('django.db.models.fields.BooleanField', [], {'default': 'True'})
        },
        'communication.roominvitation': {
            'Meta': {'object_name': 'RoomInvitation'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'invitee': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'room_invitee'", 'to': "orm['communication.Person']"}),
            'inviter': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'room_inviter'", 'to': "orm['communication.Person']"}),
            'room': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'room'", 'to': "orm['communication.Room']"})
        },
        'communication.systeminvitation': {
            'Meta': {'object_name': 'SystemInvitation'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'invitee_netid': ('django.db.models.fields.CharField', [], {'max_length': '30'}),
            'inviter': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'sys_inviter'", 'to': "orm['communication.Person']"})
        },
        'contenttypes.contenttype': {
            'Meta': {'ordering': "('name',)", 'unique_together': "(('app_label', 'model'),)", 'object_name': 'ContentType', 'db_table': "'django_content_type'"},
            'app_label': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'model': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        }
    }

    complete_apps = ['communication']
