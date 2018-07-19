const express = require('express');
const router = express.Router({mergeParams:true})

const Client = require("stride-node-client");
const { CLIENT_ID, CLIENT_SECRET } = process.env;
const stride = new Client({ CLIENT_ID, CLIENT_SECRET, NODE_ENV: "production" });

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

const cloudId   = process.env.CLOUD_ID;
const checkRoom = process.env.CONVERSATION_ID_CHECK_ROOM;
const obiRoom   = process.env.CONVERSATION_ID_OBI_ROOM;
const CHECKIN_BASE_URL = process.env.CHECKIN_BASE_URL;

async function getUserObject (email) {
  return await firebase.database().ref('users').orderByChild("email").equalTo(email).once("value")
  .then((snapshot) => {
    return snapshot.val();
  })
  .catch((error) => {
    console.log(error);
  });
}

router.post('/auth/verify', function(request, response) {
  console.log(request.body.reply_message);
  firebase.database().ref('users').orderByChild("email").equalTo(request.body.reply_message.email).once("value",function(snapshot){
    var key = Object.keys(snapshot.val())[0];
    db.ref('users/' + key).update(request.body.reply_message);
  });
  response.sendStatus(200);
});

router.post('/leave/notify', async function(request, response) {
  console.log("reply_message: ", request.body.reply_message);
  console.log("email: ", request.body.email);
  response.sendStatus(200);
  
  if (request.body.email) {
    var userObject = await getUserObject (request.body.email);
    
    console.log(userObject);
    //有存在firebase的使用者才會收到個人通知
    if (userObject) {
      var userId = Object.keys(userObject)[0];  
      let conversation = await stride.api.conversations.getByUserId(cloudId, userId, {});
      let opts = {
        body: request.body.reply_message,
        headers: { "Content-Type": "text/plain", accept: "application/json" }
      };
    
      await stride.api.messages.sendMessage(cloudId, conversation.id, opts);
    } 
  }
  else {
    let opts = {
      body: request.body.reply_message,
      headers: { "Content-Type": "text/plain", accept: "application/json" }
    };
    
    await stride.api.messages.sendMessage(cloudId, obiRoom, opts);
  }
});

router.post('/leave/types',async function(request, response) {
  console.log(request.body);
  var url = CHECKIN_BASE_URL + "/api/v2/leave/types";
  let options = {
    uri: url,
    resolveWithFullResponse: true, 
    method: 'GET',
    headers: {
      "Authorization": "Bearer " + request.body.access_token,
    },
  }
  
  var reply = await rp(options)
  .then(function (res) {
    return JSON.parse(res.body);
  })
  .catch(function(err){
    console.log("error: ", err);
    return err.error.reply_message;
  });
  
  console.log("reply: ", reply);
  response.send(reply);
});

module.exports = router;