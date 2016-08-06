'use strict';

angular.module('conferenceApp.reviews')
    .config(function($stateProvider) {

        $stateProvider
            .state('reviews', {
                abstract: true,
                url: '/reviews',
                template: '<div ui-view></div>'
            }).state('reviews.index', {
                url: '/',
                templateUrl: 'app/reviews/reviews.index.html',
                controller: 'ReviewsIndexController',
                controllerAs: 'ctrl',
                authenticate: true
            }).state('reviews.show', {
                url: '/show/:id',
                templateUrl: 'app/reviews/reviews.show.html',
                controller: 'ReviewsShowController',
                controllerAs: 'ctrl',
                authenticate: true
            }).state('reviews.edit', {
                url: '/edit/:id',
                templateUrl: 'app/reviews/reviews.show.html',
                controller: 'ReviewsEditController',
                controllerAs: 'ctrl',
                authenticate: true
            });


    });