'use strict';

angular.module('conferenceApp', [
        'conferenceApp.auth',
        'conferenceApp.admin',
        'conferenceApp.api',
        'conferenceApp.submissions',
        'conferenceApp.reviews',
        'conferenceApp.constants',
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'btford.socket-io',
        'ui.router',
        'ui.bootstrap',
        'validation.match',
        'angularFileUpload'
    ])
    .config(function($urlRouterProvider, $locationProvider) {
        $urlRouterProvider
            .otherwise('/');

        $locationProvider.html5Mode(true);
    });
