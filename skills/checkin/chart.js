//The Stride JS client library handles API authentication and calling REST endpoints from the Stride API
const Client = require("stride-node-client");
const { CLIENT_ID, CLIENT_SECRET } = process.env;
const stride = new Client({ CLIENT_ID, CLIENT_SECRET, NODE_ENV: "production" });
const { Document } = require('adf-builder');

const CHECKIN_BASE_URL = process.env.CHECKIN_BASE_URL;
const rp = require("request-promise");
const randomstring = require('randomstring');
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
  
  var stream = await requestChart(access_token);
  console.log(stream);
  
  // Then, upload it to Stride
  const uploadOpts = {
      headers: { 'Content-Type': 'application/octet-stream' },
      body: stream,
    };
  var uploadString = await stride.api.media.upload(cloudId, conversationId, randomstring.generate(10) + '.png', uploadOpts);
  var upload = JSON.parse(uploadString);
  console.log(upload);

  //send response to the conversation   
  const doc = new Document();
  const mediaGroup = doc.mediaGroup();
  
  mediaGroup .media({
    "id": upload.data.id,
    "type": "file",
    "collection": conversationId
  });
  return stride.api.messages.sendMessage(cloudId, conversationId, {body: doc.toJSON()})
};
    
//simple utility function to download an image from a website
async function requestChart(access_token) {
  let options = {
    uri: CHECKIN_BASE_URL + "/api/v2/leave",
    resolveWithFullResponse: true, 
    method: 'GET',
    headers: {
      "Authorization": "Bearer " + access_token,
    },
    encoding: null
  }
  
  return new Promise(resolve => {
    rp.get(options)
    .then(function (res) {
      console.log(res.body)
      resolve(res.body);
    })
    .catch(function(err){
      console.log(err);
    });
  });
}

  
