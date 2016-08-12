'use strict';

(function() {
    function SubmissionResource($resource) {
        return $resource('/api/submissions/:id/:controller', {
            id: '@_id'
        }, {
            reject: { method: 'GET', params: { controller: 'reject' } },
            accept: { method: 'GET', params: { controller: 'accept' } },
            close: { method: 'GET', params: { controller: 'close' } },
            complete: { method: 'GET', params: { controller: 'complete' } },

            assignedOpen: {
                method: 'GET',
                params: { controller: 'open', id: '0' },
                isArray: true,
                transformResponse: (data, _) => {
                    var res = JSON.parse(data);
                    var subs = [];
                    res.Reviewers.forEach((obj) => {
                        if (obj.Reviews.length <= 0 && obj.status <= 1) {
                            subs.push(obj);
                        }
                    });
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
            assign: { method: 'PUT', params: { controller: 'assign' } }
        });
    }

    angular.module('conferenceApp.api')
        .factory('Submission', SubmissionResource);

})();
