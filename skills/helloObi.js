//The Stride JS client library handles API authentication and calling REST endpoints from the Stride API
const Client = require("stride-node-client");
const { CLIENT_ID, CLIENT_SECRET } = process.env;
const stride = new Client({ CLIENT_ID, CLIENT_SECRET, NODE_ENV: "production" });
const { Document } = require('adf-builder');

const GIPHY_API_KEY= "BoYWy5XiRwN4kmfvhdJs6nSZOjGaJ6In";
const GIPHY_BASE_URL = "http://api.giphy.com";



module.exports = async function ( cloudId, conversationId) {
  var opts = await searchGIF(cloudId, conversationId);
  
  //send response to the conversation
  return stride.api.messages.sendMessage(cloudId, conversationId, opts)
};

async function searchGIF(cloudId, conversationId) {
  var rp = require("request-promise");
  var propertiesObject = { q:'love', api_key: GIPHY_API_KEY, limit: 1 };
  const options = {
		url: GIPHY_BASE_URL + '/v1/gifs/search',
		qs: {
			q: 'love',
      api_key: GIPHY_API_KEY,
      limit: 1,
		},
	};
    
  var opts = rp(options, function(err, response, body) {
    if(err) {
      console.log(err);
    }
  }).then(function (parseBody) {
    var obj = JSON.parse(parseBody);
    var result1 = getGIF(obj.data[0].images.fixed_height_still.url);
    //console.log(result1);
    
    return  {
      body: JSON.stringify(obj.data[0]),
      headers: { "Content-Type": "text/plain", accept: "application/json" }
    };
  }).catch(function(err){
    console.log(err);
  });
  return opts;
};
                 
async function getGIF(url) {
  var fs = require('fs'),
    request = require('request');

  var download = function(url, filename, callback){
    request.head(url, function(err, res, body){
      console.log('content-type:', res.headers['content-type']);
      console.log('content-length:', res.headers['content-length']);

      request(url).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
  };
  
  download(url, 'test.gif', function(){
    console.log('done');
  });
  return true;
}; 
  
  
  //console.log("Get response: "+ JSON.stringify(opts));
  
  //creating the response message
  //const doc = new Document();

  //const mediaGroup = doc.mediaGroup();
  
  //mediaGroup .media({
  //  "id": "5e0baf6c-0908-4dde-84d2-e1e016cc3f8c",
  //  "type": "file",
  //  "collection": conversationId
  //});
  
