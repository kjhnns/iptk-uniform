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
            closeAll: { method: 'GET', params: { controller: 'closeall', id: '0' }, isArray: true  },
            completeAll: { method: 'GET', params: { controller: 'completeall', id: '0' }, isArray: true  },

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
            assign: { method: 'PUT', params: { controller: 'assign' } },
            incompleted: { method: 'GET', isArray: true, params: { controller: 'incompleted', id: '0' } },
            completed: { method: 'GET', isArray: true, params: { controller: 'completed', id: '0' } },
            closed: { method: 'GET', isArray: true, params: { controller: 'closed', id: '0' } },
            accepted: { method: 'GET', isArray: true, params: { controller: 'accepted', id: '0' } },
            rejected: { method: 'GET', isArray: true, params: { controller: 'rejected', id: '0' } },
            count: { method: 'GET', isArray: true, params: { controller: 'count', id: '0' } }


        });
    }

    angular.module('conferenceApp.api')
        .factory('Submission', SubmissionResource);

})();
