/*!
 * Credential Notifications module
 *
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 *
 * @author Alex Lamar
 */
define([
  'angular',
  './credential-notification-service'
], function(angular) {

'use strict';

var module = angular.module('bedrock-credential-notifications', []);

Array.prototype.slice.call(arguments, 1).forEach(function(register) {
  register(module);
});

});
