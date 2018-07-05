//The Stride JS client library handles API authentication and calling REST endpoints from the Stride API
const Client = require("stride-node-client");
const { CLIENT_ID, CLIENT_SECRET } = process.env;
const stride = new Client({ CLIENT_ID, CLIENT_SECRET, NODE_ENV: "production" });

const CHECKIN_BOT_TOKEN = process.env.CHECKIN_BOT_TOKEN;
const CHECKIN_BASE_URL = process.env.CHECKIN_BASE_URL;
//Get the document builder for ADF - https://developer.atlassian.com/cloud/stride/apis/document/libs/
const { Document } = require('adf-builder');
const rp = require("request-promise");
const firebase = require('firebase');

var config = {
  apiKey: "AIzaSyDmmMqnwGE-NrhKbiW9XX_XvfppWpDUX70",
  authDomain: "stride-bot-a9c85.firebaseapp.com",
  databaseURL: "https://stride-bot-a9c85.firebaseio.com",
  projectId: "stride-bot-a9c85",
  storageBucket: "stride-bot-a9c85.appspot.com",
  messagingSenderId: "151580747908"
};
firebase.initializeApp(config);

module.exports = async function ( cloudId, conversationId, messageSenderId, email) {

  var message = await register(cloudId, conversationId, messageSenderId, email);
  
  let opts = {
    body: message,
    headers: { "Content-Type": "text/plain", accept: "application/json" }
  };

  //send response to the conversation
  return stride.api.messages.sendMessage(cloudId, conversationId, opts)
};

async function register(cloudId, conversationId, messageSenderId, email) {
  const options = {
    uri: CHECKIN_BASE_URL + "/api/v2/register",
    method: 'POST',
    headers: {
      authorization: "Bearer " + CHECKIN_BOT_TOKEN,
      "cache-control": "no-cache"
    },
    json: {
      email: email
    }
  }
  const db = firebase.database();
  
  var reply = await rp(options)
  .then(function (res) {
    db.ref('users/' + messageSenderId).once('value').then(function(snapshot) {
      if (snapshot.val() && snapshot.val().email) {
        console.log("已存在email: ", snapshot.val().email);
      }
      else {
        db.ref('users/' + messageSenderId).set({
          email: email,
        });
      }
    });
    
    return res.reply_message;
  })
  .catch(function(err){
    console.log("error: ", err.error.reply_message);
    return err.error.reply_message;
  });
  
  return reply;
 }