from django.http import HttpResponse

def home(request):
	return HttpResponse('THIS. IS. TIGERCHAT!!!')