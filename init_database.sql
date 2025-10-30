-- Script SQL simplificado para crear una base de datos Specify 7 funcional
-- Basado en la estructura real de las tablas

-- Paso 1: Crear DataType
INSERT INTO datatype (TimestampCreated, TimestampModified, version, Name)
VALUES (NOW(), NOW(), 0, 'Standard Data');
SET @datatype_id = LAST_INSERT_ID();

-- Paso 2: Crear Institution
INSERT INTO institution (
    TimestampCreated, TimestampModified, version, Name, 
    IsServerBased, IsSecurityOn, IsAccessionsGlobal, 
    IsSharingLocalities, IsSingleGeographyTree
)
VALUES (
    NOW(), NOW(), 0, 'Test Institution', 
    1, 1, 0, 
    0, 1
);
SET @institution_id = LAST_INSERT_ID();

-- Paso 3: Crear tree definitions básicas
-- Geography Tree
INSERT INTO geographytreedef (TimestampCreated, TimestampModified, version, Name, FullNameDirection)
VALUES (NOW(), NOW(), 0, 'Geography', 0);
SET @geotreedef_id = LAST_INSERT_ID();

INSERT INTO geographytreedefitem (TimestampCreated, TimestampModified, version, Name, RankID, TreeDefID, IsEnforced, IsInFullName)
VALUES (NOW(), NOW(), 0, 'Earth', 0, @geotreedef_id, 0, 1);
SET @georoot_id = LAST_INSERT_ID();

INSERT INTO geography (TimestampCreated, TimestampModified, version, Name, RankID, DefinitionID, DefinitionItemID, ParentID)
VALUES (NOW(), NOW(), 0, 'Earth', 0, @geotreedef_id, @georoot_id, NULL);
SET @geonode_id = LAST_INSERT_ID();

-- Taxon Tree  
INSERT INTO taxontreedef (TimestampCreated, TimestampModified, version, Name, FullNameDirection)
VALUES (NOW(), NOW(), 0, 'Taxonomy', 0);
SET @taxontreedef_id = LAST_INSERT_ID();

INSERT INTO taxontreedefitem (TimestampCreated, TimestampModified, version, Name, RankID, TreeDefID, IsEnforced, IsInFullName)
VALUES (NOW(), NOW(), 0, 'Life', 0, @taxontreedef_id, 0, 1);
SET @taxonroot_id = LAST_INSERT_ID();

INSERT INTO taxon (TimestampCreated, TimestampModified, version, Name, RankID, DefinitionID, DefinitionItemID, ParentID)
VALUES (NOW(), NOW(), 0, 'Life', 0, @taxontreedef_id, @taxonroot_id, NULL);

-- Geologic Time Tree
INSERT INTO geologictimeperiodtreedef (TimestampCreated, TimestampModified, version, Name, FullNameDirection)
VALUES (NOW(), NOW(), 0, 'Geologic Time', 0);
SET @geotimetreedef_id = LAST_INSERT_ID();

INSERT INTO geologictimeperiodtreedefitem (TimestampCreated, TimestampModified, version, Name, RankID, TreeDefID, IsEnforced, IsInFullName)
VALUES (NOW(), NOW(), 0, 'Eon', 0, @geotimetreedef_id, 0, 1);
SET @geotimeroot_id = LAST_INSERT_ID();

INSERT INTO geologictimeperiod (TimestampCreated, TimestampModified, version, Name, RankID, DefinitionID, DefinitionItemID, ParentID)
VALUES (NOW(), NOW(), 0, 'Phanerozoic', 0, @geotimetreedef_id, @geotimeroot_id, NULL);

-- LithoStrat Tree
INSERT INTO lithostrattreedef (TimestampCreated, TimestampModified, version, Name, FullNameDirection)
VALUES (NOW(), NOW(), 0, 'Lithostratigraphy', 0);
SET @lithotreedef_id = LAST_INSERT_ID();

INSERT INTO lithostrattreedefitem (TimestampCreated, TimestampModified, version, Name, RankID, TreeDefID, IsEnforced, IsInFullName)
VALUES (NOW(), NOW(), 0, 'Root', 0, @lithotreedef_id, 0, 1);
SET @lithoroot_id = LAST_INSERT_ID();

INSERT INTO lithostrat (TimestampCreated, TimestampModified, version, Name, RankID, DefinitionID, DefinitionItemID, ParentID)
VALUES (NOW(), NOW(), 0, 'Root', 0, @lithotreedef_id, @lithoroot_id, NULL);

