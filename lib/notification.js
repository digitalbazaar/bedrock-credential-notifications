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

require('bedrock-mail');
require('./config');

var PERMISSIONS = bedrock.config.permission.permissions;

var api = {};
module.exports = api;

/**
 * Sends a notification to the given email about a credential.
 *
 * @param actor the actor performing the action.
 * @param credential the Credential to issue.
 * @param email the email to send to
 * @param callback(err, credential) called once the operation completes.
 */
api.sendNotification = function(actor, credential, email, callback) {
  if(!credential || !credential.id || !email) {
    return callback(new TypeError(
     'A valid credential and email must be supplied.'));
  }
  async.auto({
    checkPermission: function(callback) {
      brPermission.checkPermission(
        actor, PERMISSIONS.CREDENTIAL_ISSUE,
        {resource: credential, translate: 'issuer'}, callback);
    },
    getCredential: ['checkPermission', function(callback) {
      store.provider.get(null, credential.id, function(err, credential) {
        callback(err, credential);
      });
    }],
    sendEmail: ['getCredential', function(callback, results) {
      credential = results.getCredential;
      bedrock.events.emitLater({
        type: 'bedrock.issuer.credential.notify',
        details: {
          credential: credential,
          email: email
        }
      });
    }]
  }, function(err, results) {
    callback(err, results.getCredential);
  });
};

bedrock.events.on('bedrock-express.configure.routes', function(app) {
  app.post(config['bedrock-credential-notifications'].routes.basePath,
    ensureAuthenticated,
    function(req, res, next) {
      var email = req.body.email;
      var credential = req.body.credential;
      api.sendNotification(req.user.identity, credential, email,
        function(callback, results) {
          if(err) {
            return next(new BedrockError(
             'Notification failed to send.',
             'NotifyCredentialFailed', {
                httpStatusCode: 400,
                'public': true
              }, err));
          }
          res.status(200).json(results);
        });
    });
});
