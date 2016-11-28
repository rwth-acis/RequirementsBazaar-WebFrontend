/*
 Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
 This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 Code distributed by Google as part of the polymer project is also
 subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

(function(document) {
    //'use strict';

    // Grab a reference to our auto-binding template
    // and give it some initial binding values
    // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
    var app = document.querySelector('#app');

    // url for requests for beta or live environment
    app.baseHref = "https://requirements-bazaar.org/betabazaar";
    app.activityHref = "https://requirements-bazaar.org/betaactivities";
    app.fileServiceHref = "https://requirements-bazaar.org/betafileservice/files/";

    app.baseUrl = '/beta/';
    if (window.location.port === '') {  // if production
        // Uncomment app.baseURL below and
        // set app.baseURL to '/your-pathname/' if running from folder in production
        app.baseUrl = '/beta/';
    }

    /**
     * Whether the user is logged in to the OIDC server.
     *
     * @type {boolean}
     */
    app.isAuthorized = false;
    /**
     * Stores the OAuth2 access token needed for authorized requests.
     *
     * @type {string}
     */
    app.access_token = null;
    /**
     * Stores the JSON of the API call to <tt>/users/current</tt> that is retrieved via an iron-ajax.
     *
     * @type {string} a JSON object containing the currently logged in user, or null, if not logged in.
     */
    app.currentUser = null;
    /**
     * True if page is opened on mobile, else false. It is used to style page properly or to hide certain elements
     * on mobile view.
     *
     * @type {boolean}
     */
    app.isMobile = false; // initiate as false
    /**
     * Save the i18-msg dom element and it is used to get messages in different languages.
     *
     * @type {null}
     */
    app.i18n = null;
    /**
     * It is true only when iron-ajax is loading for getting projects components and requirements.
     * Used to show progress bar when xhr on flight.
     *
     * @type {boolean}
     */
    app.loading = false;
    /**
     * Defines whether the requirements list shows active or realized requirements.
     * It is used as a property to the <requirements-list>.
     *
     * @type {string} 'active' or 'realized'.
     */
    app.requirementsStateFilter = "open";
    /**
     * Stores whether the requirements view shows a list or a grid.
     * It is used as a property to the <requirements-list>.
     *
     * @type {boolean} true if the requirements view shows a list, false if it shows a grid.
     */
    app.list = true;
    /**
     * Stores whether the requirements view shows a list or a grid.
     * It is used to tell the radio group whether 'list' or 'grid' is selected.
     *
     * @type {string} 'list' for list, 'grid' for grid.
     */
    app.view = "list";
    /**
     * If a user follows a component or a Project it becomes true.
     * This is checked for a component page from the method isFollowerCompent() everytime the user enters the components section.
     * When this is set to true the unfollow option is shown in index and vise-versa.
     * isFollowerProj is DEPRECATED and is global so:
     * TODO: REPLACE isFollowerProj WITH A BETTER METHOD
     *
     * @type {boolean}
     */
    app.isFollowerProj = false;
    app.followsComp = false;


    app.displayInstalledToast = function() {
        // Check to make sure caching is actually enabled—it won't be in the dev environment.
        if (!document.querySelector('platinum-sw-cache').disabled) {
            document.querySelector('#caching-complete').show();
        }
    };

    // Listen for template bound event to know when bindings
    // have resolved and content has been stamped to the page
    app.addEventListener('dom-change', function() {
        // detect mobile device
        if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
            || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {

            this.isMobile = true;
        }
    });

    /**
     * See https://github.com/Polymer/polymer/issues/1381
      */
    window.addEventListener('WebComponentsReady', function() {
        // Imports are loaded and elements have been registered.
        this.i18n = document.querySelector('i18n-msg');
        // Property used to check when the components are ready so it can scroll to requirement.
        app.loaded = true;
    });

    /**
     * It is called when all the html imports are done. It checks for properties that are saved in the cookie,
     * such as language and view type: list or grid. If cookie doesn't have information saved on loads browser language
     * and list view as default.
     */
    document.addEventListener('HTMLImportsLoaded', function() {
        var lang = null;
        var view = null;
        if (document.cookie != '') {
            // array with cookies values
            var cookies = document.cookie.split(';');
            for (var i = 0; i <cookies.length; i++) {
                // current parameter.
                var c = cookies[i];
                // remove before space if it has
                while (c.charAt(0)==' ') {
                    c = c.substring(1);
                }
                // get the parameters from the cookie c
                if (c.indexOf("lang=") == 0) {
                    lang = c.substring("lang=".length, c.length);
                }
                if (c.indexOf("view=") == 0) {
                    view = c.substring("view=".length, c.length);
                    app.view = view;
                    if (view === "grid"){
                        app.list = false;
                    }
                }
            }
        }

        // load browser language as default language
        if (lang === null || lang ==='') {
            switch (navigator.language.substring(0,2)) {
                case "en":
                    I18nMsg.lang = 'en';
                    break;
                case "de":
                    I18nMsg.lang = 'de';
                    break;
                case "al":
                    I18nMsg.lang = 'al';
                    break;
                case "ro":
                    I18nMsg.lang = 'ro';
                    break;
                default:
                    I18nMsg.lang = 'en';
            }
        } else {
            I18nMsg.lang = lang;
        }

        I18nMsg.url = 'locales'; // optionally use custom folder for locales.
        Platform.performMicrotaskCheckpoint();
    });

    /**
     * Listens for file-reject event thrown by vaadin-upload element. Displays the error message to the user.
     */
    document.addEventListener("file-reject", function(data){
        app.$.superToast.text = "" + data.detail.file.name + ". " + data.detail.error;
        app.$.superToast.open();
    });

    /**
     * Sets the language when the user press the item from the item-list of language in the index.
     */
    app.english = function(){
        I18nMsg.lang = 'en';
        document.cookie = "lang= en";
        Platform.performMicrotaskCheckpoint();
    };

    app.deutsch = function(){
        I18nMsg.lang = 'de';
        document.cookie = "lang= de";
        Platform.performMicrotaskCheckpoint();
    };

    app.albanian = function(){
        I18nMsg.lang = 'al';
        document.cookie = "lang= al";
        Platform.performMicrotaskCheckpoint();
    };

    app.romanian = function(){
        I18nMsg.lang = 'ro';
        document.cookie = "lang= ro";
        Platform.performMicrotaskCheckpoint();
    };

    /**
     *  Main area's paper-scroll-header-panel custom condensing transformation of
     * the appName in the middle-container and the bottom title in the bottom-container.
     * The appName is moved to top and shrunk on condensing. The bottom sub title
     * is shrunk to nothing on condensing.
     */
    addEventListener('paper-header-transform', function(e) {
        var appName = document.querySelector('#componentToolbar .component-name');
        var middleContainer = document.querySelector('#componentToolbar .middle-container');
        var bottomContainer = document.querySelector('#componentToolbar .bottom-container');
        var detail = e.detail;
        var heightDiff = detail.height - detail.condensedHeight;
        var yRatio = Math.min(1, detail.y / heightDiff);
        var maxMiddleScale = 0.50;  // appName max size when condensed. The smaller the number the smaller the condensed size.
        var scaleMiddle = Math.max(maxMiddleScale, (heightDiff - detail.y) / (heightDiff / (1 - maxMiddleScale)) + maxMiddleScale);
        var scaleBottom = 1 - yRatio;

        // Move/translate middleContainer
        Polymer.Base.transform('translate3d(0,' + yRatio * 100 + '%,0)', middleContainer);

        // Scale bottomContainer and bottom sub title to nothing and back
        Polymer.Base.transform('scale(' + scaleBottom + ') translateZ(0)', bottomContainer);

        // Scale middleContainer appName
        Polymer.Base.transform('scale(' + scaleMiddle + ') translate3d(0,' + yRatio * 100 + '%,0)', appName);
    });

    // Close drawer after menu item is selected if drawerPanel is narrow
    app.onDataRouteClick = function() {
        var drawerPanel = document.querySelector('#reqDrawer');
        if (drawerPanel.narrow) {
            drawerPanel.closeDrawer();
        }
    };

    // scroll Project page to top
    app.scrollProjToTop = function() {
        document.getElementById("scrollProjects").scroll(0);
    };

    /**
     * Returns the URL from where to get information about a specific project.
     *
     * @param projectId the id of the project to query.
     * @returns {string} the URL of the resource to query.
     */
    app.getProjectURL = function(projectId) {
        return this.baseHref + '/projects/' + projectId;
    };

    /**
     * Returns the URL from where to get information about a specific component.
     *
     * @param componentId the id of the component to query.
     * @returns {string} the URL of the resource to query.
     */
    app.getComponentURL = function(componentId) {
        return this.baseHref + '/components/' + componentId;
    };

    /**
     * Loads the project info page.
     *
     * @param projectId the id of the project to load.
     */
    app.loadProjectInfo = function(projectId) {
        // load the basic project info that is shown in the header
        this.$.projectInfoLoader.url = app.getProjectURL(projectId);
        this.$.projectInfoLoader.generateRequest();

        // load the components of the project
        this.$.componentsList.projectId = projectId;
        this.$.componentsList.load();
    };

    /**
     * Loads the component info page.
     *
     * @param componentId the id of the component to load.
     */
    app.loadComponentInfo = function(componentId) {
        // load the basic component info that is shown in the header
        this.$.componentInfoLoader.url = app.getComponentURL(componentId);
        this.$.componentInfoLoader.generateRequest();

        // load the components-menu on the left
        this.$.componentsMenu.componentId = componentId;
        this.$.componentsMenu.load();

        // load requirements-list
        this.$.requirementsList.componentId = componentId;
        this.$.requirementsList.load();
    };

    /**
     * When components are loaded in the requirements view trigger the method isFollowerComponent()
     */
    app.handleNewComponent = function(){
        this.isFollowerComponent();
    };

    /**
     * Checks if the authorized user is in the list of followers of the current component and sets or followsComp property
     */
    app.isFollowerComponent = function(){
        if (this.currentUser) {
            if (this.component.followers.length === 0) {
                this.followsComp = false;
                return;
            }

            for (var i=0; i < this.component.followers.length; i++) {
                if (this.component.followers[i].id === this.currentUser.id) {
                    this.followsComp = true;
                    return;
                }
            }
        }
        this.followsComp = false;
    };

    /**
     * Closes all the open requirements and hides contributers if they are shown.
     * Triggered from routing element if componentChanged() method returns true.
     */
    app.closeCollapses = function(){
        var collapses = document.querySelectorAll("iron-collapse");
        var requirements = document.querySelectorAll(".req");

        // close all collapses and reverts the colors for all requirements
        for (var i=1; i< collapses.length; i++){
            if (collapses[i].opened){
                collapses[i].hide();
                if (collapses[i].id === "reqExpand"){
                    collapses[i].parentNode.parentNode.elevation = 1;
                    collapses[i].parentNode.parentNode.querySelector(".description").classList.add("helper");
                }
            }
        }

        // hides all contributers div-s if they are open
        for (var i=0; i< requirements.length; i++){
            var requirement = requirements[i];
            if (requirement.querySelector('.contributors').style.display != "none") {
                if (requirement.querySelector("#contr")){
                    requirement.querySelector("#contr").innerText = i18n.getMsg('showContributors');
                }
            }
        }
    };

    /**
     * Shows Grid view when the grid radio button is pressed
     */
    app.showGridView = function(){
        this.list = false;
        document.cookie = "view= grid";
    };

    /**
     * Shows List view when the list radio button is pressed
     */
    app.showListView = function(){
        this.list = true;
        document.cookie = "view= list";
    };

    /**
     * Checks if the component is changed when in requirements view.
     * Triggered by routing element with the aim to reduce the requests everytime the url changes from requirements url
     * back to the same components url.
     *
     * @param compId {number} - current componentsId
     * @returns {boolean} - true comp is changed, else false
     */
    app.componentChanged = function(compId){
        if(this.component){
            if(this.component.id === parseInt(compId)){
                return false;
            }
        }
        document.querySelector("requirements-list").closeTools();
        return true;
    };

    /**
     * Toggles the filters collapse. Triggered by the press on the filter button
     *
     * @param e - event
     */
    app.toggleFilters = function(e){
        document.getElementById("collapseFilters").toggle();
    };

    /**
     * Scrolls to a specified requirement.
     *
     * @param componentId
     * @param requirementId
     * @returns {number}
     */
    app.scrollToRequirement = function (componentId, requirementId) {
        var el;

        // scrolls to the specific requirements when the page is already loaded.
        if ( (this.loaded) && (el = document.getElementById(requirementId))) {
            if (el === null) {
                app.$.superToast.text = i18n.getMsg('noRequirement');
                app.$.superToast.show();
                page.redirect('/projects/' + app.params.projectId + "/components/" + componentId);
                return 0;
            }
            var scroller = document.getElementById("mainScroller");
            scroller.scroll(el.offsetTop - 70, true);
            document.getElementById('requirementsList').toggleCollapsible(null, el);
        } else {
            // scrolls to the specific requirement when the page is loaded directly from the requirement url.
            this.loadComponentInfo(componentId);

            app.requirementsStateFilter = "open";
            setTimeout(function(){
                el = document.getElementById(requirementId);
                if (el != null){
                    var scroller = document.getElementById("mainScroller");
                    scroller.scroll(el.offsetTop - 70, true);
                    document.getElementById('requirementsList').toggleCollapsible(null, el);
                }

                // timer is set to wait for page to load before check for the specific requirement.
                if (el == null){
                    app.requirementsStateFilter = "realized";
                    setTimeout(function(){
                        el = document.getElementById(requirementId);
                        if (el == null) {
                            app.$.superToast.text = i18n.getMsg('noRequirement');
                            app.$.superToast.show();
                            page.redirect('/projects/' + app.params.projectId + "/components/" + componentId);
                            return 0;
                        }
                        var scroller = document.getElementById("mainScroller");
                        scroller.scroll(el.offsetTop - 70, true);
                        document.getElementById('requirementsList').toggleCollapsible(null, el);
                    }, 1300);
                }

            }, 2000);
        }
        
        window.scrollTo(0, 75);
    };

    /**
     * Event handler for when the 'globe' icon is tapped.
     *
     * @param e is a tap event.
     */
    app.openLanguageMenu = function (e){
        var langMenu = document.getElementById("languageMenu");
        langMenu.style.display = "block";

        langMenu.open();
        var rect = e.currentTarget.getBoundingClientRect();
        langMenu.style.position = "absolute";
        langMenu.style.top = "-50px";
        langMenu.style.left = rect.right - 50 + 'px';
    };

    /**
     * Shows create requirements dialog by directong to create url.
     *
     * @param e - event
     */
    app.onCreateRequirementTap = function(e) {
        page('/projects/'+ app.params.projectId +'/components/' + app.params.componentId + '/create');
        e.preventDefault();
    };

    /**
     * Shows the create requirement paper dialog.
     * Triggered when url is changed to /create.
     */
    app.showCreateRequirementDialog = function() {
        var createDialog = document.getElementById('createRequirement');
        createDialog.open();
    };

    /**
     * Show create project and component by showing the paper-dialog
     * TO-DO: better redirect the user to a create url for both.
     *
     * @param e
     */
    app.onCreateProjectTap = function(e) {
        var createDialog = document.getElementById('createProject');
        createDialog.open();
    };

    app.onCreateComponentTap = function(e) {
        var createDialog = document.getElementById('createComponent');
        createDialog.open();
    };

    /**
     * Open user information dialog from the user icon click on the toolbar.
     *
     * @param e - event
     */
    app.openUserDialog = function(e){
        document.getElementById('userSettings').toggle();
    };

    /**
     * Opens the User Settings paper-dialog
     *
     * @param e - event
     */
    app.openSettingsDialog = function(e){
        document.getElementById('userSettings').close();
        document.getElementById('settingsDialog').open();
    };

    /**
     * Triggered when create requirements paper-dialog is closed.
     * If confirmed the requirement is posted to the backend (iron-ajax POST request generated) with the bellow fields.
     *
     * @param e - event
     */
    app.onCreateRequirementClosed = function(e) {
        if (e.detail.confirmed) {
            var attachments = [];
            var request = document.querySelector('#postRequirementRequest');
            var components = [{id: parseInt(app.params.componentId)}];
            // validate the requirements to be posted fields if they are empty
            if (this.$.newRequirementTitle.value == '' || this.$.newRequirementDesc.value == '' || this.$.newRequirementTitle.value == null || this.$.newRequirementDesc.value == null ) {
                this.$.superToast.text = i18n.getMsg('fieldsNotEmptyReq');
                this.$.superToast.open();
            } else {
                // check if a file was uploaded as well
                // xhr.response holds the file identifier
                if (this.files != []){
                    for (var i = 0; i < this.files.length; i++) {
                        var obj = {
                            title: this.files[i].name,
                            fileUrl: this.fileServiceHref + this.files[i].xhr.response,
                            mimeType: "image/*",
                            identifier: this.files[i].xhr.response
                        };
                        attachments.push(obj);
                    }
                }
                request.body = JSON.stringify({
                    "title": this.$.newRequirementTitle.value,
                    "description": this.$.newRequirementDesc.value,
                    "projectId": parseInt(app.params.projectId),
                    "components": components,
                    "attachments": attachments
                });
                request.generateRequest();
                // clean the fields
                this.$.newRequirementTitle.value = null;
                this.$.newRequirementDesc.value = null;
                this.files = [];
            }
        } else if (e.detail.canceled) {
            // if dialog closed, clean the fields
            this.$.newRequirementTitle.value = null;
            this.$.newRequirementDesc.value = null;
            this.files = [];
        }
        // move back to requirements view
        page('/projects/'+ app.params.projectId +'/components/' + app.params.componentId);

        e.preventDefault();
    };

    /**
     * Checks if at the end of typing in a field paper-input the key Enter is Pressed.
     * If that's the case post the requirement
     *
     * @param e - event
     */
    app.checkEnter = function (e){
        if (e.keyCode === 13) {
            if (e.ctrlKey){
                if (this.$.newRequirementDesc.focused){
                    this.$.newRequirementDesc.value += "\n";
                }
                return 0;
            }
            var attachments = [];
            var request = document.querySelector('#postRequirementRequest');
            var components = [{id: parseInt(app.params.componentId)}];
            if (this.$.newRequirementTitle.value == '' || this.$.newRequirementDesc.value == '' || this.$.newRequirementTitle.value == null || this.$.newRequirementDesc.value == null ){
                this.$.superToast.text = i18n.getMsg('fieldsNotEmptyReq');
                this.$.superToast.open();
            } else {
                if (this.files != []) {
                    for (var i = 0; i < this.files.length; i++){
                        var obj = {
                            title: this.files[i].name,
                            fileUrl: this.fileServiceHref + this.files[i].xhr.response,
                            mimeType: "image/*",
                            identifier: this.files[i].xhr.response
                        };
                        attachments.push(obj);
                    }
                }
                request.body = JSON.stringify({
                    "title": this.$.newRequirementTitle.value,
                    "description": this.$.newRequirementDesc.value,
                    "projectId": parseInt(app.params.projectId),
                    "components": components});
                request.generateRequest();
                e.preventDefault();
                this.$.newRequirementTitle.value = '';
                this.$.newRequirementDesc.value = '';
                this.files = [];
                this.$.createRequirement.close();
            }
        }
    };

    /**
     * Expands the createRequirement paper-dialog to full screen view
     * Triggered by the small icon at the corner of the createRequirement dialog
     *
     * @param e - event
     */
    app.expandDialog = function(e){
        e.currentTarget.parentNode.classList.toggle("create");
        e.currentTarget.parentNode.classList.toggle("expand");
        e.currentTarget.parentNode.refit();
    };

    /**
     * Show success or error message when a requirement is posted
     *
     * @param data
     */
    app.handlePostResponseRequirement = function(data){
        if (data != null) {
            document.querySelector("#requirementsList").load();
            this.$.superToast.text = i18n.getMsg('reqCreatedSucc');
        } else {
            this.$.superToast.text = i18n.getMsg('errorCreReq');
        }
        this.$.superToast.open();
    };

    /**
     * Posts a project when project dialog is closed and confirmed.
     * See onCreateRequirementClosed method comment for more.
     *
     * @param e
     */
    app.onCreateProjectClosed = function(e) {
        if (e.detail.confirmed) {
            var request = document.querySelector('#postProjectRequest');
            if (this.$.newProjectDesc.value == '' || this.$.newProjectTitle.value == '' || this.$.newProjectDesc.value == null || this.$.newProjectTitle.value == null ){
                this.$.superToast.text = i18n.getMsg('fieldsNotEmptyPrj');
                this.$.superToast.open();
            } else {
                request.body = JSON.stringify({
                    "description": this.$.newProjectDesc.value,
                    "name": this.$.newProjectTitle.value,
                    "visibility": 'PUBLIC'
                });
                request.generateRequest();
                this.$.newProjectTitle.value = null;
                this.$.newProjectDesc.value = null;
            }
        }
        e.preventDefault();
    };

    /**
     * Handle response from Posting the project. Show the appropriate message to the user
     *
     * @param data {Object} - response of request
     */
    app.handlePostResponseProject = function(data){
        if (data != null){
            this.$.projectsList.load();
            this.$.projToast.text = i18n.getMsg('prjCreatedSucc');
        } else {
            this.$.projToast.text = i18n.getMsg('errorCrePrj');
        }
        this.$.projToast.open();
    };

    /**
     * Same as with requirements and Projects
     *
     * @param e
     */
    app.onCreateComponentClosed = function(e) {
        if (e.detail.confirmed) {
            var request = document.querySelector('#postComponentRequest');
            if (this.$.newComponentDesc.value == '' || this.$.newComponentTitle.value == '' || this.$.newComponentDesc.value == null || this.$.newComponentTitle.value == null ){
                this.$.superToast.text = i18n.getMsg('fieldsNotEmptyCmp');
                this.$.superToast.open();
            } else {
                request.body = JSON.stringify({
                    "description": this.$.newComponentDesc.value,
                    "name": this.$.newComponentTitle.value,
                    "projectId": parseInt(app.params.projectId)
                });
                request.generateRequest();
                this.$.newComponentTitle.value = null;
                this.$.newComponentDesc.value = null;
            }
        }
        e.preventDefault();
    };

    /**
     * Same as with projects and requirements
     *
     * @param data
     */
    app.handlePostResponseComponent = function(data){
        if (data != null){
            this.$.componentsList.load();
            this.$.compToast.text = i18n.getMsg('cmpCreatedSucc');
        } else {
            this.$.compToast.text = i18n.getMsg('errorCreCmp');
        }
        this.$.compToast.open();
    };


    /**
     * clear form on x click
     */
    app.clearInput = function() {
        this.$.searchInput.value = '';
    };

    /**
     * clears the already loaded requirements when the component is changed
     */
    app.clearRequirements = function(){
        document.querySelector("requirements-list").requirements = [];
    };

    /**
     * Toggles the left toggle in the requirements view
     *
     * @param e - event
     */
    app.toggCompDrawer = function(e){
        // closes left drawer
        if (!this.isMobile) {
            if (document.querySelectorAll('#drawer')[3].style.display != 'none'){
                document.querySelectorAll('#drawer')[3].style.display = 'none';
                document.querySelectorAll('#main')[3].style.left = '0px';
            } else {
                //opens left drawer
                document.querySelectorAll('#drawer')[3].style.display = 'block';
                document.querySelectorAll('#main')[3].style.left = '256px';
            }
        } else {

            if (document.querySelectorAll('#main')[3].style.left === '256px'){
                document.querySelectorAll('#main')[3].style.left = '0px';
                this.$.reqDrawer.forceNarrow = true;
                this.$.reqDrawer.closeDrawer();
            } else {
                this.$.reqDrawer.forceNarrow = true;
                this.$.reqDrawer.togglePanel();
            }
        }
    };

    /**
     * Toggles the Activity Tracker drawer in projects, components and requirements view and checks for mobile.
     * With this method the toggle happens in all the views, for the AT element in projects, components and requirements view.
     */
    app.toggNotDrawer = function() {
        var fabs = document.getElementsByClassName('fabAdd');
        if (app.route == "projects"){
            document.querySelectorAll("#scrollThreshold")[0].scrollTarget = document.querySelector("#letsscroll1").scroller;
        }
        if (app.route == "project-info"){
            document.querySelectorAll("#scrollThreshold")[1].scrollTarget = document.querySelector("#letsscroll2").scroller;
        }
        if (app.route == "component-info"){
            document.querySelectorAll("#scrollThreshold")[2].scrollTarget = document.querySelector("#letsscroll3").scroller;
        }
        document.querySelector('activity-tracker').refresh();

        // opens right drawer in the project view
        if (document.querySelector('#drawer').style.display != 'block'){
            document.querySelector('#drawer').style.display = 'block';
            document.querySelector('#drawer').style.zIndex = 1;
            if (!this.isMobile){
                document.querySelector('#scrollProjects').style.marginRight = '256px';
                for (var i = 0; i < fabs.length; i++){
                    fabs[i].style.right = '286px';
                }
            } else {
                this.$.notDrawer.forceNarrow = true;
                this.$.notDrawer.closeDrawer();
            }
        } else {
            // closes right drawer in project view
            if (!this.isMobile){
                document.querySelector('#drawer').style.display = 'none';
                document.querySelector('#scrollProjects').style.marginRight = '0px';
                for (var i = 0; i < fabs.length; i++){
                    fabs[i].style.right = '30px';
                }
            }
        }

        // opens right drawer in the components view
        if (document.querySelectorAll('#drawer')[1].style.display != 'block'){
            // document.querySelectorAll('activity-tracker')[1].refresh();
            document.querySelectorAll('#drawer')[1].style.display = 'block';
            document.querySelectorAll('#drawer')[1].style.zIndex = 1;
            if (!this.isMobile) {
                document.querySelector('#scrollComponents').style.marginRight = '256px';
            } else {
                this.$.notDrawer0.forceNarrow = true;
                this.$.notDrawer0.closeDrawer();
            }
        } else {
            // closes right drawer in the components view
            if (!this.isMobile) {
                document.querySelectorAll('#drawer')[1].style.display = 'none';
                document.querySelector('#scrollComponents').style.marginRight = '0px';
            }
        }

        // opens right drawer in the requirements view
        if (document.querySelectorAll('#drawer')[2].style.display != 'block'){
            // document.querySelectorAll('activity-tracker')[2].refresh();
            document.querySelectorAll('#drawer')[2].style.display = 'block';
            document.querySelectorAll('#drawer')[2].style.zIndex = 1;
            if (!this.isMobile) {
                document.querySelectorAll('#main')[3].style.right = '256px';
            } else {
                this.$.notDrawer1.forceNarrow = true;
                this.$.notDrawer1.closeDrawer();
            }
        } else {
            // closes right drawer in the requirements view
            if (!this.isMobile){
                document.querySelectorAll('#drawer')[2].style.display = 'none';
                document.querySelectorAll('#main')[3].style.right = '0px';
            }
        }

        // open right drawer for every view in mobile mode
        if (this.isMobile){
            if (this.route === "component-info"){
                this.$.notDrawer.disableSwipe = true;
                this.$.notDrawer.togglePanel();
            }

            if (this.route === "projects"){
                this.$.notDrawer0.disableSwipe = true;
                this.$.notDrawer0.togglePanel();
            }

            if (this.route === "project-info"){
                this.$.notDrawer1.disableSwipe = true;
                this.$.notDrawer1.togglePanel();
            }
        }
    };

    /**
     * Returns true if we are in the components page
     *
     * @param rt - route string
     * @returns {boolean}
     */
    app._isComponentPage = function(rt){
        return rt === 'component-info';
    };

    /**
     * Check if we are in the landing page
     * @param rt - route string
     * @returns {boolean}
     */
    app._isLandingPage = function(rt){
        return rt === 'home';
    };

    /**
     * Makes project editable by showing the forms for title and description
     */
    app.editProject = function() {
        document.querySelector('.editHeader').style.display = 'none';
        document.querySelector('.editForm').style.display = 'block';
    };

    /**
     * Triggered when the save button for saving the editing of project is pressed
     * @param e
     */
    app.saveEditProject = function(e){
        var title = document.querySelector('.editForm > .editTitle').value;
        var desc = document.querySelector('.editForm > .editDesc').value;
        var el = document.getElementById('postUpdateProject');
        el.url = this.baseHref + "/projects/" + this.params.projectId;
        if (title == '' || desc == '' || title == null || desc == null ){
            this.$.superToast.text = "You can't have empty fields!";
            this.$.superToast.open();
        } else {
            el.body = JSON.stringify({
                "id": parseInt(this.params.projectId),
                "name": title,
                "description": desc
            });
            el.method = "PUT";
            el.generateRequest();
            document.querySelector('.editHeader').style.display = 'block';
            document.querySelector('.editForm').style.display = 'none';
        }
    };

    /**
     * Shows the error message on a toast when a request return an error response.
     *
     * @param e - event
     * @param detail {object} - response detail object
     */
    app.errorHandler = function (e, detail){
        this.$.superToast.text = detail.error.message;
        this.$.superToast.open();
    };

    /**
     * Triggered when the Cancel button is pressed when editing a project
     *
     * @param e
     */
    app.cancelEditProject = function(e){
        document.querySelector('.editHeader').style.display = 'block';
        document.querySelector('.editForm').style.display = 'none';
    };

    /**
     * Handles the Put request response and shows the appropriate message when iron-ajax is finished.
     *
     * @param data
     */
    app.handleEditResponseProject = function(data) {
        if (data != null){
            this.$.superToast.text = i18n.getMsg('prjEditSucc');
        }
        this.$.superToast.open();
    };

    /**
     * Opens the delete dialogs for deleting project and component.
     *
     * @param e
     */
    app.createModalDeleteProject = function(e){
        document.getElementById('deleteProject').open();
    };

    app.createModalDeleteComponent = function(e){
        document.getElementById('deleteComponent').open();
    };

    /**
     * Makes DELETE iroj-ajax request to the backend when delete project dialog is confirmed.
     * @param e
     */
    app.deleteProject = function(e){
        if (e.detail.confirmed) {
            var request = document.getElementById('postUpdateProject');

            request.url = this.baseHref + "/projects/" + this.params.projectId;
            request.method = "DELETE";
            request.generateRequest();
        }
    };

    /**
     * Make a specific component the default of the belonging project.
     */
    app.setDefault = function() {
        var req = this.$.postUpdateProject;
        req.url = this.baseHref + "/projects/" + this.params.projectId;
        req.method = "PUT";
        req.body = JSON.stringify({
            "id": parseInt(this.params.projectId),
            "defaultComponentId": parseInt(this.params.componentId)
        });
        req.generateRequest();
    };

    /**
     * Show forms when pressed the editing component button.
     */
    app.editComponent = function() {
        document.querySelector('.cmpTitle').style.display = 'none';
        document.querySelector('.cmpDesc').style.display = 'none';
        document.querySelector('.bottom-container').style.display = 'none';
        document.querySelector('.filtering').style.display = 'none';
        document.querySelector('.editFormComp').style.display = 'block';
    };

    /**
     * Removes forms when pressed the cancel editing component button.
     */
    app.cancelEditComp = function() {
        document.querySelector('.cmpTitle').style.display = 'block';
        document.querySelector('.cmpDesc').style.display = 'block';
        document.querySelector('.bottom-container').style.display = 'flex';
        document.querySelector('.filtering').style.display = 'block';
        document.querySelector('.editFormComp').style.display = 'none';
    };

    /**
     * Generates a request to edit the component that was edited.
     */
    app.saveEditComp = function() {
        var title = document.querySelector('.editFormComp > .editTitle').value;
        var desc = document.querySelector('.editFormComp > .editDesc').value;
        var el = document.getElementById('componentRequestPUT');
        el.url = this.baseHref + "/components/" + this.params.componentId;
        if (title == '' || desc == '' || title == null || desc == null ){
            this.$.superToast.text = i18n.getMsg('noEmptyFields');
            this.$.superToast.open();
        } else {
            el.body = JSON.stringify({
                "id": parseInt(this.params.componentId),
                "name": title,
                "description": desc
            });
            el.method = "PUT";
            el.generateRequest();
        }
    };

    /**
     * Handles the response of iron-ajax for PUT request to edit the component
     *
     * @param data {Object} - response data
     */
    app.handlePutResponseComponent = function(data){
        if (data != null){
            document.querySelector('.cmpTitle').style.display = 'block';
            document.querySelector('.cmpDesc').style.display = 'block';
            document.querySelector('.bottom-container').style.display = 'flex';
            document.querySelector('.editFormComp').style.display = 'none';
            this.$.superToast.text = i18n.getMsg('cmpEditSucc');
            this.$.superToast.open();
        }
    };

    /**
     * Sends an iron-ajax request to delete a component.
     *
     * @param e
     */
    app.deleteComponent = function(e){
        if (e.detail.confirmed) {
            var request = document.getElementById('componentRequest');

            request.url = this.baseHref + "/components/" + this.params.componentId;
            request.method = "DELETE";
            request.generateRequest();
        }
    };

    /**
     * Components response for every iron-ajax request to the components backend.
     *
     * @param data {Object} - Response data
     */
    app.compResponse = function(data){
        if (data != null){
            page('/projects/' + this.params.projectId);
            this.$.superToast.text = i18n.getMsg('cmpDelSucc');
            this.$.superToast.open();
        }
    };

    /**
     * Triggered when signin successful and shown the message of sign-in and saves the access-token.
     *
     * @param e - event
     */
    app.handleSigninSuccess = function(e){
        this.access_token = e.detail.access_token;
        this.header = {authorization: "Bearer " + this.access_token };
        document.getElementById('getUsr').generateRequest();
        if (app.route === "home"){
            page("/projects");
        }
        window.setTimeout(sayHi,500);
    };

    /**
     * Toggles between my projects and all projects in the projects view.
     * Triggered by the toggle button when the user is logged in.
     */
    app.toggleProjects = function () {
        document.getElementById('projectsList').toggle();
        var txt = document.querySelector('#toggleText');
        if (txt.textContent != i18n.getMsg('myProjects')){
            txt.textContent = i18n.getMsg('myProjects');
        } else {
            txt.textContent = i18n.getMsg('allProjects');
        }
    };

    /**
     * Change the setting so that users can get emails for things where he is a leaded.
     * Sends a request to the backend every time the toggle is pressed.
     */
    app.changeUserSettingsLead = function(){
        var request = document.getElementById('usrSettings');
        request.url = this.baseHref + "/users/" + this.currentUser.id;

        request.body = JSON.stringify({
            "id": parseInt(this.currentUser.id),
            "emailLeadItems": ! this.currentUser.emailLeadItems
        });

        request.generateRequest();
    };

    /**
     * Here the same as above but for things that the user follows.
     */
    app.changeUserSettingsFollow = function(){
        var request = document.getElementById('usrSettings');
        request.url = this.baseHref + "/users/" + this.currentUser.id;

        request.body = JSON.stringify({
            "id": parseInt(this.currentUser.id),
            "emailFollowItems": ! this.currentUser.emailFollowItems
        });

        request.generateRequest();
    };

    /**
     * Generate backend request to follow a component.
     */
    app.followComponent = function(){
        var request = this.$.followComp;

        request.url = this.baseHref + "/components/" + this.component.id + "/followers";
        request.generateRequest();
    };

    /**
     * Handle the response from iron-ajax for following a component.
     */
    app.handleResponseFollowComponent = function(){
        var tst = document.getElementById('superToast');
        tst.text = "You are now a follower";
        this.followsComp = true;
        tst.open();
    };

    /**
     * The same for unfollowing a component.
     */
    app.unfollowComponent = function(){
        var request = this.$.unfollowComp;

        request.url = this.baseHref + "/components/" + this.params.componentId + "/followers";
        request.generateRequest();
    };

    /**
     * Handle response when unfollowing a component request.
     */
    app.handleResponseUnFollowComponent = function(){
        var tst = document.getElementById('superToast');
        tst.text = "You are removed from followers of this component";
        this.followsComp = false;
        tst.open();
    };

    /**
     * Same for the projects
     */
    app.followProject = function(){
        var request = this.$.followProj;

        request.url = this.baseHref + "/projects/" + this.project.id + "/followers";
        request.generateRequest();
    };
    
    app._handleResponseFollowProject = function() {
        var tst = document.getElementById('superToast');
        tst.text = "You are now a follower";
        this.isFollowerProj = true;
        tst.open();
    };

    app.unfollowProject = function(){
        var request = this.$.unfollowProj;

        request.url = this.baseHref + "/projects/" + this.params.projectId + "/followers";
        request.generateRequest();
    };
    
    app.handleResponseUnFollowProject = function() {
        var tst = document.getElementById('superToast');
        tst.text = "You are removed from followers of this project";
        this.isFollowerProj = false;
        tst.open();
    };

    /**
     * Check if activities of activity tracker are loaded.
     * 
     * @returns {boolean}
     */
    app.activitiesLoaded = function() {
        if (this.activities === null) {
            return false;
        } else {
            return true;
        }
    };


    /**
     * Displays Hi message when user is logged in.
     */
    function sayHi() {
        if (app.currentUser != null) {
            var tst = document.getElementById('superToast');
            tst.text = i18n.getMsg('welcome') + app.currentUser.firstName;
            tst.open();
        }
    }

})(document);