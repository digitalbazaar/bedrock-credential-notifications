/*!
 * Bedrock Credential config.
 *
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 *
 * @author Alex Lamar
 */
var bedrock = require('bedrock');
var config = bedrock.config;
var path = require('path');

config['bedrock-credential-notifications'] = {};
config['bedrock-credential-notifications'].routes = {};
config['bedrock-credential-notifications'].routes.basePath =
  '/credentials/notifications';

// Mail templates
config.mail.events.push({
  type: 'bedrock.issuer.credential.notify',
  template: 'bedrock.issuer.credential.notify'
});
var ids = [
  'bedrock.issuer.credential.notify'
];
ids.forEach(function(id) {
  config.mail.templates.config[id] = {
    filename: path.join(__dirname, '..', 'email-templates', id + '.tpl')
  };
});
