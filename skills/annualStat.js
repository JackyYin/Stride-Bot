//The Stride JS client library handles API authentication and calling REST endpoints from the Stride API
const Client = require("stride-node-client");
const { CLIENT_ID, CLIENT_SECRET } = process.env;
const stride = new Client({ CLIENT_ID, CLIENT_SECRET, NODE_ENV: "production" });

//Get the document builder for ADF - https://developer.atlassian.com/cloud/stride/apis/document/libs/
const { Document } = require('adf-builder');
const CHECKIN_BOT_TOKEN = process.env.CHECKIN_BOT_TOKEN;
const CHECKIN_BASE_URL = process.env.CHECKIN_BASE_URL;
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
if (!firebase.apps.length) {
    firebase.initializeApp(config);
}
const db = firebase.database();

module.exports = async function ( cloudId, conversationId, messageSenderId) {

  var access_token = await db.ref('users/' + messageSenderId).once('value').then(function(snapshot) {
    return snapshot.val().access_token;
  });
  
  console.log("access_token: ", access_token);
  if (!access_token) {
    console.log("帳號未註冊");
    let opts = {
      body: "請先完成註冊流程",
      headers: { "Content-Type": "text/plain", accept: "application/json" }
    };
    return stride.api.messages.sendMessage(cloudId, conversationId, opts)
  }
  
  const uri = CHECKIN_BASE_URL + '/api/v2/leave/annual';
  const options = {
    uri: uri,
    method: 'GET',
    headers: {
      "Authorization": "Bearer " + access_token,
      "cache-control": "no-cache"
    }
  }
  var message = await rp(options, function(err, response, body) {
    if(err) {
      console.log(err);
    }
  }).then(function (res) {
    var obj = JSON.parse(res);
    return obj.reply_message;
  }).catch(function(err){
    console.log(err);
  });
  let opts = {
      body: message,
      headers: { "Content-Type": "text/plain", accept: "application/json" }
    };
  
  //send response to the conversation
  return stride.api.messages.sendMessage(cloudId, conversationId, opts)
};