/*
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
var bedrock = require('bedrock');
var constants = bedrock.config.constants;
var schemas = require('bedrock-validation').schemas;

var createNotification = {
  title: 'Create Credential Notification',
  type: 'object',
  properties: {
    '@context': schemas.jsonldContext(constants.IDENTITY_CONTEXT_V1_URL),
    //type: schemas.jsonldType('EmailCredentialNotification'),
    credential: schemas.identifier(),
    email: schemas.email()
  },
  additionalProperties: false
};

module.exports.create = function() {
  return createNotification;
};
