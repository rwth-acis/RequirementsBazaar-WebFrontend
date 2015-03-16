

angular.module('requirementsBazaarWebFrontendApp').config(function ($translateProvider) {
  $translateProvider.translations('en', {
    COMPONENT: 'Component',
    PROJECT: 'Project',
    BECOME_LEAD_DEV: 'Become a lead developer',
    EDIT_REQUIREMENT: 'Edit requirement',
    FOLLOW_REQUIREMENT: 'Follow requirement',
    DEVELOP_REQUIREMENT: 'Develop requirement',
    DELETE_REQUIREMENT: 'Delete requirement',
    COMMENTS:'Comments',
    LEAVE_A_COMMENT:'Leave a comment',
    SUBMIT:'Submit',
    LOGIN: 'Login',
    SEARCH_REQUIREMENTS: 'search requirements',
    FILTER_COMPONENTS: 'filter components',
    COMPONENT_LEAD: 'Component lead:',
    COMMENT_PLACEHOLDER: 'Type here',
    SHOW_CONTRIBUTORS: 'Show contributors',
    FOLLOWERS: 'Followers',
    DEVELOPERS: 'Developers',
    CREATED_BY: 'Created by',
    LEADER: 'Leader',
    HIDE: 'Hide',
    CREATE: 'Create',
    CREATE_PROJ: 'Create a project',
    CREATE_COMP: 'Create a component',
    CREATE_REQ: 'Create a requirement',
    TITLE: 'Title',
    DESC: 'Description',
    ACCEPT: 'Accept',
    DECLINE: 'Decline',
    SAVE_CHANGES: 'Save changes',
    RELOAD: 'Reload',
    SAVE: 'save',
    CANCEL: 'cancel',
    CHOOSE_PROJECT: 'Choose project',
    ACCESS_DENIED: 'Access denied',

    //Toast messages
    THANK_YOU:'Thank You',
    THANK_YOU_FOR_FOLLOWING: 'Thank you for following',
    THANK_FOR_INIT: 'Thank you for the initiative',
    WARN_NOT_IMPL: 'Warning: Not implemented',
    THANKS_FOR_FEEDBACK: 'Thanks for leaving feedback',
    ERROR_UNKNOWN: 'Error occurred, unknown reasons !',
    REFRESH_PLEASE: 'Please refresh the page !',
    WELCOME_BACK: 'Welcome back',
    LOGOUT: 'You are logged out',
    NO_PROJ_EXISTS: 'No projects exist yet',
    NO_REQ_EXIST: 'This component has no requirements, feel free to create',
    USER_NOT_LOADED: 'Could not load user',

    WARN_PROJ_NOT_LOADED: 'Warning: Project was not retrieved, refresh !',
    WARN_REQ_NOT_LOADED: 'Warning: the requirement was not loaded, refresh !',
    WARN_REQ_COMP_LOADED: 'Warning: the component was not loaded, refresh !',
    WARN_PROJS_NOT_LOADED: 'Warning: Could not load projects, please reload !',
    WARN_COMPS_NOT_LOADED: 'Warning: Could not load components',
    WARN_REQS_NOT_LOADED: 'Warning: Could not load requirements',
    WARN_COMMENTS_NOT_LOADED: 'Warning: Could not load comments',

    DEL_COMP: 'Deleted component: ',
    DEL_REQ: 'Deleted requirement: ',
    DEL_COMMENT: 'Deleted comment: ',
    WARN_REQ_NOT_DEL: 'Warning: Requirement was not deleted',
    WARN_COMP_NOT_DEL: 'Warning: Component was not deleted !',
    WARN_COMMENT_NOT_DEL: 'Warning: Comment was not deleted !',

    ALREADY_VOTED: 'You have already voted',
    WARN_VOTE_NOT_COUNTED: 'Warning: Vote was not counted, unknown reasons',
    WARN_NOT_REG_AS_DEV: 'Warning: could not register as a developer',
    WARN_NOT_REG_AS_FOLLOWER: 'Warning: could not register as a follower',

    LOGIN_PROJ: 'You must be logged in to edit or create projects',
    LOGIN_COMP: 'Please log in to create components',
    LOGIN_REQ: 'Please log in to create or edit requirements',
    LOGIN_PROJ_DEL: 'Please log in to delete projects',
    LOGIN_COMP_DEL: 'Please log in to delete components',
    LOGIN_REQ_DEL: 'Please log in to delete requirements',

    REQ_NAME_MISSING: 'Choose requirement name',
    COMP_NAME_MISSING: 'Choose component name',
    PROJ_NAME_MISSING: 'Choose project name',
    PROJ_DESC_MISSING: 'Choose project description',
    COMMENT_TEXT_MISSING: 'Comment cannot be empty',
    WARN_REQ_NOT_CREATED: 'Warning: Requirement was not created !',
    WARN_COMP_NOT_CREATED: 'Warning: Component was not created !',
    WARN_PROJ_NOT_CREATED: 'Warning: Project was not created !',
    WARN_COMMENT_NOT_CREATED: 'Warning: Comment was not submitted !',
    ATTACHMENTS_NOT_INCLUDED: 'Warning: Attachments were not included !',

    //Confirmation dialog
    CONFIRM_DEL: 'Confirm delete',
    DEL_REQ_DESC: 'The action cannot be undone. All comments and attachments will be deleted!',
    DEL_COMP_DESC: 'The action cannot be undone. The requirements will be accessible under the default component.'

  })
    .translations('de', {
      COMPONENT: 'Komponente',
      PROJECT: 'Projekt',
      BECOME_LEAD_DEV: 'Werden Sie ein leitender Entwickler',
      EDIT_REQUIREMENT: 'Requirement bearbeiten',
      FOLLOW_REQUIREMENT: 'Requirement folgen',
      DEVELOP_REQUIREMENT: 'Developer werden',
      DELETE_REQUIREMENT: 'Requirement löschen',
      COMMENTS:'Kommentare',
      LEAVE_A_COMMENT:'Kommentar hinterlassen',
      SUBMIT:'Kommentar senden',
      LOGIN: 'Anmelden',
      SEARCH_REQUIREMENTS: 'suche nach Requirements',
      FILTER_COMPONENTS: 'filter components',
      COMPONENT_LEAD: 'Komponent Leiter:',
      COMMENT_PLACEHOLDER: 'Ihr Beitrag',
      SHOW_CONTRIBUTORS: 'Zeige Beiträger',
      FOLLOWERS: 'Folger',
      DEVELOPERS: 'Entwickler',
      CREATED_BY: 'Erschaffer',
      LEADER: 'Leiter',
      HIDE: 'X',
      CREATE: 'Bestätigen',
      CREATE_PROJ: 'Neues Projekt',
      CREATE_COMP: 'Neues Komponent',
      CREATE_REQ: 'Neues Requirement',
      TITLE: 'Titel',
      DESC: 'Beschreibung',
      ACCEPT: 'Akzeptieren',
      DECLINE: 'Ablehnen',
      SAVE_CHANGES: 'Übernehmen',
      RELOAD: 'Neuladen',
      SAVE: 'Speichern',
      CANCEL: 'Abbrechen',
      CHOOSE_PROJECT: 'Projekt auswählen',
      ACCESS_DENIED: 'Zugriff verweigert',

      //Toast messages
      THANK_YOU:'Danke sehr',
      THANK_YOU_FOR_FOLLOWING: 'Danke fürs folgen',
      THANK_FOR_INIT: 'Danke für die Initiative',
      WARN_NOT_IMPL: 'Achtung: noch nicht implementiert',
      THANKS_FOR_FEEDBACK: 'Danke für die Rückmeldung',
      ERROR_UNKNOWN: 'Fehler ist aufgetreten, unbekannte Gründe!',
      REFRESH_PLEASE: 'Bitte die Seite neuladen',
      WELCOME_BACK: 'Willkommen zurück',
      LOGOUT: 'Erfolgreich abgemeldet',
      NO_PROJ_EXISTS: 'Es existieren noch keine Projekte',
      NO_REQ_EXIST: 'Dieses Komponent hat noch keine Requirements',
      USER_NOT_LOADED: 'Benutzer wurde nicht geladen',

      WARN_PROJ_NOT_LOADED: 'Achtung: Projekt wurde nicht geladen, Seite neuladen!',
      WARN_REQ_NOT_LOADED: 'Achtung: Requirement wurde nicht geladen, Seite neuladen!',
      WARN_REQ_COMP_LOADED: 'Achtung: Komponente wurde nicht geladen, Seite neuladen!',
      WARN_PROJS_NOT_LOADED: 'Achtung: Projekte wurden nicht geladen, Seite neuladen!',
      WARN_COMPS_NOT_LOADED: 'Achtung: Komponenten wurden nicht geladen!',
      WARN_REQS_NOT_LOADED: 'Achtung: Requirements wurden nicht geladen!',
      WARN_COMMENTS_NOT_LOADED: 'Achtung: Kommentare wurden nicht geladen!',

      DEL_COMP: 'Komponente gelöscht: ',
      DEL_REQ: 'Requirement gelöscht: ',
      DEL_COMMENT: 'Kommentar gelöscht: ',
      WARN_REQ_NOT_DEL: 'Achtung: Requirement wurde nicht gelöscht!',
      WARN_COMP_NOT_DEL: 'Achtung: Komponente wurde nicht gelöscht!',
      WARN_COMMENT_NOT_DEL: 'Achtung: Kommentar wurde nicht gelöscht!',

      ALREADY_VOTED: 'Sie haben bereits abgestimmt',
      WARN_VOTE_NOT_COUNTED: 'Achtung: Stimme wurde nicht gezählt, unbekannte Gründe!',
      WARN_NOT_REG_AS_DEV: 'Achtung: Registrierung als Entwickler war nicht erfolgreich',
      WARN_NOT_REG_AS_FOLLOWER: 'Achtung: konnte nicht folgen',

      LOGIN_PROJ: 'Sie müssen angemeldet sein, um Projekte zu bearbeiten oder zu erstellen',
      LOGIN_COMP: 'Bitte loggen Sie sich ein, um Komponenten zu erstellen',
      LOGIN_REQ: 'Bitte loggen Sie sich ein, um Requirements zu erstellen',
      LOGIN_PROJ_DEL: 'Bitte loggen Sie sich ein, um Projekte zu löschen',
      LOGIN_COMP_DEL: 'Bitte loggen Sie sich ein, um Komponenten zu löschen',
      LOGIN_REQ_DEL: 'Bitte loggen Sie sich ein, um Requirements zu löschen',

      REQ_NAME_MISSING: 'Bitte die Name von der Requirement hinzufügen',
      COMP_NAME_MISSING: 'Bitte die Name von das Komponent hinzufügen',
      PROJ_NAME_MISSING: 'Bitte die Name von der Projekt hinzufügen',
      PROJ_DESC_MISSING: 'Bitte die Beschreibung von der Projekt hinzufügen',
      COMMENT_TEXT_MISSING: 'Kommentar kann nicht leer sein',
      WARN_REQ_NOT_CREATED: 'Achtung: Requirement wurde nicht erstellt!',
      WARN_COMP_NOT_CREATED: 'Achtung: Komponente wurde nicht erstellt!',
      WARN_PROJ_NOT_CREATED: 'Achtung: Projekt wurde nicht erstellt!',
      WARN_COMMENT_NOT_CREATED: 'Achtung: Kommentar wurde nicht erstellt!',
      ATTACHMENTS_NOT_INCLUDED: 'Achtung: Anhänge wurden nicht berücksichtigt!',

      //Confirmation dialog
      CONFIRM_DEL: 'Löschen bestätigen',
      DEL_REQ_DESC: 'Die Aktion kann nicht rückgängig gemacht werden. Alle Kommentare und Anhänge werden gelöscht!',
      DEL_COMP_DESC: 'Die Aktion kann nicht rückgängig gemacht werden. Die Requirements werden im Rahmen des Standardkomponente zugänglich sein.'
  });

  $translateProvider.preferredLanguage('de');
});
