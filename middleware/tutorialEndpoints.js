const express = require('express');
const router = express.Router({mergeParams:true})
const bodyParser = require('body-parser');
const path = require('path');
const { CLIENT_ID } = process.env;
const appBase = path.join(__dirname, '..')
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

// http://expressjs.com/en/starter/basic-routing.html
router.get('/', function(request, response) {
  response.sendFile(appBase + '/views/index.html');
});

module.exports = router;