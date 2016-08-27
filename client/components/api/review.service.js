'use strict';

(function() {
    function ReviewRessource($resource) {
        return $resource('/api/reviews/:id/:controller', {
            id: '@_id'
        }, {

            index: { method: 'GET', isArray: true },
            show: { method: 'GET' },
            create: { method: 'POST' },
            update: { method: 'PUT' },
            destroy: { method: 'DELETE' },
        });
    }

    angular.module('conferenceApp.api')
        .factory('Review', ReviewRessource);

})();
