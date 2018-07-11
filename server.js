// init project
const express = require("express");
const app = express();
const bodyParser = require('body-parser');

//The Stride JS client library handles API authentication and calling REST endpoints from the Stride API
const Client = require("stride-node-client");
const { CLIENT_ID, CLIENT_SECRET } = process.env;
const stride = new Client({ CLIENT_ID, CLIENT_SECRET, NODE_ENV: "production" });

//Middleware
const auth = require("./middleware/auth")(CLIENT_SECRET);
const tutorialMiddleware = require("./middleware/tutorialEndpoints");
const checkinMiddleware = require("./middleware/checkinEndpoints");
const lifecycle = require("./middleware/lifecycle");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json());
app.use(tutorialMiddleware);
app.use(checkinMiddleware);
app.use(lifecycle);

//public assets
app.use('/public/templates', express.static('public/templates'));
app.use('/public/js', express.static('public/js'));
app.use('/public/img', express.static('public/img'));

//route definition
const routes = require("./routes");

app.use("/glances", routes.glances);
app.use("/dialogs",  routes.dialogs);

let botUser = null;

//Caches the bot user info for use when parsing direct messages
async function getBotsUser(){
  if(!botUser){
    botUser = await stride.api.users.me()
      .catch(err => {
        console.error(`Bot user lookup failed.`);
        throw err;
      })
  }
  return botUser;
}


/**
 *  @see {@link https://developer.atlassian.com/cloud/stride/apis/modules/chat/bot-messages | API Reference: Bot messages }
 *  @see {@link https://developer.atlassian.com/cloud/stride/learning/bots/ | Concept Guide }
 *  @see {@link https://developer.atlassian.com/cloud/stride/learning/adding-bots | How-to Guide }
 *  @description
 *  Receives all direct messages and messages with the bot mentioned
 **/
app.post("/mentions", auth, async (req, res, next) => {
  //for webhooks send the response asap or the messages will get replayed up to 3 times
  res.sendStatus(204);
  console.log("message received");


  //The auth middleware stores the decrypted JWT token values as res.locals.context
  //The cloudId and conversationId are needed to send a message back
  const { cloudId, conversationId } = res.locals.context;

  let responseCount = 0;
  const successHandler = () =>{responseCount++; console.log(`response #${responseCount} sent`)};
  const failureHandler = err => {console.error(`response #${responseCount} send error ${err}`); next(err)};

  //How to easily convert ADF to text
  const messageText = await AtlassianDocFormatToText(req.body.message.body);
  //remove bot's name from the text and take first 'word' as option selection
  let option = messageText.replace(`@${(await getBotsUser()).name}`, '').toLocaleLowerCase().trim().split(' ')[0] || 'help';
  let senderId = req.body.message.sender.id;
  //switch 
  switch (option){
    case 'giphy':
      let searchOption = messageText.replace(`@${(await getBotsUser()).name}`, '').toLocaleLowerCase().trim().split(' ')[1];
      await require('./skills/giphy')(cloudId,conversationId, searchOption)
        .then(successHandler, failureHandler);
      break;
    case 'auth':
      let email = messageText.replace(`@${(await getBotsUser()).name}`, '').toLocaleLowerCase().trim().split(' ')[1];
      await require('./skills/checkin/auth')(cloudId,conversationId, senderId, email)
        .then(successHandler, failureHandler);
      break;
    case 'annual':
      await require('./skills/checkin/annualStat')(cloudId,conversationId, senderId)
        .then(successHandler, failureHandler);
      break;
    case 'chart':
      await require('./skills/checkin/chart')(cloudId,conversationId, senderId)
        .then(successHandler, failureHandler);
      break;
    case '2':
      await require('./skills/helloWorld')(cloudId,conversationId)
        .then(successHandler, failureHandler);
      break;
    case '3':
      await require('./skills/sendingMarkdown')(cloudId,conversationId, successHandler, failureHandler);
      break;
    case '4':
      await require('./skills/mentioningUsers')(cloudId, conversationId, senderId)
        .then(successHandler, failureHandler);
      break;
    case '5':
      await require('./skills/applicationCards')(cloudId,conversationId, senderId, successHandler, failureHandler);
      break;
    case 'help':
    default:
      await require('./skills/helpMenu')(cloudId,conversationId)
        .then(successHandler, failureHandler);
  }

});

app.post("/cardActions", auth, async (req, res, next) => {
  //for webhooks send the response asap or the messages will get replayed up to 3 times
  res.sendStatus(204);

  //The auth middleware stores the decrypted JWT token values as res.locals.context
  //The cloudId and conversationId are needed to send a message back
  const { cloudId, conversationId } = res.locals.context;

  const successHandler = () =>{console.log(`card action response sent`)};
  const failureHandler = err => { console.error(`error responding to action: ${err}`); };

  //Action parameters are sent as part of the body
  let parameters = req.body.parameters;
  switch(parameters.operation){
    case "1":
      await require('./skills/helloWorld')(cloudId,conversationId)
        .then(successHandler, failureHandler);
      break;
    case "help":
    default:
      await require("./skills/helpMenu")(cloudId,conversationId)
        .then(successHandler, failureHandler);
      break;
  }
});

async function AtlassianDocFormatToText(document) {
  let opts = {
    headers: {
      accept: "text/plain",
      "Content-Type": "application/json"
    },
    body: document
  };
  return stride.helper("/pf-adf-service/render", "POST", opts)
    .then(value => value + ''); //Force single number values to be converted to string
}

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
