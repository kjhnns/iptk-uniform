'use strict';

import _ from 'lodash';
import { Submission, SubToReviewer, User, Review } from '../../sqldb';
import * as auth from '../../auth/auth.service';
import * as multiparty from 'multiparty';
var FS = require('fs');


function respondWithResult(res, statusCode) {
    statusCode = statusCode || 200;
    return function(entity) {
        if (entity) {
            res.status(statusCode).json(entity);
        }
    };
}

function saveUpdates(updates) {
    return function(entity) {
        return entity.updateAttributes(updates)
            .then(updated => {
                return updated;
            });
    };
}

function removeEntity(res) {
    return function(entity) {
        if (entity) {
            return entity.destroy()
                .then(() => {
                    return res.status(204).end();
                });
        }
    };
}

function handleEntityNotFound(res) {
    return function(entity) {
        if (!entity) {
            throw 404;

        } else {
            return entity;
        }
    };
}

function handleError(res, statusCode) {
    statusCode = statusCode || 500;
    return function(err) {
        console.log(err);
        res.status(statusCode).send(err);
    };
}

// Gets a list of Things
export function index(req, res) {
    auth.checkRoles('chair', req.user.role, function() {
        return Submission.findAll({
                where: {},
                include: [{
                    model: User,
                    attributes: [
                        '_id',
                        'name',
                        'email',
                        'role',
                        'provider'
                    ]
                }],
                attributes: { exclude: ['file'] }
            })
            .then(respondWithResult(res))
            .catch(handleError(res));
    }, function() {
        return Submission.findAll({
                where: { createdBy: req.user._id },
                include: [{
                    model: User,
                    attributes: [
                        '_id',
                        'name',
                        'email',
                        'role',
                        'provider'
                    ]
                }],
                attributes: { exclude: ['file'] }
            })
            .then(respondWithResult(res))
            .catch(handleError(res));
    });
}


// // Gets a list of Reviews
export function reviews(req, res) {
    auth.checkRoles('chair', req.user.role, function() {
        return Submission.find({
                where: {
                    _id: +req.params.id
                },
                include: [Review],
                attributes: { exclude: ['file'] }
            })
            .then(handleEntityNotFound(res))
            .then(respondWithResult(res))
            .catch(handleError(res));

    }, function() {
        return Submission.find({
                where: {
                    _id: +req.params.id,
                    createdBy: req.user._id
                },
                include: [Review],
                attributes: { exclude: ['file'] }
            })
            .then(handleEntityNotFound(res))
            .then(respondWithResult(res))
            .catch(handleError(res));
    });
}


