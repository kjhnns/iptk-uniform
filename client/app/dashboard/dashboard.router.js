'use strict';

angular.module('conferenceApp.api')
    .config(function($stateProvider) {



        $stateProvider
            .state('dashboard', {
                url: '/dashboard',
                templateUrl: 'app/dashboard/dashboard.html',
                controller: 'DashboardController',
                controllerAs: 'dashboard',
                authenticate: true
            });


    });
