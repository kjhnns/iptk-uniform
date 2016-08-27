'use strict';

angular.module('conferenceApp.charts')
    .config(function($stateProvider) {

        $stateProvider
            .state('charts', {
                abstract: true,
                url: '/charts',
                template: '<div ui-view></div>'
            }).state('charts.index', {
                url: '/',
                templateUrl: 'app/charts/charts.index.html',
                controller: 'ChartsIndexController',
                controllerAs: 'ctrl',
                authenticate: true
            });

    });
