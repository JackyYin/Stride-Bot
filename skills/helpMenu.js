//The Stride JS client library handles API authentication and calling REST endpoints from the Stride API
const Client = require("stride-node-client");
const { CLIENT_ID, CLIENT_SECRET } = process.env;
const stride = new Client({ CLIENT_ID, CLIENT_SECRET, NODE_ENV: "production" });

const message =
`
Checkin Help Menu
------------------------------
@ mention or direct message this bot with one of these commands:

* \`obi\` - Hello Obi

`;

module.exports = function ( cloudId, conversationId) {
  let opts = {
    body: message, //Markdown hello world
    headers: { "Content-Type": "text/markdown", accept: "application/json" }
  };

  //send response to the conversation
  return stride.api.messages.sendMessage(cloudId, conversationId, opts)
};