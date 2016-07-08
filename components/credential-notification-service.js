/*!
 * Bedrock Credential Notification Service.
 *
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 *
 * @author Alex Lamar
 */
define(['angular'], function(angular) {

'use strict';

function register(module) {
  module.service('brCredentialNotificationService', factory);
}

/* @ngInject */
function factory(config, $http) {
  var service = {};
  var basePath =
    config.data['bedrock-credential-notifications'].routes.basePath;

  service.notify = function(credential, email) {
    return Promise.resolve(
      $http.post(basePath, {
        credential: credential,
        email: email
      }));
  };

  return service;
}

return register;

});
