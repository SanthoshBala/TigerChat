from django.conf.urls.defaults import patterns, include, url


#from TigerChat.views import current_datetime
# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    url(r'^$', 'TigerChat.views.home', name='home'),
    url(r'^time/$', 'TigerChat.views.datetime'),
    url(r'^tigerchat/$', 'TigerChat.views.tigerchat_main'),
    
    url(r'^login/$', 'django_cas.views.login'),
    url(r'^logout/$', 'django_cas.views.logout'),
    
    url(r'^search/$', 'TigerChat.search.views.search_ldap'),
    url(r'^search/students/$', 'TigerChat.search.views.search_students'),
    url(r'^search/rooms/$', 'TigerChat.search.views.search_rooms'),
    
    
    url(r'^friends/$', 'TigerChat.communication.views.get_friends'),
    url(r'^rooms/$', 'TigerChat.communication.views.get_rooms'),
    url(r'^pending/$', 'TigerChat.communication.views.get_pending'),
    url(r'^requests/$', 'TigerChat.communication.views.get_requests'),
    url(r'^invite/$', 'TigerChat.communication.views.invite_user'),
    url(r'^addfriend/$', 'TigerChat.communication.views.add_friend'),
    url(r'^group/create/$', 'TigerChat.communication.views.create_group'),
    url(r'^group/add/$', 'TigerChat.communication.views.add_person_to_group'),
    url(r'^group/remove/$','TigerChat.communication.views.remove_group'),
    url(r'^room/create/$', 'TigerChat.communication.views.create_room'),
    url(r'^room/invite/$', 'TigerChat.communication.views.invite_person_to_room'),
    url(r'^room/leave/$', 'TigerChat.communication.views.leave_room'),
    url(r'^room/requests/$', 'TigerChat.communication.views.get_room_invites'),
    url(r'^room/join/', 'TigerChat.communication.views.join_room'),
    
    url(r'^register/$', 'TigerChat.registration.views.register_new_user'),
    url(r'^users/$', 'TigerChat.registration.views.users'),
    url(r'^people/$', 'TigerChat.registration.views.people'),
    url(r'^removeall/$', 'TigerChat.registration.views.remove_everything'),
    
    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
)


