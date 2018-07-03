//The Stride JS client library handles API authentication and calling REST endpoints from the Stride API
const Client = require("stride-node-client");
const { CLIENT_ID, CLIENT_SECRET } = process.env;
const stride = new Client({ CLIENT_ID, CLIENT_SECRET, NODE_ENV: "production" });

//Get the document builder for ADF - https://developer.atlassian.com/cloud/stride/apis/document/libs/
const { Document } = require('adf-builder');

module.exports = async function ( cloudId, conversationId, messageSenderId) {

  //creating the response message
  const doc = new Document();

  doc
    .paragraph()
    .strong('Hi ')
    .mention(messageSenderId)
    .strong('!');
  doc
    .paragraph()
    .text('Hello ')
    .mention('all')
    .text('!');
  doc
    .paragraph()
    .text('Look who\'s ')
    .mention('here')
    .text('!');

  let opts = { body: doc.toJSON() };

  //send response to the conversation
  return stride.api.messages.sendMessage(cloudId, conversationId, opts)
};