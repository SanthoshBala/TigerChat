from django.conf.urls.defaults import patterns, include, url


#from TigerChat.views import current_datetime
# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    url(r'^$', 'TigerChat.views.home', name='home'),
    url(r'^time/$', 'TigerChat.views.current_datetime'),
    url(r'^tigerchat/$', 'TigerChat.views.tigerchat_main'),
    url(r'^login/$', 'django_cas.views.login'),
    url(r'^logout/$', 'django_cas.views.logout'),
    url(r'^users/$', 'TigerChat.communication.views.users'),
    url(r'^people/$', 'TigerChat.communication.views.people'),
    url(r'^search/$', 'TigerChat.communication.views.search'),
    url(r'^friends$', 'TigerChat.communication.views.get_friends'),
    url(r'^pending$', 'TigerChat.communication.views.get_pending'),
    url(r'^invite$', 'TigerChat.communication.views.invite_user'),
    url(r'^addfriend$', 'TigerChat.communication.views.add_friend'),
                       #url(r'^newtime/$', 'TigerChat.views.new_datetime'),
                       # url(r'^tigerchat/', include('tigerchat.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
)


