/*!
 * Bedrock Credential Notifications.
 *
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 *
 * @author Alex Lamar
 */
var async = require('async');
var bedrock = require('bedrock');
var brPermission = require('bedrock-permission');
var store = require('bedrock-credentials-mongodb');
var ensureAuthenticated = require('bedrock-passport').ensureAuthenticated;
var validate = require('bedrock-validation').validate;

var BedrockError = bedrock.util.BedrockError;
var config = bedrock.config;

require('bedrock-express');
require('bedrock-mail');
require('./config');

var PERMISSIONS = bedrock.config.permission.permissions;

var api = {};
module.exports = api;

/**
 * Sends a notification to the given email about a credential, provided that
 * the `actor` has issuing permission for the credential.
 *
 * @param actor the actor performing the action.
 * @param options the options to use:
 *          [credential] the ID of the Credential to send a notification
 *            about.
 *          [email] the email address to send to.
 * @param callback(err) called once the operation completes.
 */
api.notify = function(actor, options, callback) {
  if(typeof options !== 'object') {
    throw new TypeError('`options` must be an object.');
  }
  if(typeof options.credential !== 'string') {
    throw new TypeError('`options.credential` must be a string.');
  }
  if(typeof options.email !== 'string') {
    throw new TypeError('`options.email` must be a string.');
  }

  async.auto({
    getCredential: function(callback) {
      store.provider.get(null, options.credential, function(err, credential) {
        callback(err, credential);
      });
    },
    checkPermission: ['getCredential', function(callback, results) {
      brPermission.checkPermission(
        actor, PERMISSIONS.CREDENTIAL_ISSUE,
        {resource: results.getCredential, translate: 'issuer'}, callback);
    }],
    sendEmail: ['checkPermission', function(callback, results) {
      bedrock.events.emitLater({
        type: 'bedrock-credential-notifications.notify',
        details: {
          credential: results.getCredential,
          email: options.email
        }
      });
      callback();
    }]
  }, function(err) {
    callback(err);
  });
};

bedrock.events.on('bedrock-express.configure.routes', function(app) {
  // create a new credential notification
  app.post(config['bedrock-credential-notifications'].routes.basePath,
    ensureAuthenticated,
    validate('services.credential-notifications.create'),
    function(req, res, next) {
      // TODO: add `type` to body and check it ... `EmailCredentialNotification`
      // allow other types (sms, others, etc.)
      api.notify(req.user.identity, {
        credential: req.body.credential,
        email: req.body.email
      }, function(err) {
        if(err) {
          return next(new BedrockError(
            'Failed to send credential notification.',
            'SendCredentialNotificationFailed', {
              // TODO: could be 5xx (server side error)
              httpStatusCode: 400,
              'public': true
            }, err));
        }
        res.sendStatus(204);
      });
    });
});
