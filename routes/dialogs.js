const express = require('express');
const router = express.Router({mergeParams:true});
const Client = require("stride-node-client");
const { CLIENT_ID, CLIENT_SECRET } = process.env;
const stride = new Client({ CLIENT_ID, CLIENT_SECRET, NODE_ENV: "production" });
const { Document } = require('adf-builder');
const CHECKIN_BASE_URL = process.env.CHECKIN_BASE_URL;
const rp = require("request-promise");
const randomstring = require('randomstring');

/**
 *  @name Dialogs
 *  @see {@link https://developer.atlassian.com/cloud/stride/apis/modules/chat/dialog/ | API Reference: Dialogs }
 *  @see {@link https://developer.atlassian.com/cloud/stride/learning/dialogs/ | Concept Guide }
 *  @see {@link https://developer.atlassian.com/cloud/stride/learning/adding-dialogs | How-to Guide }
 *  @description
 *  To create a dialog, add a chat:dialog module to the app descriptor.
 *  The dialog will open when it is the target of an action and the action is fired, or from another module using the JavaScript API.
 *
 ```
 "chat:dialog": [
 {
   "key": "dialog-1",
   "title": {
	 "value": "App Dialog"
   },
   "options": {
	 "size": {
	   "width": "500px",
	   "height": "300px"
	 }
 "url": "/dialogs/dialog",
"authentication": "jwt"
},
]
```
**/
async function requestChart(access_token, date, types) {
  var url = CHECKIN_BASE_URL + "/api/v2/leave?";
  
  date.forEach(function (object) {
    if (Object.values(object) != '') {
      url += Object.keys(object) + "=" + Object.values(object) + "&";
    }
  });
  
  types.forEach(function (value) {
    url += "types[]=" + value + "&";
  })
    
  let options = {
    uri: url,
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

async function updateLeave(data)
{
  var url = CHECKIN_BASE_URL + "/api/v2/leave/" + data.check_id;
  let options = {
    uri: url,
    resolveWithFullResponse: true, 
    method: 'PUT',
    headers: {
      "Authorization": "Bearer " + data.access_token,
    },
    body: {
      "start_time": data.start_time,
      "end_time": data.end_time,
      "leave_type": data.leave_type,
      "leave_reason": data.leave_reason,
    },
    json: true 
  }
  
  return new Promise(resolve => {
    rp(options)
    .then(function (res) {
      resolve(res.body);
    })
    .catch(function(err){
      console.log("err:", err);
    });
  });
}

router.get('/dialog/leaveChart', function(req, res) {
  res.redirect('/public/templates/dialogs/leaveChart.html');
});

router.post('/dialog/leaveChart',async function(req, res) {
  
  if (!req.body.access_token) {
    console.log("帳號未註冊");
    let opts = {
      body: "請先完成註冊流程",
      headers: { "Content-Type": "text/plain", accept: "application/json" }
    };
    return stride.api.messages.sendMessage(req.body.cloudId, req.body.conversationId, opts)
  }
  
  var date = [
    {'start_date': req.body.start_date},
    {'end_date': req.body.end_date},
  ];
  var types = JSON.parse(req.body.types);
  
  var stream = await requestChart(req.body.access_token, date, types);
  console.log(stream);
  
  // Then, upload it to Stride
  const uploadOpts = {
      headers: { 'Content-Type': 'application/octet-stream' },
      body: stream,
    };
  var uploadString = await stride.api.media.upload(req.body.cloudId, req.body.conversationId, randomstring.generate(10) + '.png', uploadOpts);
  var upload = JSON.parse(uploadString);
  console.log(upload);

  //send response to the conversation   
  const doc = new Document();
  const mediaGroup = doc.mediaGroup();
  
  mediaGroup .media({
    "id": upload.data.id,
    "type": "file",
    "collection": req.body.conversationId
  });
  return stride.api.messages.sendMessage(req.body.cloudId, req.body.conversationId, {body: doc.toJSON()})

  res.send(JSON.stringify({ status: 'Done'}));
});

router.get('/dialog/checkEdit', function(req, res) {
  res.redirect('/public/templates/dialogs/checkEdit.html');
});

router.post('/dialog/checkEdit',async function(req, res) {
  
  if (!req.body.access_token) {
    console.log("帳號未註冊");
    let opts = {
      body: "請先完成註冊流程",
      headers: { "Content-Type": "text/plain", accept: "application/json" }
    };
    return stride.api.messages.sendMessage(req.body.cloudId, req.body.conversationId, opts)
  }
  
  if (req.body.callerId != req.body.clickerId) {
    let opts = {
      body: "沒有權限編輯此假單",
      headers: { "Content-Type": "text/plain", accept: "application/json" }
    };  
    return stride.api.messages.sendMessage(req.body.cloudId, req.body.conversationId, opts)
  }
  
  var response = await updateLeave(req.body);
  console.log(response);
  
  let opts = {
    body: response.reply_message,
    headers: { "Content-Type": "text/plain", accept: "application/json" }
  };
  
  return stride.api.messages.sendMessage(req.body.cloudId, req.body.conversationId, opts)

  res.send(JSON.stringify({ status: 'Done'}));
});

router.post('/dialog/handleButtonClickServerSide', function(req, res) {
  res.send(JSON.stringify({ status: 'Done' }));
});

module.exports = router;