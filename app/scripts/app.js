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
    
    app.baseUrl = '/';
    if (window.location.port === '') {  // if production
        // Uncomment app.baseURL below and
        // set app.baseURL to '/your-pathname/' if running from folder in production
        app.baseUrl = '/';
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
    app.hresponse = null;
    /**
     * Stores the JSON of the API call to <tt>/users/current</tt> that is retrieved via an iron-ajax.
     *
     * @type {string} a JSON object containing the currently logged in user, or null, if not logged in.
     */
    app.currentUser = null;
    app.isMobile = false; //initiate as false
    app.i18n = null;
    app.loading = false;
    /**
     * Defines whether the requirements list shows active or realized requirements.
     * It is used as a property to the <requirements-list>.
     *
     * @type {string} 'active' or 'realized'.
     */
    app.selectedFilter = "active";
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
    app.isFollowerProj = false;
    app.followsComp = false;
    app.code = null;


    app.displayInstalledToast = function() {
        // Check to make sure caching is actually enabled—it won't be in the dev environment.
        if (!document.querySelector('platinum-sw-cache').disabled) {
            document.querySelector('#caching-complete').show();
        }
    };

    // Listen for template bound event to know when bindings
    // have resolved and content has been stamped to the page
    app.addEventListener('dom-change', function() {
        // device detection
        if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
            || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {

            this.isMobile = true;
        }
    });

    // See https://github.com/Polymer/polymer/issues/1381
    window.addEventListener('WebComponentsReady', function() {
        // imports are loaded and elements have been registered
        this.i18n = document.querySelector('i18n-msg');
        app.loaded = true;
    });

    window.addEventListener('storage', function(e) {
        if (e.key === "code"){
            app.code = e.newValue;
            app.$.settingsDialog.close();
            // app.getGithubAccessToken();
        }
    });

    document.addEventListener('HTMLImportsLoaded', function() {
        var lang = null;
        var view = null;
        if (document.cookie != ''){
            var cookies = document.cookie.split(';');
            for(var i = 0; i <cookies.length; i++) {
                var c = cookies[i];
                while (c.charAt(0)==' ') {
                    c = c.substring(1);
                }
                console.log(c);
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
        
        if (lang === null || lang ===''){
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


    document.addEventListener("file-reject", function(data){
        app.$.superToast.text = "" + data.detail.file.name + ". " + data.detail.error;
        app.$.superToast.open();
    });

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

    // Main area's paper-scroll-header-panel custom condensing transformation of
    // the appName in the middle-container and the bottom title in the bottom-container.
    // The appName is moved to top and shrunk on condensing. The bottom sub title
    // is shrunk to nothing on condensing.
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
        //Polymer.Base.transform('scale(' + scaleMiddle + ') translateZ(0)', appName);
        Polymer.Base.transform('scale(' + scaleMiddle + ') translate3d(0,' + yRatio * 100 + '%,0)', appName);
    });

    // Close drawer after menu item is selected if drawerPanel is narrow
    app.onDataRouteClick = function() {
        var drawerPanel = document.querySelector('#reqDrawer');
        if (drawerPanel.narrow) {
            drawerPanel.closeDrawer();
        }
    };

    // Scroll page to top and expand header
    app.scrollPageToTop = function() {
        document.getElementById('mainContainer').scrollTop = 0;
    };
    
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

    app.handleNewComp = function(){
        this.isFollowerComp();
    };

    app.closeCollapses = function(){
        var elems = document.querySelectorAll("iron-collapse");
        var requirements = document.querySelectorAll(".req");
        for (var i=1; i< elems.length; i++){
            if (elems[i].opened){
                elems[i].hide();
                if (elems[i].id === "reqExpand"){
                    elems[i].parentNode.parentNode.elevation = 1;
                    elems[i].parentNode.parentNode.querySelector(".description").classList.add("helper");
                }
            }
        }

        for (var i=0; i< requirements.length; i++){
            var element = requirements[i];
            if (element.querySelector('.contributers').style.display != "none") {
                if (element.querySelector("#contr")){
                    element.querySelector("#contr").innerText = i18n.getMsg('showContributers');
                }
                document.querySelector("requirements-list").showContributers = false;
                element.querySelector('.contributers').style.display = "none";
            }
        }
    };

    app.closeRequirement = function(){
        
    };

    app.showQuarantineView = function(){
        this.list = false;
        document.cookie = "view= grid";
        //document.querySelector("requirements-list").style.display = "none";
    };

    app.showListView = function(){
        this.list = true;
        document.cookie = "view= list";
        // document.querySelector("requirements-list").style.display = "block";
    };

    app.compChanged = function(compId){
        if(this.component){
            if(this.component.id === parseInt(compId)){
                return false;
            }
        }
        document.querySelector("requirements-list").closeTools();
        return true;
    };

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
    app.scrollToReq = function (componentId, requirementId) {
        var el;

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
            this.loadComponentInfo(componentId);

            app.selectedFilter = "active";
            setTimeout(function(){
                el = document.getElementById(requirementId);
                if (el != null){
                    var scroller = document.getElementById("mainScroller");
                    scroller.scroll(el.offsetTop - 70, true);
                    document.getElementById('requirementsList').toggleCollapsible(null, el);
                }

                if (el == null){
                    app.selectedFilter = "realized";
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

    app.showCreateRequirement = function() {
        var createDialog = document.getElementById('createRequirement');
        createDialog.open();
    };

    app.onCreateRequirementTap = function(e) {
        page('/projects/'+ app.params.projectId +'/components/' + app.params.componentId + '/create');
        e.preventDefault();
    };

    app.onCreateProjectTap = function(e) {
        var createDialog = document.getElementById('createProject');
        createDialog.open();
    };

    app.onCreateComponentTap = function(e) {
        var createDialog = document.getElementById('createComponent');
        createDialog.open();
    };

    app.openUserDialog = function(e){
        document.getElementById('userSettings').toggle();
    };

    app.openSettingsDialog = function(e){
        document.getElementById('userSettings').close();
        document.getElementById('settingsDialog').open();
    };

    app.onCreateRequirementClosed = function(e) {
        if (e.detail.confirmed) {
            var attachments = [];
            var request = document.querySelector('#postRequirementRequest');
            var components = [{id: parseInt(app.params.componentId)}];
            if (this.$.newRequirementTitle.value == '' || this.$.newRequirementDesc.value == '' || this.$.newRequirementTitle.value == null || this.$.newRequirementDesc.value == null ){
                this.$.superToast.text = i18n.getMsg('fieldsNotEmptyReq');
                this.$.superToast.open();
            } else {
                // if (this.files != []){
                //     for (var i = 0; i < this.files.length; i++){
                //         var obj = {
                //             title: this.files[i].name,
                //             fileUrl: this.files[i].xhr.response,
                //             mimeType: "image/*",
                //             identifier: this.files[i].xhr.response.match(/\d+/g)[0]
                //         };
                //         attachments.push(obj);
                //     }
                // }
                request.body = JSON.stringify({
                    "title": this.$.newRequirementTitle.value,
                    "description": this.$.newRequirementDesc.value,
                    "projectId": parseInt(app.params.projectId),
                    "components": components
                });
                // "attachments": attachments
                request.generateRequest();
                this.$.newRequirementTitle.value = null;
                this.$.newRequirementDesc.value = null;
            }
        } else if (e.detail.canceled) {
            this.$.newRequirementTitle.value = null;
            this.$.newRequirementDesc.value = null;
            this.files = [];
        }
        this.files = [];
        page('/projects/'+ app.params.projectId +'/components/' + app.params.componentId);

        e.preventDefault();
    };

    app.checkEnter = function (e){
        if (e.keyCode === 13) {
            if (e.ctrlKey){
                if (this.$.newRequirementDesc.focused){
                    this.$.newRequirementDesc.value += "\n";
                }
                return 0;
            }
            var request = document.querySelector('#postRequirementRequest');
            var components = [{id: parseInt(app.params.componentId)}];
            if (this.$.newRequirementTitle.value == '' || this.$.newRequirementDesc.value == '' || this.$.newRequirementTitle.value == null || this.$.newRequirementDesc.value == null ){
                this.$.superToast.text = i18n.getMsg('fieldsNotEmptyReq');
                this.$.superToast.open();
            } else {
                request.body = JSON.stringify({
                    "title": this.$.newRequirementTitle.value,
                    "description": this.$.newRequirementDesc.value,
                    "projectId": parseInt(app.params.projectId),
                    "components": components});
                request.generateRequest();
                e.preventDefault();
                this.$.newRequirementTitle.value = '';
                this.$.newRequirementDesc.value = '';
                this.$.createRequirement.close();
            }
        }
    };

    app.expandDialog = function(e){
        e.currentTarget.parentNode.classList.toggle("create");
        e.currentTarget.parentNode.classList.toggle("expand");
        e.currentTarget.parentNode.refit();
    };

    app.handleResponseRequirement = function(data){
        if (data != null) {
            document.querySelector("#requirementsList").load();
            this.$.superToast.text = i18n.getMsg('reqCreatedSucc');
        } else {
            this.$.superToast.text = i18n.getMsg('errorCreReq');
        }
        this.$.superToast.open();
    };

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

    app.handleResponseProject = function(data){
        if (data != null){
            this.$.projectsList.load();
            this.$.projToast.text = i18n.getMsg('prjCreatedSucc');
        } else {
            this.$.projToast.text = i18n.getMsg('errorCrePrj');
        }
        this.$.projToast.open();
    };

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

    app.handleResponseComponent = function(data){
        if (data != null){
            this.$.componentsList.load();
            this.$.compToast.text = i18n.getMsg('cmpCreatedSucc');
        } else {
            this.$.compToast.text = i18n.getMsg('errorCreCmp');
        }
        this.$.compToast.open();
    };

    //app.onComponentMenuSelected = function(e) {
    //    console.log(e.detail.item.innerText);
    //    this.$.componentInfoMenu.select(this.$.componentInfoMenu.selectedItem);
    //    e.preventDefault();
    //};

    //clear form on x click
    app.clearInput = function(e){
        app.$.searchInput.value = '';
    };

    // clears the requirements when the component is changed
    app.clearRequirements = function(){
        document.querySelector("requirements-list").requirements = [];
    };

    app.toggCompDrawer = function(e){
        //closes left drawer
        if (!this.isMobile) {
            if (document.querySelectorAll('#drawer')[3].style.display != 'none'){
                //app.$.reqDrawer.closeDrawer();
                document.querySelectorAll('#drawer')[3].style.display = 'none';
                document.querySelectorAll('#main')[3].style.left = '0px';
            } else {
                //opens left drawer
                document.querySelectorAll('#drawer')[3].style.display = 'block';
                //app.$.reqDrawer.openDrawer();
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


    app.toggNotDrawer = function(e){
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
        //opens right drawer
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
            //closes right drawer
            if (!this.isMobile){
                document.querySelector('#drawer').style.display = 'none';
                document.querySelector('#scrollProjects').style.marginRight = '0px';
                for (var i = 0; i < fabs.length; i++){
                    fabs[i].style.right = '30px';
                }
            }
        }

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
            //closes right drawer
            if (!this.isMobile) {
                document.querySelectorAll('#drawer')[1].style.display = 'none';
                document.querySelector('#scrollComponents').style.marginRight = '0px';
            }
        }

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
            //closes right drawer
            if (!this.isMobile){
                document.querySelectorAll('#drawer')[2].style.display = 'none';
                document.querySelectorAll('#main')[3].style.right = '0px';
            }
        }

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

    app.componentPage = function(rt){
        return rt === 'component-info';
    };

    app.landingPage = function(rt){
        return rt === 'home';
    };

    app.editProject = function(e){
        document.querySelector('.editHeader').style.display = 'none';
        document.querySelector('.editForm').style.display = 'block';
    };

    app.saveEditProj = function(e){
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

    app.errorHandler = function (e, detail){
        this.$.superToast.text = detail.error.message;
        this.$.superToast.open();
    };

    app.cancEditProj = function(e){
        document.querySelector('.editHeader').style.display = 'block';
        document.querySelector('.editForm').style.display = 'none';
    };

    app.handleResponseEditProj = function(data) {
        if (data != null){
            this.$.superToast.text = i18n.getMsg('prjEditSucc');
        }
        this.$.superToast.open();
    };

    app.createModal1 = function(e){
        document.getElementById('modal1').open();
    };

    app.createModal2 = function(e){
        document.getElementById('modal2').open();
    };

    app.deleteProject = function(e){
        if (e.detail.confirmed) {
            var request = document.getElementById('postUpdateProject');

            request.url = this.baseHref + "/projects/" + this.params.projectId;
            request.method = "DELETE";
            request.generateRequest();
        }
    };

    app.setDefault = function(e){
        var req = this.$.postUpdateProject;
        req.url = this.baseHref + "/projects/" + this.params.projectId;
        req.method = "PUT";
        req.body = JSON.stringify({
            "id": parseInt(this.params.projectId),
            "defaultComponentId": parseInt(this.params.componentId)
        });
        req.generateRequest();
    };

    app.editComponent = function(e){
        document.querySelector('.cmpTitle').style.display = 'none';
        document.querySelector('.cmpDesc').style.display = 'none';
        document.querySelector('.bottom-container').style.display = 'none';
        document.querySelector('.filtering').style.display = 'none';
        document.querySelector('.editFormComp').style.display = 'block';
    };

    app.cancEditComp = function(e){
        document.querySelector('.cmpTitle').style.display = 'block';
        document.querySelector('.cmpDesc').style.display = 'block';
        document.querySelector('.bottom-container').style.display = 'flex';
        document.querySelector('.filtering').style.display = 'block';
        document.querySelector('.editFormComp').style.display = 'none';
    };

    app.saveEditComp = function(e){
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

    app.compResponsePUT = function(data){
        if (data != null){
            document.querySelector('.cmpTitle').style.display = 'block';
            document.querySelector('.cmpDesc').style.display = 'block';
            document.querySelector('.bottom-container').style.display = 'flex';
            document.querySelector('.editFormComp').style.display = 'none';
            this.$.superToast.text = i18n.getMsg('cmpEditSucc');
            this.$.superToast.open();
        }
    };

    app.deleteComponent = function(e){
        if (e.detail.confirmed) {
            var request = document.getElementById('componentRequest');

            request.url = this.baseHref + "/components/" + this.params.componentId;
            request.method = "DELETE";
            request.generateRequest();
        }
    };

    app.compResponse = function(data){
        if (data != null){
            page('/projects/' + this.params.projectId);
            this.$.superToast.text = i18n.getMsg('cmpDelSucc');
            this.$.superToast.open();
        }
    };

    app.handleSigninSuccess = function(e){
        this.access_token = e.detail.access_token;
        this.header = {authorization: "Bearer " + this.access_token };
        document.getElementById('getUsr').generateRequest();
        if (app.route === "home"){
            page("/projects");
        }
        window.setTimeout(sayHi,500);
        // this.$.getGithubRepos.generateRequest();
    };

    app.toggleProjects = function () {
        document.getElementById('projectsList').toggle();
        var txt = document.querySelector('#toggleText');
        if (txt.textContent != i18n.getMsg('myProjects')){
            txt.textContent = i18n.getMsg('myProjects');
        } else {
            txt.textContent = i18n.getMsg('allProjects');
        }
    };

    app.changeUserSettingsLead = function(){
        var request = document.getElementById('usrSettings');
        request.url = this.baseHref + "/users/" + this.currentUser.id;

        request.body = JSON.stringify({
            "id": parseInt(this.currentUser.id),
            "emailLeadItems": ! this.currentUser.emailLeadItems
        });

        request.generateRequest();
    };

    app.changeUserSettingsFollow = function(){
        var request = document.getElementById('usrSettings');
        request.url = this.baseHref + "/users/" + this.currentUser.id;

        request.body = JSON.stringify({
            "id": parseInt(this.currentUser.id),
            "emailFollowItems": ! this.currentUser.emailFollowItems
        });

        request.generateRequest();
    };

    app.followComponent = function(){
        var request = this.$.followComp;

        request.url = this.baseHref + "/components/" + this.component.id + "/followers";
        request.generateRequest();
    };
    
    app.handleResponseFollowComp = function(){
        var tst = document.getElementById('superToast');
        tst.text = "You are now a follower";
        this.followsComp = true;
        tst.open();
    };

    app.isFollowerComp = function(){
        if (this.currentUser){
            if (this.component.followers.length == 0){
                this.followsComp = false;
                return;
            }

            for (var i=0; i < this.component.followers.length; i++){
                if (this.component.followers[i].id == this.currentUser.id){
                    this.followsComp = true;
                    return;
                }
            }
        }
        this.followsComp = false;
    };

    app.unfollowComponent = function(){
        var request = this.$.unfollowComp;

        request.url = this.baseHref + "/components/" + this.params.componentId + "/followers";
        request.generateRequest();
    };
    
    app.handleResponseUnFollowComp = function(){
        var tst = document.getElementById('superToast');
        tst.text = "You are removed from followers of this component";
        this.followsComp = false;
        tst.open();
    };    
    
    app.followProject = function(){
        var request = this.$.followProj;

        request.url = this.baseHref + "/projects/" + this.project.id + "/followers";
        request.generateRequest();
    };
    
    app.handleResponseFollowProj = function(){
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
    
    app.handleResponseUnFollowProj = function(){
        var tst = document.getElementById('superToast');
        tst.text = "You are removed from followers of this project";
        this.isFollowerProj = false;
        tst.open();
    };
    
    app.activitiesLoaded = function (){
        if (this.activities === null){
            return false;
        } else {
            return true;
        }
    };

    // app.loginGit = function() {
    //     window.open ("https://github.com/login/oauth/authorize?client_id=" + this.clientId, "Github Login", "width=700,height=700");
    // };

    // app.getGithubAccessToken = function(){
    //     var request = document.getElementById("loginGithub");
    //     request.url = "https://github.com/login/oauth/access_token";
    //     request.params = {
    //         "client_id": this.clientId,
    //         "client_secret": this.clientSecret,
    //         "code": this.code
    //     };
    //     request.generateRequest();
    // };
    //
    // app.handleSignInGithub = function(){
    //     var tst = document.getElementById('superToast');
    //     tst.text = "Your account is now connected to Github";
    //     tst.open();
    // };

    function sayHi() {
        if (app.currentUser != null) {
            var tst = document.getElementById('superToast');
            tst.text = i18n.getMsg('welcome') + app.currentUser.firstName;
            tst.open();
        }
    }

})(document);