-- Storage Tree
INSERT INTO storagetreedef (TimestampCreated, TimestampModified, version, Name, FullNameDirection)
VALUES (NOW(), NOW(), 0, 'Storage', 0);
SET @storagetreedef_id = LAST_INSERT_ID();

INSERT INTO storagetreedefitem (TimestampCreated, TimestampModified, version, Name, RankID, TreeDefID, IsEnforced, IsInFullName)
VALUES (NOW(), NOW(), 0, 'Building', 0, @storagetreedef_id, 0, 1);
SET @storageroot_id = LAST_INSERT_ID();

INSERT INTO storage (TimestampCreated, TimestampModified, version, Name, RankID, DefinitionID, DefinitionItemID, ParentID)
VALUES (NOW(), NOW(), 0, 'Main Building', 0, @storagetreedef_id, @storageroot_id, NULL);

-- Actualizar institution con storage tree
UPDATE institution SET StorageTreeDefID = @storagetreedef_id WHERE usergroupscopeid = @institution_id;

-- Paso 4: Crear Division
INSERT INTO division (TimestampCreated, TimestampModified, version, Name, InstitutionID)
VALUES (NOW(), NOW(), 0, 'Main Division', @institution_id);
SET @division_id = LAST_INSERT_ID();

-- Paso 5: Crear Discipline
INSERT INTO discipline (
    TimestampCreated, TimestampModified, version, Name, Type, 
    IsPaleoContextEmbedded, DivisionID, DataTypeID, 
    GeographyTreeDefID, TaxonTreeDefID, GeologicTimePeriodTreeDefID, LithoStratTreeDefID
)
VALUES (
    NOW(), NOW(), 0, 'General', 'General', 
    0, @division_id, @datatype_id, 
    @geotreedef_id, @taxontreedef_id, @geotimetreedef_id, @lithotreedef_id
);
SET @discipline_id = LAST_INSERT_ID();

-- Paso 6: Crear Collection
INSERT INTO collection (
    TimestampCreated, TimestampModified, version, 
    CollectionName, Code, IsEmbeddedCollectingEvent, DisciplineID
)
VALUES (
    NOW(), NOW(), 0, 
    'Test Collection', 'TC', 0, @discipline_id
);
SET @collection_id = LAST_INSERT_ID();

-- Paso 7: Crear Agent
INSERT INTO agent (TimestampCreated, TimestampModified, version, AgentType, FirstName, LastName, DivisionID)
VALUES (NOW(), NOW(), 0, 1, 'Admin', 'User', @division_id);
SET @agent_id = LAST_INSERT_ID();

-- Paso 8: Crear SpecifyUser (usuario: admin, password: admin)
-- Hash para password 'admin' usando pbkdf2_sha256
INSERT INTO specifyuser (
    TimestampCreated, TimestampModified, version, 
    Name, Password, IsAdmin, IsLoggedIn, IsLoggedInReport, 
    EMail, usertype, SpecifyUserID
)
VALUES (
    NOW(), NOW(), 0, 
    'admin', 'pbkdf2_sha256$260000$vFvhckK4yY5FWhqT5kQ8j6$kcV1cX+x8UqCNm5LgR1vLKV2GQhLqKF6YfmUF0F0w+Y=', 1, 0, 0,
    'admin@test.com', 'Manager', @agent_id
);
SET @user_id = LAST_INSERT_ID();

-- Actualizar Agent con el SpecifyUserID
UPDATE agent SET SpecifyUserID = @user_id WHERE AgentID = @agent_id;

-- Paso 9: Asociar usuario con colección
INSERT INTO specifyuser_spcollection (SpecifyUserID, CollectionID)
VALUES (@user_id, @collection_id);

-- Resultado
SELECT '✓ Base de datos inicializada correctamente' AS Status;
SELECT CONCAT('Institución: Test Institution (ID: ', @institution_id, ')') AS Info;
SELECT CONCAT('Colección: Test Collection (ID: ', @collection_id, ')') AS Info;
SELECT '=' AS Separator;
SELECT 'Credenciales de acceso:' AS Login;
SELECT '  Usuario: admin' AS Username;
SELECT '  Contraseña: admin' AS Password;
SELECT '=' AS Separator;
SELECT 'Ahora recarga la página http://localhost:8080' AS NextStep;
