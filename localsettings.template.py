# DJANGO LOCALSETTINGS TEMPLATE FILE
# This allows us to have individual mysql usernames and passwords
# We can also in theory configure other specific things we want to
# change for the sake of testing without messing up the central repo.
# Copy this template into local localsettings.py file and fill in

# Fill in personal mysql_username and mysql_password
DATABASES = {
	'default': {
		'ENGINE': 'django.db.backends.mysql', # Add 'postgresql_psycopg2', 'postgresql', 'mysql', 'sqlite3' or 'oracle'.
		'NAME': 'tigerchat',                      # Or path to database file if using sqlite3.
		'USER': 'mysql_username',                      # Not used with sqlite3.
		'PASSWORD': 'mysql_passwordl',                  # Not used with sqlite3.
		'HOST': '',                      # Set to empty string for localhost. Not used with sqlite3.
		'PORT': '',                      # Set to empty string for default. Not used with sqlite3.
	}
}