/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/things              ->  index
 * POST    /api/things              ->  create
 * GET     /api/things/:id          ->  show
 * PUT     /api/things/:id          ->  update
 */

'use strict';

import _ from 'lodash';
import {Submission} from '../../sqldb'; //lookup sqldb
import {Subtoreviewer} from '../../sqldb';
import {Review} from '../../sqldb';
import {User} from '../../sqldb';
import * as auth from '../../auth/auth.service';

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
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Things
export function index(req, res) {
  return Submission.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Submission in the DB
export function create(req, res) {
  return Submission.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Gets a single Submission from the DB
export function show(req, res) {
  return Submission.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}


// Updates an existing Submission in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Submission.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Submission file in the DB
export function updateFile(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Submission.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

/**
 * Deletes a user
 * restriction: 'admin'
 */
export function destroy(req, res) {
  return Submission.destroy({ _id: req.params.id })
    .then(function() {
      res.status(204).end();
    })
    .catch(handleError(res));
}


/**
 *  set Reviewers to Submissions
 */

export function setassign(req, res) {

  auth.checkRoles('reviewer',req.user.role, function() {

    Subtoreviewer.create({
          _subid: req.params.id,
          _revid: req.user._id  
      })
        .then(respondWithResult(res, 201))
        .catch(handleError(res));

  }, function() {
    handleError(res,403);
  });
        
}
