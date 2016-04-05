/*
 Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
 This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 Code distributed by Google as part of the polymer project is also
 subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

(function(document) {
    'use strict';

    // Grab a reference to our auto-binding template
    // and give it some initial binding values
    // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
    var app = document.querySelector('#app');

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

    app.displayInstalledToast = function() {
        // Check to make sure caching is actually enabled—it won't be in the dev environment.
        if (!document.querySelector('platinum-sw-cache').disabled) {
            document.querySelector('#caching-complete').show();
        }
    };

    // Listen for template bound event to know when bindings
    // have resolved and content has been stamped to the page
    app.addEventListener('dom-change', function() {
        console.log('Our app is ready to rock!');
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
            request.body = JSON.stringify({
                            "title": this.$.newRequirementTitle.value,
                            "description": this.$.newRequirementDesc.value,
                            "projectId": parseInt(app.params.projectId),
                            "components": components});
            request.generateRequest();
            this.$.newRequirementTitle.value = null;
            this.$.newRequirementDesc.value = null;
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
            request.body = JSON.stringify({
                "description": this.$.newProjectDesc.value,
                "name": this.$.newProjectTitle.value,
                "visibility": 'PUBLIC'
            });
            request.generateRequest();
            this.$.newProjectTitle.value = null;
            this.$.newProjectDesc.value = null;
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
            request.body = JSON.stringify({
                "description": this.$.newComponentDesc.value,
                "name": this.$.newComponentTitle.value,
                "projectId": parseInt(app.params.projectId)
            });
            request.generateRequest();
            this.$.newComponentTitle.value = null;
            this.$.newComponentDesc.value = null;
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

    app.onComponentMenuSelected = function(e) {
        console.log(e.detail.item.innerText);
        this.$.componentInfoMenu.select(this.$.componentInfoMenu.selectedItem);
        e.preventDefault();
    };

    //clear form on x click
    app.clearInput = function(e){
        app.$.searchInput.value = '';
    };

    app.toggCompDrawer = function(e){
        //closes left drawer
        if (document.querySelectorAll('#drawer')[3].style.display != 'none'){
            app.$.reqDrawer.closeDrawer();
            document.querySelectorAll('#drawer')[3].style.display = 'none';
            document.querySelectorAll('#main')[3].style.left = '0px';
        } else {
            //opens left drawer
            document.querySelectorAll('#drawer')[3].style.display = 'block';
            app.$.reqDrawer.openDrawer();
            document.querySelectorAll('#main')[3].style.left = '256px';
        }
    };


    app.toggNotDrawer = function(e){
        //opens right drawer
        if (document.querySelector('#drawer').style.display != 'block'){
            document.querySelector('#drawer').style.display = 'block';
            document.querySelector('#scrollProjects').style.marginRight = '256px';
            app.$.notDrawer0.openDrawer();
        } else {
            //closes right drawer
            document.querySelector('#drawer').style.display = 'none';
            document.querySelector('#scrollProjects').style.marginRight = '0px';
            app.$.notDrawer0.closeDrawer();
        }

        if (document.querySelectorAll('#drawer')[1].style.display != 'block'){
            document.querySelectorAll('#drawer')[1].style.display = 'block';
            document.querySelector('#scrollComponents').style.marginRight = '256px';
            app.$.notDrawer1.openDrawer();
        } else {
            //closes right drawer
            document.querySelectorAll('#drawer')[1].style.display = 'none';
            document.querySelector('#scrollComponents').style.marginRight = '0px';
            app.$.notDrawer1.closeDrawer();
        }

        if (document.querySelectorAll('#drawer')[2].style.display != 'block'){
            document.querySelectorAll('#drawer')[2].style.display = 'block';
            document.querySelectorAll('#main')[3].style.right = '256px';
            app.$.notDrawer.openDrawer();
        } else {
            //closes right drawer
            document.querySelectorAll('#drawer')[2].style.display = 'none';
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
        document.querySelector('.editHeader').style.display = 'block';
        document.querySelector('.editForm').style.display = 'none';
        var title = document.querySelector('.editForm > .editTitle').value;
        var desc = document.querySelector('.editForm > .editDesc').value;
        var el = document.getElementById('postUpdateProject');
        el.url = "https://requirements-bazaar.org/bazaar/projects/" + this.params.projectId;
        el.body = JSON.stringify({
            "id": parseInt(this.params.projectId),
            "name": title,
            "description": desc
        });
        el.method = "PUT";
        el.generateRequest();
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


    app.editComponent = function(e){
        alert('Edit component');
        console.log(this.access);
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