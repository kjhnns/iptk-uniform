'use strict';

angular.module('conferenceApp.submissions')
    .config(function($stateProvider) {

        $stateProvider
            .state('submissions', {
                abstract: true,
                url: '/submissions',
                template: '<div ui-view></div>'
            }).state('submissions.index', {
                url: '/',
                templateUrl: 'app/_submissions/submissions.index.html',
                controller: 'SubmissionsIndexController',
                controllerAs: 'ctrl',
                authenticate: true
            }).state('submissions.show', {
                url: '/show/:id',
                templateUrl: 'app/_submissions/submissions.show.html',
                controller: 'SubmissionsShowController',
                controllerAs: 'ctrl',
                authenticate: true
            }).state('submissions.create', {
                url: '/create',
                templateUrl: 'app/_submissions/submissions.create.html',
                controller: 'SubmissionsEditController',
                controllerAs: 'ctrl',
                authenticate: true
            }).state('submissions.update', {
                url: '/update/:id',
                templateUrl: 'app/_submissions/submissions.update.html',
                controller: 'SubmissionsEditController',
                controllerAs: 'ctrl',
                authenticate: true
            });


    });
