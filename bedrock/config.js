/*
 * Bedrock Configuration.
 *
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
module.exports = function(bedrock) {
  var vars = bedrock.config.views.vars;
  vars['bedrock-credential-notifications'] =
    vars['bedrock-credential-notifications'] || {};
  vars['bedrock-credential-notifications'].routes =
    vars['bedrock-credential-notifications'].routes || {};
  vars['bedrock-credential-notifications'].routes.basePath =
    bedrock.config['bedrock-credential-notifications'].routes.basePath || '';
};
