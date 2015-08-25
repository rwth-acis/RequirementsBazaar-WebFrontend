'use strict';

/**
 * @ngdoc service
 * @name requirementsBazaarWebFrontendApp.reqBazService
 * @description
 * # reqBazService
 * Service in the requirementsBazaarWebFrontendApp.
 *
 * This service is used to make the http calls to the reqbaz service. Every call should run over this service. It
 * returns promises. Has paginate support.
 *
 */
angular.module('requirementsBazaarWebFrontendApp')
  .service('reqBazService', function reqBazService($http, bazaarServiceConfig) {
    var url = bazaarServiceConfig.BASE_URL;

    var paginate = function (url,page,per_page){
      if((typeof page !== 'undefined') && (typeof per_page !== 'undefined')){
        url += '?page=' + page + '&per_page=' + per_page;
      }
      return url;
    };

    /// PROJECTS
    this.getProjects = function (page, per_page) {
      var projectUrl = url + 'projects';
      return $http.get(paginate(projectUrl,page,per_page));
    };

    this.createProject = function(project) {
      var projectUrl = url + 'projects';
      return $http.post(projectUrl, project);
    };

    this.getProject = function (projectId) {
      var projectUrl = url + 'projects/' + projectId;
      return $http.get(projectUrl);
    };

    this.updateProject = function(projectId,project){
      var projectUrl = url + 'projects/' + projectId;
      return $http.put(projectUrl, project);
    };

    ///COMPONENTS

    this.getComponents = function(projectId,page, per_page){
      var componentUrl = url + 'projects/' + projectId + '/components';
      return $http.get(paginate(componentUrl,page,per_page));
    };

    this.createComponent = function(component) {
      var componentUrl = url + 'components';
      return $http.post(componentUrl, component);
    };

    this.getComponent = function (componentId) {
      var componentUrl = url + 'components/' + componentId;
      return $http.get(componentUrl);
    };

    this.deleteComponent = function(componentId){
      var componentUrl = url + 'components/'+ componentId;
      return $http.delete(componentUrl);
    };

    this.updateComponent = function(componentId,component){
      var componentUrl = url + 'components/' + componentId;
      return $http.put(componentUrl, component);
    };

    ///REQUIREMENTS
    this.getRequirementsByProject = function(projectId, page, per_page){
      var reqUrl = url + 'projects/' + projectId + '/requirements';
      return $http.get(paginate(reqUrl,page,per_page));
    };

    this.getRequirementsByComponent = function(componentId,page,per_page){
      var reqUrl = url + 'components/' + componentId + '/requirements';
      return $http.get(paginate(reqUrl,page,per_page));
    };

    this.createRequirement = function(requirement){
      var reqUrl = url + 'requirements';
      return $http.post(reqUrl, requirement);
    };

    this.getRequirement = function(requirementId){
      var reqUrl = url + 'requirements/' + requirementId;
      return $http.get(reqUrl);
    };

    this.deleteRequirement = function(requirementId) {
      var reqUrl = url + 'requirements/' + requirementId;
      return $http.delete(reqUrl);
    };

    this.updateRequirement = function(requirementId,requirement){
      var reqUrl = url + 'requirements/' + requirementId;
      return $http.put(reqUrl, requirement);
    };

    //DEV LIST

    this.addUserToDevelopers = function(requirementId){
      var devUrl = url + 'requirements/' + requirementId + '/developers';
      return $http.post(devUrl);
    };

    this.removeUserFromDevelopers = function(requirementId){
      var devUrl = url + 'requirements/' + requirementId + '/developers';
      return $http.delete(devUrl);
    };

    ///FOLLOWER LIST

    //
    this.addUserToFollowers = function(requirementId){
      var followUrl = url + 'requirements/' + requirementId + '/followers';
      return $http.post(followUrl);
    };

    this.removeUserFromFollowers = function(requirementId){
      var followUrl = url + 'requirements/' + requirementId + '/followers';
      return $http.delete(followUrl);
    };

    ///VOTE
    this.addVote = function(requirementId, isDownvote){
      var voteUrl = url + 'requirements/' + requirementId + '/vote';
      if (isDownvote){
        voteUrl += '?direction=down';
      } else {
        voteUrl += '?direction=up';
      }
      return $http.post(voteUrl);
    };

    /// COMMENTS

    this.getComments = function(requirementId, page, per_page){
      var commentUrl = url + 'requirements/' + requirementId + '/comments';
      return $http.get(paginate(commentUrl,page,per_page));
    };

    this.getComment = function(commentId){
      var commentUrl = url + 'comments/'+commentId;
      return $http.get(commentUrl);
    };

    this.createComment = function (comment){
      var commentUrl = url + 'comments';
      return $http.post(commentUrl, comment);
    };

    this.deleteComment = function(commentId){
      var commentUrl = url + 'comments/' + commentId;
      return $http.delete(commentUrl);
    };

    ///ATTACHMENTS
    //this.createAttachment = function(attachmentType, attachment){
    //  var attachmentUrl = url + 'attachments';
    //
    //  attachmentUrl+= '?attachmentType' + attachmentType;
    //
    //  return $http.post(attachmentUrl, attachment);
    //};
    //
    //this.deleteAttachment = function(attachmentId){
    //  var attachmentUrl = url + 'attachments/' + attachmentId;
    //  return $http.delete(attachmentUrl);
    //};

    /// USER
    this.getUser = function(userId) {
      var userUrl = url + 'users/' + userId;
      return $http.get(userUrl);
    };

    this.getCurrentUser = function() {
      var userCurrentUrl = url + 'users/current';
      return $http.get(userCurrentUrl);
    };

  });
