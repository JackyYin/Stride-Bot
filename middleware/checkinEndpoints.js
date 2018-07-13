const express = require('express');
const router = express.Router({mergeParams:true})
const bodyParser = require('body-parser');
const path = require('path');
const appBase = path.join(__dirname, '..')
const Client = require("stride-node-client");
const { CLIENT_ID, CLIENT_SECRET } = process.env;
const stride = new Client({ CLIENT_ID, CLIENT_SECRET, NODE_ENV: "production" });
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
// http://expressjs.com/en/starter/static-files.html
router.use(express.static(appBase + '/public'));
router.use(bodyParser.json());
//host the readme.md file for the tutorial view
router.get('/readme.md', (req,res) =>{
  res.sendFile(appBase + '/README.md');
})
//host the clientId to help generate the install button
router.get('/clientId', (req,res)=>{
  res.send(CLIENT_ID)
})

router.post('/checkin/auth/verify', function(request, response) {
  console.log(request.body.reply_message);
  firebase.database().ref('users').orderByChild("email").equalTo(request.body.reply_message.email).once("value",function(snapshot){
    var key = Object.keys(snapshot.val())[0];
    db.ref('users/' + key).update(request.body.reply_message);
  });
  response.sendStatus(200);
});

router.post('/checkin/leave/notify', function(request, response) {
  console.log(request.body.reply_message);
  response.sendStatus(200);
 
  let opts = {
    body: request.body.reply_message,
    headers: { "Content-Type": "text/plain", accept: "application/json" }
  };
  //send response to the conversation
  return stride.api.messages.sendMessage("34523cd1-402a-4f3f-af90-cffa8933dda8", "509bb0f3-491a-4065-916f-87a87f854f24", opts)
});

module.exports = router;