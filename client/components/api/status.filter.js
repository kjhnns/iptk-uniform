'use strict';



angular.module('conferenceApp.api')
    .filter('status', function() {
        return function(input, styleClass) {
            input = +input;

            var states = {
                0: 'incomplete',
                1: 'completed',
                2: 'closed',
                3: 'accepted',
                4: 'rejected'
            };

            var style = {
                0: 'default',
                1: 'info',
                2: 'warning',
                3: 'success',
                4: 'danger'
            };

            if (styleClass === true) {
                return style[input];
            } else {
                return states[input];
            }
        };
    });