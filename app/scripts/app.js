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

    app.baseUrl = '/';
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
    app.access_token = null;
    app.hresponse = null;
    app.currentUser = null;
    app.compResponse = null;
    app.isMobile = false; //initiate as false

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
    });

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
        var drawerPanel = document.querySelector('#paperDrawerPanel');
        if (drawerPanel.narrow) {
            drawerPanel.closeDrawer();
        }
    };

    // Scroll page to top and expand header
    app.scrollPageToTop = function() {
        document.getElementById('mainContainer').scrollTop = 0;
    };

    /**
     * Returns the URL from where to get information about a specific project.
     *
     * @param projectId the id of the project to query.
     * @returns {string} the URL of the resource to query.
     */
    app.getProjectURL = function(projectId) {
        return 'https://requirements-bazaar.org/bazaar/projects/' + projectId;
    };

    /**
     * Returns the URL from where to get information about a specific component.
     *
     * @param componentId the id of the component to query.
     * @returns {string} the URL of the resource to query.
     */
    app.getComponentURL = function(componentId) {
        return 'https://requirements-bazaar.org/bazaar/components/' + componentId;
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

    app.scrollToReq = function (componentId, requirementId) {
        this.loadComponentInfo(componentId);
        setTimeout(function(){
            var el = document.getElementById(requirementId);
            if (el === null) {
                app.$.superToast.text = 'Requirement is deleted!. Redirected you to Component Page';
                app.$.superToast.show();
                page.redirect('/projects/' + app.params.projectId + "/components/" + componentId);
                return 0;
            }
            var scroller = document.getElementById("mainScroller");
            scroller.scroll(el.offsetTop - 70, true);
            document.getElementById('requirementsList').toggleCollapsible(null, el);
        }, 1000);
        window.scrollTo(0, 75);
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

    app.onCreateRequirementClosed = function(e) {
        if (e.detail.confirmed) {
            var request = document.querySelector('#postRequirementRequest');
            var components = [{id: parseInt(app.params.componentId)}];
            if (this.$.newRequirementTitle.value == '' || this.$.newRequirementDesc.value == '' || this.$.newRequirementTitle.value == null || this.$.newRequirementDesc.value == null ){
                this.$.superToast.text = "Requirement isn't posted! Fields should not be empty!";
                this.$.superToast.open();
            } else {
                request.body = JSON.stringify({
                    "title": this.$.newRequirementTitle.value,
                    "description": this.$.newRequirementDesc.value,
                    "projectId": parseInt(app.params.projectId),
                    "components": components});
                request.generateRequest();
                this.$.newRequirementTitle.value = null;
                this.$.newRequirementDesc.value = null;
            }
        } else if (e.detail.canceled) {
            this.$.newRequirementTitle.value = null;
            this.$.newRequirementDesc.value = null;
        }
        page('/projects/'+ app.params.projectId +'/components/' + app.params.componentId);

        e.preventDefault();
    };

    app.handleResponseRequirement = function(data){
        if (data != null) {
            document.querySelector("#requirementsList").load();
            this.$.superToast.text = "Requirement created successfully!";
        } else {
            this.$.superToast.text = "Some error occurred while creating the requirement!";
        }
        this.$.superToast.open();
    }

    app.onCreateProjectClosed = function(e) {
        if (e.detail.confirmed) {
            var request = document.querySelector('#postProjectRequest');
            if (this.$.newProjectDesc.value == '' || this.$.newProjectTitle.value == '' || this.$.newProjectDesc.value == null || this.$.newProjectTitle.value == null ){
                this.$.superToast.text = "Project isn't posted! Fields should not be empty!";
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
            this.$.projToast.text = "Project created successfully!";
        } else {
            this.$.projToast.text = "Some error occurred while creating the project!";
        }
        this.$.projToast.open();
    };

    app.onCreateComponentClosed = function(e) {
        if (e.detail.confirmed) {
            var request = document.querySelector('#postComponentRequest');
            if (this.$.newComponentDesc.value == '' || this.$.newComponentTitle.value == '' || this.$.newComponentDesc.value == null || this.$.newComponentTitle.value == null ){
                this.$.superToast.text = "Component isn't posted! Fields should not be empty!";
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
            this.$.compToast.text = "Component created successfully!";
        } else {
            this.$.compToast.text = "Some error occurred while creating component!";
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
            this.$.reqDrawer.forceNarrow = true;
            this.$.reqDrawer.togglePanel();
        }
    };


    app.toggNotDrawer = function(e){
        //opens right drawer
        if (document.querySelector('#drawer').style.display != 'block'){
            document.querySelector('#drawer').style.display = 'block';
            document.querySelector('#drawer').style.zIndex = 1;
            if (!this.isMobile)
                document.querySelector('#scrollProjects').style.marginRight = '256px';
            app.$.notDrawer0.openDrawer();
        } else {
            //closes right drawer
            document.querySelector('#drawer').style.display = 'none';
            if (!this.isMobile)
                document.querySelector('#scrollProjects').style.marginRight = '0px';
            app.$.notDrawer0.closeDrawer();
        }

        if (document.querySelectorAll('#drawer')[1].style.display != 'block'){
            document.querySelectorAll('#drawer')[1].style.display = 'block';
            document.querySelectorAll('#drawer')[1].style.zIndex = 1;
            if (!this.isMobile)
                document.querySelector('#scrollComponents').style.marginRight = '256px';
            app.$.notDrawer1.openDrawer();
        } else {
            //closes right drawer
            document.querySelectorAll('#drawer')[1].style.display = 'none';
            if (!this.isMobile)
                document.querySelector('#scrollComponents').style.marginRight = '0px';
            app.$.notDrawer1.closeDrawer();
        }

        if (document.querySelectorAll('#drawer')[2].style.display != 'block'){
            document.querySelectorAll('#drawer')[2].style.display = 'block';
            document.querySelectorAll('#drawer')[2].style.zIndex = 1;
            if (!this.isMobile)
                document.querySelectorAll('#main')[3].style.right = '256px';
            app.$.notDrawer.openDrawer();
        } else {
            //closes right drawer
            document.querySelectorAll('#drawer')[2].style.display = 'none';
            if (!this.isMobile)
                document.querySelectorAll('#main')[3].style.right = '0px';
            app.$.notDrawer.closeDrawer();
        }
    };

    app.componentPage = function(rt){
        return rt === 'component-info';
    };

    app.handleSigninSuccess = function(e){
        console.log(e);
    };

    app.editProject = function(e){
        document.querySelector('.editHeader').style.display = 'none';
        document.querySelector('.editForm').style.display = 'block';
    };

    app.saveEditProj = function(e){
        var title = document.querySelector('.editForm > .editTitle').value;
        var desc = document.querySelector('.editForm > .editDesc').value;
        var el = document.getElementById('postUpdateProject');
        el.url = "https://requirements-bazaar.org/bazaar/projects/" + this.params.projectId;
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
            this.$.superToast.text = "Project edited successfully!";
        } else {
            this.$.superToast.text = "Some error happened while editing the requirement!";
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

            request.url = "https://requirements-bazaar.org/bazaar/projects/" + this.params.projectId;
            request.method = "DELETE";
            request.generateRequest();
        }
    };

    app.setDefault = function(e){
        var req = this.$.postUpdateProject;
        req.url = "https://requirements-bazaar.org/bazaar/projects/" + this.params.projectId;
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
        document.querySelector('.editFormComp').style.display = 'block';
    };

    app.cancEditComp = function(e){
        document.querySelector('.cmpTitle').style.display = 'block';
        document.querySelector('.cmpDesc').style.display = 'block';
        document.querySelector('.bottom-container').style.display = 'flex';
        document.querySelector('.editFormComp').style.display = 'none';
    };

    app.saveEditComp = function(e){
        var title = document.querySelector('.editFormComp > .editTitle').value;
        var desc = document.querySelector('.editFormComp > .editDesc').value;
        var el = document.getElementById('componentRequestPUT');
        el.url = "https://requirements-bazaar.org/bazaar/components/" + this.params.componentId;
        if (title == '' || desc == '' || title == null || desc == null ){
            this.$.superToast.text = "You can't have empty fields!";
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
            this.$.superToast.text = "Component edited successfully!";
            this.$.superToast.open();
        } else {
            this.$.superToast.text = "Some error happened while editing the requirement!";
            this.$.superToast.open();
        }
    };

    app.deleteComponent = function(e){
        if (e.detail.confirmed) {
            var request = document.getElementById('componentRequest');

            request.url = "https://requirements-bazaar.org/bazaar/components/" + this.params.componentId;
            request.method = "DELETE";
            request.generateRequest();
        }
    };

    app.compResponse = function(data){
        if (data != null){
            page('/projects/' + this.params.projectId);
            this.$.superToast.text = "Component deleted successfully!";
            this.$.superToast.open();
        }
    };

    app.handleSigninSuccess = function(e){
        this.access_token = e.detail.access_token;
        this.header = {access_token: this.access_token };
        document.getElementById('getUsr').generateRequest();
        window.setTimeout(sayHi,500);
    };

    app.toggleProjects = function () {
        document.getElementById('projectsList').toggle();
        var txt = document.querySelector('#toggleText');
        if (txt.textContent != 'My Projects'){
            txt.textContent = 'My Projects';
        } else {
            txt.textContent = 'All Projects';
        }
    };

    function sayHi() {
        if (app.currentUser != null) {
            var tst = document.getElementById('superToast');
            tst.text = "Welcome back " + app.currentUser.firstName;
            tst.open();
        }
    }

})(document);