export function setStatusCompleted(req, res) {
    var updateObj = {};
    updateObj.status = 1;

    return Submission.find({
            where: {
                _id: +req.params.id,
                createdBy: req.user._id,
                status: 0
            }
        })
        .then(handleEntityNotFound(res))
        .then(saveUpdates(updateObj))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

export function setStatusClosed(req, res) {
    var updateObj = {};
    updateObj.status = 2;

    return Submission.find({
            where: {
                _id: +req.params.id,
                status: { lt: 2 }
            }
        })
        .then(handleEntityNotFound(res))
        .then(saveUpdates(updateObj))
        .then(respondWithResult(res))
        .catch(handleError(res));
}


export function setStatusAccepted(req, res) {
    var updateObj = {};
    updateObj.status = 3;

    return Submission.find({
            where: {
                _id: +req.params.id,
                status: { lte: 2 }
            }
        })
        .then(handleEntityNotFound(res))
        .then(saveUpdates(updateObj))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

export function setStatusRejected(req, res) {
    var updateObj = {};
    updateObj.status = 4;

    return Submission.find({
            where: {
                _id: +req.params.id,
                status: { lte: 2 }
            }
        })
        .then(handleEntityNotFound(res))
        .then(saveUpdates(updateObj))
        .then(respondWithResult(res))
        .catch(handleError(res));
}


export function assignedOpen(req, res) {
    return User.find({
            where: { _id: req.user._id },
            include: [{
                model: Submission,
                as: 'Reviewers',
                attributes: { exclude: ['file'] },
                include: [{
                    model: Review,
                    include: [{
                        model: User,
                        attributes: [
                            '_id',
                            'name',
                            'email',
                            'role',
                            'provider'
                        ]

                    }]
                }]
            }],
            attributes: ['_id']
        })
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}


// Creates a new Submission in the DB
export function create(req, res) {
    var newSub = Submission.build(req.body);
    newSub.setDataValue('status', 0);
    newSub.setDataValue('createdBy', req.user._id);
    return newSub.save()
        .then(respondWithResult(res, 201))
        .catch(handleError(res, 400));
}

// Gets a single Submission from the DB
export function show(req, res) {
    auth.checkRoles('chair', req.user.role, function() {
        return Submission.find({
                where: {
                    _id: +req.params.id
                },
                include: [{
                    model: Review,
                    include: [{
                        model: User,
                        attributes: [
                            '_id',
                            'name',
                            'email',
                            'role',
                            'provider'
                        ]
                    }]
                }, {
                    model: User,
                    attributes: [
                        '_id',
                        'name',
                        'email',
                        'role',
                        'provider'
                    ]
                }, {
                    model: User,
                    as: 'Reviewers',
                    attributes: [
                        '_id',
                        'name',
                        'email',
                        'role',
                        'provider'
                    ]
                }],
                attributes: { exclude: ['file'] }
            })
            .then(handleEntityNotFound(res))
            .then(respondWithResult(res))
            .catch(handleError(res));
    }, function() {
        auth.checkReviewerRights(req.user._id, +req.params.id, () => {
            return Submission.find({
                    where: {
                        _id: +req.params.id
                    },
                    include: [{
                        model: User,
                        attributes: [
                            '_id',
                            'name',
                            'email',
                            'role',
                            'provider'
                        ]
                    }],
                    attributes: { exclude: ['file'] }
                })
                .then(handleEntityNotFound(res))
                .then(respondWithResult(res))
                .catch(handleError(res));
        }, () => {
            return Submission.find({
                    where: {
                        _id: +req.params.id,
                        createdBy: req.user._id
                    },
                    attributes: { exclude: ['file'] }
                })
                .then(handleEntityNotFound(res))
                .then(respondWithResult(res))
                .catch(handleError(res));
        });

    });
}

// Gets a single Submission from the DB
export function showFile(req, res) {
    return Submission.find({
            where: {
                _id: +req.params.id
            },
            include: [{
                model: User,
                attributes: [
                    '_id',
                    'name',
                    'email',
                    'role',
                    'provider'
                ]
            }]
        })
        .then(handleEntityNotFound(res))
        .then(((res) => {
            return (obj) => {
                if (obj.fileType) {
                    res.set('Content-Type', obj.fileType);
                    res.send(200, obj.file);
                } else {
                    throw 404;
                }
            };
        })(res))
        .catch(handleError(res));
}


// Updates an existing Submission in the DB
export function update(req, res) {
    if (req.body._id) {
        delete req.body._id;
    }

    return Submission.find({
            where: {
                _id: +req.params.id,
                createdBy: req.user._id
            }
        })
        .then(handleEntityNotFound(res))
        .then(saveUpdates(req.body))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Updates an existing Submission file in the DB
export function updateFile(req, res) {
    var form = new multiparty.Form();

    return form.parse(req, function(err, fields, files) {
        if (err) {
            return handleError(res, 400)(err);
        }
        var file = files.file[0];
        var fileName = file.originalFilename;
        var fileType = file.headers['content-type'];
        FS.readFile(file.path, (err, fileData) => {
            if (err) {
                return handleError(res, 500)(err);
            }
            return Submission.find({
                    where: {
                        _id: +req.params.id
                    }
                })
                .then(handleEntityNotFound(res))
                .then(saveUpdates({
                    'fileName': fileName,
                    'fileType': fileType,
                    'file': fileData
                }))
                .then(respondWithResult(res))
                .catch(handleError(res));
        });


    });

}

/**
 * Deletes a user
 * restriction: 'admin'
 */
export function destroy(req, res) {
    Submission.destroy({
            where: {
                _id: +req.params.id,
                createdBy: req.user._id
            }
        })
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res, 204))
        .catch(handleError(res, 403));
}


/**
 *  set Reviewers to Submissions
 */

export function assign(req, res) {
    var userIsReviewer = function(res) {
        return function(uObj) {
            return auth.checkRoles("reviewer", uObj.dataValues.role, () => {
                console.log("user has reviewer rights");
                return uObj;
            }, () => {
                console.log("no rights unfortunately");
                throw 403;
            })
        };
    }

    var addUserAsReviewer = function(res, req) {
        return (uObj) => {
            console.log("creating new relation s(", req.body.subId, ") <- u(", uObj.dataValues._id, ")");
            return SubToReviewer.create(req.body);
        };
    };

    return User.find({
            where: {
                _id: +req.body.userId
            }
        })
        .then(handleEntityNotFound(res))
        .then(userIsReviewer(res))
        .then(addUserAsReviewer(res, req))
        .then(respondWithResult(res, 201))
        .catch(handleError(res));
}


// Gets 
export function getIncompleted(req, res) {
    auth.checkRoles('chair', req.user.role, function() {
        return Submission.findAll({
                where: {status: 0},
                attributes: { exclude: ['file'] }
            })
            .then(respondWithResult(res))
            .catch(handleError(res));
    });

}

export function getCompleted(req, res) {
    auth.checkRoles('chair', req.user.role, function() {
        return Submission.findAll({
                where: { status: 1},
                attributes: { exclude: ['file'] }
            })
            .then(respondWithResult(res))
            .catch(handleError(res));
    });

}

export function getClosed(req, res) {
    auth.checkRoles('chair', req.user.role, function() {
        return Submission.findAll({
                where: {status: 2},
                attributes: { exclude: ['file'] }
            })
            .then(respondWithResult(res))
            .catch(handleError(res));
    });

}

export function getAccepted(req, res) {
    auth.checkRoles('chair', req.user.role, function() {
        return Submission.findAll({
                where: {status: 3},
                attributes: { exclude: ['file'] }
            })
            .then(respondWithResult(res))
            .catch(handleError(res));
    });

}

export function getRejected(req, res) {
    auth.checkRoles('chair', req.user.role, function() {
        return Submission.findAll({
                where: {status: 4},
                attributes: { exclude: ['file'] }
            })
            .then(respondWithResult(res))
            .catch(handleError(res));
    });

}


export function getTotalCount(req, res) {

    var statusTypes = [0,1,2,3,4];
    var count = new Array(5);


        auth.checkRoles('chair', req.user.role, function() {

            for(var i = 0; i < statusTypes.length; i++){
                count[i] = Submission.count({
                        where: {status: statusTypes[i]}
                    });
            }


        
        var test = Promise.all(count);

        test.then(function(data){
            console.log(data)
            
            res.send(data);
            return data;


        });

                       
        }); 

    

}
