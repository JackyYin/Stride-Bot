//The Stride JS client library handles API authentication and calling REST endpoints from the Stride API
const Client = require("stride-node-client");
const { CLIENT_ID, CLIENT_SECRET } = process.env;
const stride = new Client({ CLIENT_ID, CLIENT_SECRET, NODE_ENV: "production" });
const { Document } = require('adf-builder');

const GIPHY_API_KEY = process.env.GIPHY_API_KEY;
const GIPHY_BASE_URL = "http://api.giphy.com";
const rp = require("request-promise");
const fs = require('fs');
let https = require('https');
let randomstring = require('randomstring');

module.exports = async function ( cloudId, conversationId, searchOption) {
  
  var stream = await searchGIF(cloudId, conversationId, searchOption);  
  
  // Then, upload it to Stride
  const uploadOpts = {
      headers: { 'Content-Type': 'application/octet-stream' },
      body: stream,
    };
  var uploadString = await stride.api.media.upload(cloudId, conversationId, randomstring.generate(10) + '.gif', uploadOpts);
  var upload = JSON.parse(uploadString);

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

async function searchGIF(cloudId, conversationId, searchOption) {
  const options = {
		url: GIPHY_BASE_URL + '/v1/gifs/search',
		qs: {
			q: searchOption,
      api_key: GIPHY_API_KEY,
		},
	};
    
  var obj = await rp(options, function(err, response, body) {
    if(err) {
      console.log(err);
    }
  }).then(function (parseBody) {
    var obj = JSON.parse(parseBody);
    return obj;
  }).catch(function(err){
    console.log(err);
  });
  
  var image_count = Math.floor(Math.random() * 25);
  console.log("GIF size: ", obj.data[image_count].images.original.size);
  var stream = await downloadImage(obj.data[image_count].images.original.url);
  return stream;
};
                 
//simple utility function to download an image from a website
async function downloadImage(imgUrl) {
  return new Promise(resolve => {
    https.get(imgUrl, function(stream) {
      resolve(stream);
    });
  });
}  
