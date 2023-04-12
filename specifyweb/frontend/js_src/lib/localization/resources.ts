/**
 * Localization strings for app resources
 *
 * @module
 */

import { createDictionary } from './utils';

// Refer to "Guidelines for Programmers" in ./README.md before editing this file

export const resourcesText = createDictionary({
  appResources: {
    'en-us': 'App Resources',
    'ru-ru': 'Ресурсы приложения',
    'es-es': 'Recursos de la aplicación',
    'fr-fr': "Ressources de l'application",
    'uk-ua': 'Ресурси програми',
  },
  formDefinition: {
    'en-us': 'Form Definition',
    'ru-ru': 'Схема формы',
    'es-es': 'Definición de formulario',
    'fr-fr': 'Définition du formulaire',
    'uk-ua': 'Визначення форми',
  },
  formDefinitions: {
    'en-us': 'Form Definitions',
    'ru-ru': 'Определения форм',
    'es-es': 'Definiciones de formulario',
    'fr-fr': 'Définitions de formulaire',
    'uk-ua': 'Визначення форм',
  },
  loadFile: {
    'en-us': 'Load File',
    'ru-ru': 'Загрузить файл',
    'es-es': 'Cargar archivo',
    'fr-fr': 'Fichier de chargement',
    'uk-ua': 'Завантажити файл',
  },
  globalResources: {
    'en-us': 'Global Resources',
    'ru-ru': 'Глобальные ресурсы',
    'es-es': 'Recursos globales',
    'fr-fr': 'Ressources globales',
    'uk-ua': 'Глобальні ресурси',
  },
  disciplineResources: {
    'en-us': 'Discipline Resources',
    'ru-ru': 'Ресурсы дисциплины',
    'es-es': 'Recursos de disciplina',
    'fr-fr': 'Ressources de discipline',
    'uk-ua': 'Дисциплінарні ресурси',
  },
  type: {
    'en-us': 'Type',
    'ru-ru': 'Тип',
    'es-es': 'Tipo',
    'fr-fr': 'Type',
    'uk-ua': 'Тип',
  },
  userTypes: {
    'en-us': 'User Types',
    'ru-ru': 'Типы пользователей',
    'es-es': 'Tipos de usuarios',
    'fr-fr': "Types d'utilisateur",
    'uk-ua': 'Типи користувачів',
  },
  resources: {
    'en-us': 'Resources',
    'ru-ru': 'Ресурсы',
    'es-es': 'Recursos',
    'fr-fr': 'Ressources',
    'uk-ua': 'Ресурси',
  },
  subCategories: {
    'en-us': 'Sub-categories',
    'ru-ru': 'Подкатегории',
    'es-es': 'Subcategorías',
    'fr-fr': 'Sous-catégories',
    'uk-ua': 'Підкатегорії',
  },
  addResource: {
    'en-us': 'Add Resource',
    'ru-ru': 'Добавить ресурс',
    'es-es': 'Agregar recurso',
    'fr-fr': 'Ajouter une ressource',
    'uk-ua': 'Додати ресурс',
  },
  appResource: {
    'en-us': 'App Resource',
    'ru-ru': 'Ресурс приложения',
    'es-es': 'Recurso de la aplicación',
    'fr-fr': "Ressource d'application",
    'uk-ua': 'Ресурс програми',
  },
  rssExportFeed: {
    'en-us': 'RSS Export Feed',
    'ru-ru': 'RSS-канал экспорта',
    'es-es': 'Fuente de exportación RSS',
    'fr-fr': "Flux d'exportation RSS",
    'uk-ua': 'Канал експорту RSS',
  },
  exports: {
    'en-us': 'Exports',
  },
  expressSearchConfig: {
    'en-us': 'Express Search Config',
    'ru-ru': 'Конфигурация быстрого поиска',
    'es-es': 'Configuración de búsqueda rápida',
    'fr-fr': 'Configuration de la recherche express',
    'uk-ua': 'Конфігурація експрес-пошуку',
  },
  typeSearches: {
    'en-us': 'Type Searches',
  },
  webLinks: {
    'en-us': 'Web Links',
    'ru-ru': 'Веб-ссылки',
    'es-es': 'Enlaces web',
    'fr-fr': 'Liens Web',
    'uk-ua': 'Веб-посилання',
  },
  uiFormatters: {
    'en-us': 'Field formatters',
    'ru-ru': 'Форматировщики полей',
    'es-es': 'formateadores de campo',
    'fr-fr': 'Formateurs de champ',
    'uk-ua': 'Форматери полів',
  },
  dataObjectFormatters: {
    'en-us': 'Record Formatters',
    'ru-ru': 'Форматировщики записей',
    'es-es': 'Formateadores de registros',
    'fr-fr': "Formateurs d'enregistrement",
    'uk-ua': 'Форматувальники записів',
  },
  formatter: {
    'en-us': 'Formatter',
    'ru-ru': 'Форматировщик',
  },
  formatters: {
    'en-us': 'Formatters',
    'ru-ru': 'Форматировщики',
  },
  formatterDescription: {
    'en-us':
      'Formatter determines how to transform individual database resources into readable text by selecting specific fields and applying a designated separator between them.',
  },
  aggregator: {
    'en-us': 'Aggregator',
  },
  aggregators: {
    'en-us': 'Aggregators',
    'ru-ru': 'Агрегаторы',
  },
  aggregatorDescription: {
    'en-us':
      'Aggregator determines how to consolidate multiple resources into a single text string by utilizing formatters and inserting a separator between them',
  },
  formattedResource: {
    'en-us': 'Formatted Resource',
  },
  availableFormatters: {
    'en-us': 'Available Formatters',
    'ru-ru': 'Доступные форматировщики',
  },
  availableAggregators: {
    'en-us': 'Available Aggregators',
    'ru-ru': 'Доступные агрегаторы',
  },
  availableWebLink: {
    'en-us': 'Available Web Links',
  },
  selectDefaultFormatter: {
    'en-us': 'Please mark one of these formatters as default',
  },
  duplicateFormatters: {
    'en-us': 'Formatter names must be unique',
  },
  dataEntryTables: {
    'en-us': 'Data Entry Tables',
    'ru-ru': 'Таблицы ввода данных',
    'es-es': 'Tablas de entrada de datos',
    'fr-fr': 'Tableaux de saisie de données',
    'uk-ua': 'Таблиці введення даних',
  },
  interactionsTables: {
    'en-us': 'Interactions Tables',
    'ru-ru': 'Таблицы взаимодействий',
    'es-es': 'Tablas de interacciones',
    'fr-fr': "Tableaux d'interactions",
    'uk-ua': 'Таблиці взаємодій',
  },
  otherXmlResource: {
    'en-us': 'Other XML Resource',
    'ru-ru': 'Другой XML-ресурс',
    'es-es': 'Otro recurso XML',
    'fr-fr': 'Autre ressource XML',
    'uk-ua': 'Інший ресурс XML',
  },
  otherJsonResource: {
    'en-us': 'Other JSON Resource',
    'ru-ru': 'Другой JSON-ресурс',
    'es-es': 'Otro recurso JSON',
    'fr-fr': 'Autre ressource JSON',
    'uk-ua': 'Інший ресурс JSON',
  },
  otherPropertiesResource: {
    'en-us': 'Other Properties Resource',
    'ru-ru': 'Другой Properties-ресурс',
    'es-es': 'Recurso de otras propiedades',
    'fr-fr': 'Autre ressource de propriétés',
    'uk-ua': 'Ресурс інших властивостей',
  },
  otherAppResource: {
    'en-us': 'Other Resource',
    'ru-ru': 'Другой Ресурс',
    'es-es': 'Otro recurso',
    'fr-fr': 'Autre ressource',
    'uk-ua': 'Інший ресурс',
  },
  filters: {
    'en-us': 'Filters',
    'ru-ru': 'Фильтры',
    'es-es': 'filtros',
    'fr-fr': 'Filtres',
    'uk-ua': 'Фільтри',
  },
  custom: {
    'en-us': 'Custom',
    'ru-ru': 'Настроить',
    'es-es': 'Costumbre',
    'fr-fr': 'Personnalisé',
    'uk-ua': 'Custom',
  },
  leafletLayers: {
    'en-us': 'Leaflet Layers',
    'ru-ru': 'Слои Leaflet',
    'es-es': 'Capas de folletos',
    'fr-fr': 'Couches de dépliant',
    'uk-ua': 'Шари листівок',
  },
  textEditor: {
    'en-us': 'Text Editor',
    'ru-ru': 'Текстовый редактор',
    'es-es': 'Editor de texto',
    'fr-fr': 'Éditeur de texte',
    'uk-ua': 'Текстовий редактор',
  },
  xmlEditor: {
    'en-us': 'XML Editor',
    'ru-ru': 'XML-редактор',
    'es-es': 'Editor XML',
    'fr-fr': 'Éditeur XML',
    'uk-ua': 'XML-редактор',
  },
  jsonEditor: {
    'en-us': 'JSON Editor',
    'ru-ru': 'JSON-редактор',
    'es-es': 'Editor JSON',
    'fr-fr': 'Éditeur JSON',
    'uk-ua': 'JSON-редактор',
  },
  visualEditor: {
    'en-us': 'Visual Editor',
    'ru-ru': 'Визуальный редактор',
    'es-es': 'editor visual',
    'fr-fr': 'Éditeur visuel',
    'uk-ua': 'Візуальний редактор',
  },
  selectResourceType: {
    'en-us': 'Select Resource Type',
    'ru-ru': 'Выберите тип ресурса',
    'es-es': 'Seleccionar tipo de recurso',
    'fr-fr': 'Sélectionnez le type de ressource',
    'uk-ua': 'Виберіть тип ресурсу',
  },
  globalPreferences: {
    'en-us': 'Global Preferences',
    'ru-ru': 'Глобальные настройки',
    'es-es': 'Preferencias globales',
    'fr-fr': 'Préférences globales',
    'uk-ua': 'Глобальні налаштування',
  },
  remotePreferences: {
    'en-us': 'Remote Preferences',
    'ru-ru': 'Удаленные настройки',
    'es-es': 'Preferencias remotas',
    'fr-fr': 'Préférences distantes',
    'uk-ua': 'Віддалені параметри',
  },
  failedParsingXml: {
    'en-us': 'Failed to parse XML',
    'ru-ru': 'Не удалось разобрать XML',
  },
  name: {
    'en-us': 'Name',
    'ru-ru': 'Название',
  },
  title: {
    'en-us': 'Title',
    'ru-ru': 'Заголовок',
  },
  default: {
    'en-us': 'Default',
    'ru-ru': 'По умолчанию',
  },
  separator: {
    'en-us': 'Separator',
    'ru-ru': 'Разделитель',
  },
  suffix: {
    'en-us': 'Suffix',
    'ru-ru': 'Суффикс',
  },
  limit: {
    'en-us': 'Limit',
    'ru-ru': 'Лимит',
  },
  defaultInline: {
    'en-us': '(default)',
  },
  sortField: {
    'en-us': 'Sort Field',
    'ru-ru': 'Поле сортировки',
  },
  preview: {
    'en-us': 'Preview:',
    'ru-ru': 'Предпросмотр:',
  },
  editorNotAvailable: {
    'en-us': 'Visual editor is not available for this resource',
  },
  definition: {
    'en-us': 'Definition',
  },
  addDefinition: {
    'en-us': 'Add definition',
  },
  deleteDefinition: {
    'en-us': 'Delete definition',
  },
  urlPart: {
    'en-us': 'URL part',
  },
  promptField: {
    'en-us': 'Prompt field',
  },
  addField: {
    'en-us': 'Add field',
  },
  thisField: {
    'en-us': 'This field',
  },
  selectTableFirst: {
    'en-us': 'Select table first',
  },
  conditionField: {
    'en-us': 'Condition Field',
  },
  condition: {
    'en-us': 'Condition',
  },
  conditionDescription: {
    'en-us':
      'This formatter will be used only if the condition field value is equal to this condition',
  },
  addConditionFieldFirst: {
    'en-us':
      'Multiple definitions can only be specified after you set a condition field',
  },
  wrongScopeWarning: {
    'en-us': `
      This resource belongs to a different collection/discipline than the one
      you are currently in. It's recommended to switch collection before editing
      this resource
    `,
  },
  thisFieldName: {
    'en-us': 'This field name (for preview purposes only)',
  },
  publishEveryDays: {
    'en-us': 'Publish every N days',
  },
  publish: {
    'en-us': 'Publish',
  },
  fileName: {
    'en-us': 'File name',
  },
  runAsUser: {
    'en-us': 'Run as user',
  },
  notifyUser: {
    'en-us': 'Send completion notification to user',
  },
  runInCollection: {
    'en-us': 'Run in collection',
  },
  createNewForm: {
    'en-us': 'Create new form',
  },
  copyFromExistingForm: {
    'en-us': 'Copy from existing form',
  },
  copyDefaultForm: {
    'en-us': 'Copy default form',
  },
} as const);
