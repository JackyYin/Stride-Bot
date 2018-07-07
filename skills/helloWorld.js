//The Stride JS client library handles API authentication and calling REST endpoints from the Stride API
const Client = require("stride-node-client");
const { CLIENT_ID, CLIENT_SECRET } = process.env;
const stride = new Client({ CLIENT_ID, CLIENT_SECRET, NODE_ENV: "production" });


module.exports = function ( cloudId, conversationId) {
  let opts = {
    body: "**_Obi 他媽智障！_**", //Markdown hello world
    headers: { "Content-Type": "text/markdown", accept: "application/json" }
  };

  //send response to the conversation
  return stride.api.messages.sendMessage(cloudId, conversationId, opts)
};