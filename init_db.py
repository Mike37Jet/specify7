#!/usr/bin/env python
"""
Script para inicializar una base de datos Specify 7 con datos mínimos
"""
import os
import django
from datetime import datetime

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'specifyweb.settings')
django.setup()

from specifyweb.specify import models

print("🔧 Inicializando base de datos Specify 7...")

# 1. Crear DataType
datatype, _ = models.Datatype.objects.get_or_create(
    name="Standard Data",
    defaults={'timestampcreated': datetime.now()}
)
print(f"✓ DataType creado: {datatype.name}")

# 2. Crear Institution
institution, _ = models.Institution.objects.get_or_create(
    name="Test Institution",
    defaults={
        'isserverbased': True,
        'issecurityon': True,
        'isaccessonsglobal': False,
        'issharinglocalities': False,
        'issinglegeographytree': True,
        'timestampcreated': datetime.now()
    }
)
print(f"✓ Institution creada: {institution.name}")

# 3. Crear Geography Tree Definition
geotreedef, _ = models.Geographytreedef.objects.get_or_create(
    name="Geography",
    defaults={
        'fullnamedirection': 0,
        'timestampcreated': datetime.now()
    }
)
print(f"✓ Geography Tree Def creado: {geotreedef.name}")

# 4. Crear Geography Tree Def Item (Root)
geotreedefitem, _ = models.Geographytreedefitem.objects.get_or_create(
    treedef=geotreedef,
    rankid=0,
    defaults={
        'name': 'Earth',
        'isenforced': False,
        'isinfullname': True,
        'timestampcreated': datetime.now()
    }
)
print(f"✓ Geography Tree Def Item creado: {geotreedefitem.name}")

# 5. Crear nodo raíz de Geography
geonode, _ = models.Geography.objects.get_or_create(
    definition=geotreedef,
    definitionitem=geotreedefitem,
    rankid=0,
    defaults={
        'name': 'Earth',
        'timestampcreated': datetime.now()
    }
)
print(f"✓ Geography nodo raíz creado: {geonode.name}")

# 6. Crear Taxon Tree Definition
taxontreedef, _ = models.Taxontreedef.objects.get_or_create(
    name="Taxonomy",
    defaults={
        'fullnamedirection': 0,
        'timestampcreated': datetime.now()
    }
)
print(f"✓ Taxon Tree Def creado: {taxontreedef.name}")

# 7. Crear Taxon Tree Def Item (Root)
taxontreedefitem, _ = models.Taxontreedefitem.objects.get_or_create(
    treedef=taxontreedef,
    rankid=0,
    defaults={
        'name': 'Life',
        'isenforced': False,
        'isinfullname': True,
        'timestampcreated': datetime.now()
    }
)
print(f"✓ Taxon Tree Def Item creado: {taxontreedefitem.name}")

# 8. Crear nodo raíz de Taxon
taxonnode, _ = models.Taxon.objects.get_or_create(
    definition=taxontreedef,
    definitionitem=taxontreedefitem,
    rankid=0,
    defaults={
        'name': 'Life',
        'timestampcreated': datetime.now()
    }
)
print(f"✓ Taxon nodo raíz creado: {taxonnode.name}")

# 9. Crear Geologic Time Period Tree Definition
geotimetreedef, _ = models.Geologictimeperiodtreedef.objects.get_or_create(
    name="Geologic Time",
    defaults={
        'fullnamedirection': 0,
        'timestampcreated': datetime.now()
    }
)
print(f"✓ Geologic Time Tree Def creado: {geotimetreedef.name}")

# 10. Crear Geologic Time Tree Def Item (Root)
geotimetreedefitem, _ = models.Geologictimeperiodtreedefitem.objects.get_or_create(
    treedef=geotimetreedef,
    rankid=0,
    defaults={
        'name': 'Eon',
        'isenforced': False,
        'isinfullname': True,
        'timestampcreated': datetime.now()
    }
)
print(f"✓ Geologic Time Tree Def Item creado: {geotimetreedefitem.name}")

# 11. Crear nodo raíz de Geologic Time
geotimenode, _ = models.Geologictimeperiod.objects.get_or_create(
    definition=geotimetreedef,
    definitionitem=geotimetreedefitem,
    rankid=0,
    defaults={
        'name': 'Phanerozoic',
        'timestampcreated': datetime.now()
    }
)
print(f"✓ Geologic Time nodo raíz creado: {geotimenode.name}")

# 12. Crear Lithostrat Tree Definition
lithotreedef, _ = models.Lithostrattreedef.objects.get_or_create(
    name="Lithostratigraphy",
    defaults={
        'fullnamedirection': 0,
        'timestampcreated': datetime.now()
    }
)
print(f"✓ Lithostrat Tree Def creado: {lithotreedef.name}")

