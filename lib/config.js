/*!
 * Bedrock Credential Notifications config.
 *
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 *
 * @author Alex Lamar
 */
var bedrock = require('bedrock');
var config = bedrock.config;
var path = require('path');
require('bedrock-mail');

config['bedrock-credential-notifications'] = {};
config['bedrock-credential-notifications'].routes = {};
config['bedrock-credential-notifications'].routes.basePath =
  '/credential-notifications';

// mail templates
config.mail.events.push({
  type: 'bedrock-credential-notifications.notify',
  template: 'bedrock-credential-notifications.notify'
});
var ids = [
  'bedrock-credential-notifications.notify'
];
ids.forEach(function(id) {
  config.mail.templates.config[id] = {
    filename: path.join(__dirname, '..', 'email-templates', id + '.tpl')
  };
});

// common validation schemas
config.validation.schema.paths.push(
  path.join(__dirname, '..', 'schemas')
);
