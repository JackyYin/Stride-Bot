//The Stride JS client library handles API authentication and calling REST endpoints from the Stride API
const Client = require("stride-node-client");
const { CLIENT_ID, CLIENT_SECRET } = process.env;
const stride = new Client({ CLIENT_ID, CLIENT_SECRET, NODE_ENV: "production" });

const fs = require('fs');
const path = require('path');
const basicFormatting = fs.readFileSync(path.join(__dirname, '1-basic-formatting.md'));
const codeAndTables = fs.readFileSync(path.join(__dirname, '2-code-and-tables.md'));
const links = fs.readFileSync(path.join(__dirname, '3-links.md'));

module.exports = async function ( cloudId, conversationId, successHandler, errorHandler) {
  //send response to the conversation
  let opts = { headers: { 'Content-Type': 'text/markdown', accept: 'application/json' } };

  //send content to the conversation as 3 consecutive messages
  opts.body = basicFormatting;
  await stride.api.messages.sendMessage(cloudId, conversationId, opts)
    .then(successHandler,errorHandler);
  opts.body = codeAndTables;
  await stride.api.messages.sendMessage(cloudId, conversationId, opts)
    .then(successHandler,errorHandler);
  opts.body = links;
  await stride.api.messages.sendMessage(cloudId, conversationId, opts)
    .then(successHandler,errorHandler);

};