# 13. Crear Lithostrat Tree Def Item (Root)
lithotreedefitem, _ = models.Lithostrattreedefitem.objects.get_or_create(
    treedef=lithotreedef,
    rankid=0,
    defaults={
        'name': 'Root',
        'isenforced': False,
        'isinfullname': True,
        'timestampcreated': datetime.now()
    }
)
print(f"✓ Lithostrat Tree Def Item creado: {lithotreedefitem.name}")

# 14. Crear nodo raíz de Lithostrat
lithonode, _ = models.Lithostrat.objects.get_or_create(
    definition=lithotreedef,
    definitionitem=lithotreedefitem,
    rankid=0,
    defaults={
        'name': 'Root',
        'timestampcreated': datetime.now()
    }
)
print(f"✓ Lithostrat nodo raíz creado: {lithonode.name}")

# 15. Crear Storage Tree Definition
storagetreedef, _ = models.Storagetreedef.objects.get_or_create(
    name="Storage",
    defaults={
        'fullnamedirection': 0,
        'timestampcreated': datetime.now()
    }
)
print(f"✓ Storage Tree Def creado: {storagetreedef.name}")

# 16. Crear Storage Tree Def Item (Root)
storagetreedefitem, _ = models.Storagetreedefitem.objects.get_or_create(
    treedef=storagetreedef,
    rankid=0,
    defaults={
        'name': 'Building',
        'isenforced': False,
        'isinfullname': True,
        'timestampcreated': datetime.now()
    }
)
print(f"✓ Storage Tree Def Item creado: {storagetreedefitem.name}")

# 17. Crear nodo raíz de Storage
storagenode, _ = models.Storage.objects.get_or_create(
    definition=storagetreedef,
    definitionitem=storagetreedefitem,
    rankid=0,
    defaults={
        'name': 'Main Building',
        'timestampcreated': datetime.now()
    }
)
print(f"✓ Storage nodo raíz creado: {storagenode.name}")

# 18. Actualizar Institution con Storage Tree
institution.storagetreedef = storagetreedef
institution.save()
print("✓ Institution actualizada con Storage Tree")

# 19. Crear Division
division, _ = models.Division.objects.get_or_create(
    name="Main Division",
    institution=institution,
    defaults={'timestampcreated': datetime.now()}
)
print(f"✓ Division creada: {division.name}")

# 20. Crear Discipline
discipline, _ = models.Discipline.objects.get_or_create(
    name="General",
    division=division,
    defaults={
        'type': 'General',
        'ispaleocontextembedded': False,
        'datatype': datatype,
        'geographytreedef': geotreedef,
        'taxontreedef': taxontreedef,
        'geologictimeperiodtreedef': geotimetreedef,
        'lithostrattreedef': lithotreedef,
        'timestampcreated': datetime.now()
    }
)
print(f"✓ Discipline creada: {discipline.name}")

# 21. Crear Collection
collection, _ = models.Collection.objects.get_or_create(
    collectionname="Test Collection",
    code="TC",
    discipline=discipline,
    defaults={
        'isembeddedcollectingevent': False,
        'timestampcreated': datetime.now()
    }
)
print(f"✓ Collection creada: {collection.collectionname}")

# 22. Crear Agent
agent, _ = models.Agent.objects.get_or_create(
    firstname="Admin",
    lastname="User",
    agenttype=1,  # Person
    division=division,
    defaults={'timestampcreated': datetime.now()}
)
print(f"✓ Agent creado: {agent.firstname} {agent.lastname}")

# 23. Crear SpecifyUser
from django.contrib.auth.hashers import make_password
specifyuser, created = models.Specifyuser.objects.get_or_create(
    name="admin",
    defaults={
        'password': make_password('admin'),
        'isloggedin': False,
        'isloggedinreport': False,
        'email': 'admin@test.com',
        'usertype': 'Manager',
        'timestampcreated': datetime.now()
    }
)
if created:
    print(f"✓ Usuario creado: {specifyuser.name}")
    
    # Asociar usuario con colección
    collection.specifyusers.add(specifyuser)
    print(f"✓ Usuario asociado con colección")
else:
    print(f"⚠ Usuario ya existía: {specifyuser.name}")

print("\n" + "="*60)
print("✅ ¡Base de datos inicializada exitosamente!")
print("="*60)
print(f"🏛  Institución: {institution.name} (ID: {institution.id})")
print(f"📚 Colección: {collection.collectionname} (ID: {collection.id})")
print("="*60)
print("🔑 Credenciales de acceso:")
print("   Usuario: admin")
print("   Contraseña: admin")
print("="*60)
print("🌐 Recarga la página: http://localhost:8080")
print("="*60)
