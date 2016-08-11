'use strict';

(function() {
    function SubmissionResource($resource) {
        return $resource('/api/submissions/:id/:controller', {
            id: '@_id'
        }, {
            assignedOpen: {
                method: 'GET',
                params: { controller: 'open', id: '0' },
                isArray: true,
                transformResponse: (data, _) => {
                    var res = JSON.parse(data);
                    var subs = [];
                    res.Submissions.forEach((obj) => {
                        if (obj.Reviews.length <= 0) {
                            subs.push(obj);
                        }
                    });
                    console.log(subs);
                    return subs;
                }
            },
            assigned: {
                method: 'GET',
                params: { controller: 'assigned', id: '0' },
                isArray: true,
                transformResponse: (data, _) => {
                    var res = JSON.parse(data);
                    return res.Submissions;
                }
            },
            index: { method: 'GET', isArray: true },
            create: { method: 'POST' },
            show: { method: 'GET' },
            reviews: { method: 'GET', params: { controller: 'reviews' }, isArray: true },
            update: { method: 'PUT' },
            updateFile: { method: 'PUT', params: { controller: 'file' } },
            destroy: { method: 'DELETE' },
            assign: { method: 'GET', params: { controller: 'assign' } }
        });
    }

    angular.module('conferenceApp.api')
        .factory('Submission', SubmissionResource);

})();
