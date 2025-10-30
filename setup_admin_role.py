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

cursor = connection.cursor()

# Crear un rol de administrador
cursor.execute("""
    INSERT INTO sprole (name, description, collection_id)
    VALUES ('Administrator', 'Full administrative access', %s)
    ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)
""", [collection.id])

role_id = cursor.lastrowid
print(f'✅ Rol creado/actualizado (ID: {role_id})')

# Asignar el rol al usuario
cursor.execute("""
    INSERT IGNORE INTO spuserrole (specifyuser_id, role_id)
    VALUES (%s, %s)
""", [user.id, role_id])

print(f'✅ Rol asignado al usuario')

# Crear políticas del rol con todos los permisos
role_policies = [
    ('/collection/access', 'access'),
    ('/record/collectionobject', 'read'),
    ('/record/collectionobject', 'create'),
    ('/record/collectionobject', 'update'),
    ('/record/collectionobject', 'delete'),
    ('/querybuilder/query', 'execute'),
    ('/workbench/dataset', 'transfer'),
    ('/workbench/dataset', 'unupload'),
    ('/admin/user/sp6', 'read'),
    ('/admin/user/sp6', 'update'),
]

for resource, action in role_policies:
    cursor.execute("""
        INSERT IGNORE INTO sprolepolicy (resource, action, role_id)
        VALUES (%s, %s, %s)
    """, [resource, action, role_id])

print(f'✅ Políticas del rol creadas')
print(f'Total de políticas: {len(role_policies)}')
