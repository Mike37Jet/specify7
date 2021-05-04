from uuid import uuid4
from xml.etree import ElementTree
from os.path import splitext
import requests, time, hmac, json

from django.http import HttpResponse
from django.views.decorators.http import require_GET
from django.views.decorators.cache import cache_control
from django.conf import settings

from specifyweb.specify.views import login_maybe_required

server_urls = None
server_time_delta = None

class AttachmentError(Exception):
    pass

def get_collection():
    "Assumes that all collections are stored together."
    if settings.WEB_ATTACHMENT_COLLECTION:
        return settings.WEB_ATTACHMENT_COLLECTION

    from specifyweb.specify.models import Collection
    return Collection.objects.all()[0].collectionname

@login_maybe_required
@require_GET
@cache_control(max_age=86400, private=True)
def get_settings(request):
    "Returns settings needed to access the asset server for this Specify instance."
    if server_urls is None:
        return HttpResponse("{}", content_type='application/json')

    data = {
        'collection': get_collection(),
        'token_required_for_get': settings.WEB_ATTACHMENT_REQUIRES_KEY_FOR_GET
        }
    data.update(server_urls)
    return HttpResponse(json.dumps(data), content_type='application/json')

@login_maybe_required
@require_GET
def get_token(request):
    "Returns an asset server access token. Must be supplied 'filename' GET parameter."
    filename = request.GET['filename']
    token = generate_token(get_timestamp(), filename)
    return HttpResponse(token, content_type='text/plain')

@login_maybe_required
@require_GET
def get_upload_params(request):
    "Returns information for uploading a file with GET parameter 'filename' to the asset server."
    filename = request.GET['filename']
    attch_loc = make_attachment_filename(filename)
    data = {
        'attachmentlocation': attch_loc,
        'token': generate_token(get_timestamp(), attch_loc)
        }
    return HttpResponse(json.dumps(data), content_type='application/json')

def make_attachment_filename(filename):
    uuid = str(uuid4())
    name, extension = splitext(filename)
    return uuid + extension

def delete_attachment_file(attch_loc):
    data = {
        'filename': attch_loc,
        'coll': get_collection(),
        'token': generate_token(get_timestamp(), attch_loc)
        }
    r = requests.post(server_urls["delete"], data=data)
    update_time_delta(r)
    if r.status_code not in (200, 404):
        raise AttachmentError("Deletion failed: " + r.text)

def generate_token(timestamp, filename):
    """Generate the auth token for the given filename and timestamp. """
    msg = str(timestamp).encode() + filename.encode()
    mac = hmac.new(settings.WEB_ATTACHMENT_KEY.encode(), msg)
    return ':'.join((mac.hexdigest(), str(timestamp)))

def get_timestamp():
    """Return an integer timestamp with one second resolution for
    the current moment.
    """
    return int(time.time()) + server_time_delta

def update_time_delta(response):
    try:
        timestamp = response.headers['X-Timestamp']
    except KeyError:
        return
    global server_time_delta
    server_time_delta = int(timestamp) - int(time.time())

def init():
    global server_urls

    if settings.WEB_ATTACHMENT_URL in (None, ''):
        return

    r = requests.get(settings.WEB_ATTACHMENT_URL)
    if r.status_code != 200:
        return

    update_time_delta(r)

    try:
        urls_xml = ElementTree.fromstring(r.text)
    except:
        return

    server_urls = {url.attrib['type']: url.text
                   for url in urls_xml.findall('url')}

    try:
        test_key()
    except AttachmentError:
        server_urls = None

def test_key():
    random = str(uuid4())
    token = generate_token(get_timestamp(), random)
    r = requests.get(server_urls["testkey"],
                     params={'random': random, 'token': token})

    if r.status_code == 200:
        return
    elif r.status_code == 403:
        raise AttachmentError("Bad attachment key.")
    else:
        raise AttachmentError("Attachment key test failed.")

init()

