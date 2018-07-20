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

async function getCheckObject(access_token, checkId) {
  let options = {
    uri: CHECKIN_BASE_URL + "/api/v2/leave/" + checkId,
    resolveWithFullResponse: true, 
    method: 'GET',
    headers: {
      "Authorization": "Bearer " + access_token,
    },
  }
  
  return rp.get(options)
    .then(function (res) {
      var message =  JSON.parse(res.body);
      return {
        "statusCode": res.statusCode,
        "message": message,
      }
    })
    .catch(function(err){
      var message =  JSON.parse(err.error);
      return {
        "statusCode": err.statusCode,
        "message": message,
      }
    });
}

module.exports = async function ( cloudId, conversationId, messageSenderId, checkId) {

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
  
  var checkObject = await getCheckObject(access_token, checkId); 
      
  if (checkObject.statusCode == 400) {
    let opts = {
      body: checkObject.message.reply_message,
      headers: { "Content-Type": "text/plain", accept: "application/json" }
    };
    return stride.api.messages.sendMessage(cloudId, conversationId, opts)
  }
  
  var parameters = {
    "callerId": messageSenderId,
    "checkId": checkId,
  }
  
  var message = {
    "type": "doc",
    "version": 1,
    "content": [{
      "type": "paragraph",
      "content":[{
        "type": "text",
        "text": "點我編輯假單 (" + checkId + ")",
        "marks": [{
          "type": "action",
          "attrs": {
            "title": "編輯假單",
            "target": {
              "key": "actionTarget-sendToDialog-checkEdit"
            },
            "parameters": parameters,
          }
        }]
      }]
    }]
  };
  
  //send response to the conversation
  return stride.api.messages.sendMessage(cloudId, conversationId, {body: message})
};