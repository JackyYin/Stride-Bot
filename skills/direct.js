//The Stride JS client library handles API authentication and calling REST endpoints from the Stride API
const Client = require("stride-node-client");
const { CLIENT_ID, CLIENT_SECRET } = process.env;
const stride = new Client({ CLIENT_ID, CLIENT_SECRET, NODE_ENV: "production" });

module.exports = async function ( cloudId, conversationId, messageSenderId, message) {
  
  let conversation = await stride.api.conversations.getByUserId(cloudId, messageSenderId, {});
  let optsDoc = {
    body: message,
    headers: { 'Content-Type': 'text/plain', accept: 'application/json' },
  };
  
  return stride.api.messages.sendMessage(cloudId, conversation.id, optsDoc);
};