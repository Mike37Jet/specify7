#!/usr/bin/env python
import os
import sys
import django

# Setup Django
sys.path.append('/opt/specify7')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'specifyweb.settings')
django.setup()

from specifyweb.specify.models import Specifyuser, Collection
from django.db import connection

# Obtener el usuario y la colección
user = Specifyuser.objects.get(name='admin')
collection = Collection.objects.first()

print(f'Usuario: {user.name} (ID: {user.id})')
print(f'Colección: {collection.collectionname} (ID: {collection.id})')

# Dar permisos completos usando el sistema de políticas
cursor = connection.cursor()

# Políticas necesarias
policies = [
    ('/collection/access', 'access'),
    ('/admin/user/sp6', 'read'),
    ('/admin/user/sp6', 'update'),
    ('/admin/user/agents', 'read'),
    ('/admin/user/agents', 'update'),
    ('/permissions/policies/user', 'read'),
    ('/permissions/policies/user', 'create'),
    ('/permissions/policies/user', 'update'),
    ('/permissions/policies/user', 'delete'),
    ('/permissions/roles', 'read'),
    ('/permissions/roles', 'create'),
    ('/permissions/roles', 'update'),
    ('/permissions/roles', 'delete'),
]

# Insertar políticas
for resource, action in policies:
    cursor.execute("""
        INSERT IGNORE INTO spuserpolicy (resource, action, collection_id, specifyuser_id)
        VALUES (%s, %s, %s, %s)
    """, [resource, action, collection.id, user.id])

print(f'✅ Políticas de acceso creadas para el usuario en la colección')
print(f'Total de políticas: {len(policies)}')
