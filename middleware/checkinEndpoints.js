const express = require('express');
const router = express.Router({mergeParams:true})
const bodyParser = require('body-parser');
const path = require('path');
const { CLIENT_ID } = process.env;
const appBase = path.join(__dirname, '..')
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

router.post('/checkin/register/active', function(request, response) {
  console.log(request.body.content);
  firebase.database().ref('users').orderByChild("email").equalTo(request.body.content.email).once("value",function(snapshot){
    var key = Object.keys(snapshot.val())[0];
    db.ref('users/' + key).update(request.body.content);
  });
  response.sendStatus(200);response;
});

module.exports = router;