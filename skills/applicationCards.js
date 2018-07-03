//The Stride JS client library handles API authentication and calling REST endpoints from the Stride API
const Client = require("stride-node-client");
const { CLIENT_ID, CLIENT_SECRET } = process.env;
const stride = new Client({ CLIENT_ID, CLIENT_SECRET, NODE_ENV: "production" });

//Get the document builder for ADF - https://developer.atlassian.com/cloud/stride/apis/document/libs/
const { Document } = require("adf-builder");

//Card 1
function getCardWithLozenges() {
  const doc = new Document();
  const card = doc
    .applicationCard("Lozenges!", "Lozenges! \n 6 different appearances") //2nd parameter is a fallback text version of the message
    .description("6 different appearances");
  card.context("Stride API Hello World Option #4 - Card 1").icon({
    url:
      "https://cdn.glitch.com/743df685-0959-475b-8abb-394f391411b8%2F31-20e3.png?1530113793720",
    label: "1️⃣"
  }); //[1] Icon
  card.detail().title("Lozenges").lozenge({ text: "default" });
  card.detail().lozenge({ text: "removed", appearance: "removed" });
  card.detail().lozenge({ text: "success", appearance: "success" });
  card.detail().lozenge({ text: "inprogress", appearance: "inprogress" });
  card.detail().lozenge({ text: "new", appearance: "new" });
  card.detail().lozenge({ text: "moved", appearance: "moved" });
  return doc.toJSON();
}

//Card 2
function getCardWithBadges() {
  const doc = new Document();
  const card = doc
    .applicationCard("Badges!", "Badges! \n 5 different appearances: default, primary, important, added, removed") //2nd parameter is a fallback text version of the message
    .description("5 different appearances: default, primary, important, added, removed");
  card.context("Stride API Hello World Option #4 - Card 2").icon({
    url:
      "https://cdn.glitch.com/743df685-0959-475b-8abb-394f391411b8%2F32-20e3.png?1530113791891",
    label: "2️⃣"
  }); //[2] Icon
  card.detail().title("default").badge({value:1, appearance:"default"});
  card.detail().title("primary").badge({ value: 2, appearance: "primary" });
  card.detail().title("important").badge({ value: 3, appearance: "important" });
  card.detail().title("added").badge({ value: 4, appearance: "added" });
  card.detail().title("removed").badge({ value: 5, appearance: "removed" });
  card.detail().title("maxed").badge({value:9999, appearance:"default", max:9000}); //it's over 9000!
  return doc.toJSON();
}

//Card 3
function getCardWithIcons() {
  const doc = new Document();
  const card = doc
    .applicationCard("Icons!", "Icons! \n Icons add an image beside some text. From left to right: Title, icon, text") //2nd parameter is a fallback text version of the message
    .description("Icons add an image beside some text. From left to right: Title, icon, text");
  card.context("Stride API Hello World Option #4 - Card 3").icon({
    url:
      "https://cdn.glitch.com/743df685-0959-475b-8abb-394f391411b8%2F33-20e3.png?1530113791835",
    label: "3️⃣"
  }); //[3] Icon
  card.titleUser({url:"https://cdn.glitch.com/743df685-0959-475b-8abb-394f391411b8%2FSimplified%20Meeples-Beep%20Boop_1%404x.png?1530123672479", label:"Icons RULE!"});
  card.detail()
    .title("title")
    .text("text")
    .icon({url:"https://cdn.glitch.com/743df685-0959-475b-8abb-394f391411b8%2F33-20e3.png?1530113791835", label:"3️⃣"});
  card.detail()
    .title("Reactions")
    .icon({url:"https://cdn.glitch.com/743df685-0959-475b-8abb-394f391411b8%2F1f600.png?1530114407541", label:"Happy"})
    .text("3");
  card.detail()
    .icon({url:"https://cdn.glitch.com/743df685-0959-475b-8abb-394f391411b8%2F1f621.png?1530114417365", label:"Angry"})
    .text("1");
  card.detail()
    .text("0")
    .icon({url:"https://cdn.glitch.com/743df685-0959-475b-8abb-394f391411b8%2F1f625.png?1530114431235", label:"Sad"});
  return doc.toJSON();
}

function getPrimaryUserImage(userObj) {
  let photos = userObj.photos || [];
  let primaryPhoto = (photos.find(photo => photo.primary) || {}).value;
  return primaryPhoto || "https://cdn.glitch.com/743df685-0959-475b-8abb-394f391411b8%2F1f47e.png?1530118173137"; //backup image if no primary
}

//Card 4
function getCardWithUsers (userInfo) {
  const doc = new Document();

  const card = doc
    .applicationCard("Users!", "Users! \n Users add avatar piles at the bottom right to give context to an application card.") //2nd parameter is a fallback text version of the message
    .description("Users add avatar piles at the bottom right to give context to an application card. ");
  card.context("Stride API Hello World Option #4 - Card 4").icon({
    url:
      "https://cdn.glitch.com/743df685-0959-475b-8abb-394f391411b8%2F34-20e3.png?1530113791953",
    label: "4️⃣"
  }); //[4] Icon

  card
    .detail()
    .title("Users title")
    .text("users text")
    .user({id:userInfo.id,icon:{url:getPrimaryUserImage(userInfo),label:userInfo.displayName}})
    .user({icon:{url:"https://cdn.glitch.com/743df685-0959-475b-8abb-394f391411b8%2FSimplified%20Meeples-Aliza%402x.png?1530123653592",label:"Aliza"}})
    .user({icon:{url:"https://cdn.glitch.com/743df685-0959-475b-8abb-394f391411b8%2FSimplified%20Meeples-Arjun.png?1530123664458",label:"Arjun"}})
    .user({icon:{url:"https://cdn.glitch.com/743df685-0959-475b-8abb-394f391411b8%2FSimplified%20Meeples-Narul.png?1530123679768",label:"Narul"}})
    .user({icon:{url:"https://cdn.glitch.com/743df685-0959-475b-8abb-394f391411b8%2FSimplified%20Meeples-Norah%402x.png?1530125659966",label:"Norah"}})
    .user({icon:{url:"https://cdn.glitch.com/743df685-0959-475b-8abb-394f391411b8%2FSimplified%20Meeples-Tori.png?1530123684310",label:"Tori"}});
  return doc.toJSON();
}

//Card 5
function getCardWithPreview() {
  const doc = new Document();

  const card = doc
    .applicationCard("Preview Cards!", "Preview Cards! \n Preview cards are great for showing what a linked resource looks like.") //2nd parameter is a fallback text version of the message
    .description("Preview cards can show what a linked resource looks like.");
  card.context("Stride API Hello World Option #4 - Card 5").icon({
    url:"https://cdn.glitch.com/743df685-0959-475b-8abb-394f391411b8%2F35-20e3.png?1530113791758",
    label: "5️⃣"
  }); //[5] Icon

  card
    .link("https://marketplace.atlassian.com/addons/app/stride") //Stride App Marketplace
    .preview("https://cdn.glitch.com/743df685-0959-475b-8abb-394f391411b8%2FApps%402x.png?1530126438298");

  card
    .detail()
    .title("And")
    .text("can")
    .lozenge({ text: "still", appearance: "removed" });
  card.detail()
    .title("show")
    .icon({url:"https://cdn.glitch.com/743df685-0959-475b-8abb-394f391411b8%2F1f600.png?1530114407541", label:"Happy"})
    .text("details!");
  card
    .detail()
    .title("high")
    .badge({value:5, appearance:"important"});

  card.detail().user({icon:{url:"https://cdn.glitch.com/743df685-0959-475b-8abb-394f391411b8%2FSimplified%20Meeples-Aliza%402x.png?1530123653592",label:"Aliza"}})

  return doc.toJSON();
}

//Card 6
function getCardWithActions() {
  const doc = new Document();

  const card = doc
    .applicationCard("Cards with actions!", "Cards with actions! \n Cards support buttons that perform actions.") //2nd parameter is a fallback text version of the message
    .description("Cards support buttons that perform actions.");
  card.context("Stride API Hello World Option #4 - Card 6").icon({
    url:"https://cdn.glitch.com/743df685-0959-475b-8abb-394f391411b8%2F36-20e3.png?1530113792033",
    label: "6️⃣"
  }); //[6] Icon

  card
    .link("https://developer.atlassian.com/cloud/stride/learning/actions/"); //Stride Actions documentation

  card
    .action()
    .title("Show Help")
    .target({key:"actionTarget-cardActions"})
    .parameters({operation:"help"});
  card
    .action()
    .title("Hello 🌎")
    .target({key:"actionTarget-cardActions"})
    .parameters({operation:"1"});

  card
    .detail()
    .title("*Note*")
    .text("Watch for a return message when you click a button");

  return doc.toJSON();
}

//Card 7
function getPreviewCardWithActions() {
  const doc = new Document();

  const card = doc
    .applicationCard("Preview Cards with Actions!", "Preview Cards with actions! \n Cards support buttons that perform actions.") //2nd parameter is a fallback text version of the message
    .description("Cards support buttons that perform actions.");

  card
    .context("Stride API Hello World Option #4 - Card 7")
    .icon(
      {
        url:"https://cdn.glitch.com/743df685-0959-475b-8abb-394f391411b8%2F37-20e3.png?1530113792274",
        label: "7️⃣"
      }); //[7] Icon

  card
    .action()
    .title("Show Help")
    .target({key:"actionTarget-cardActions"})
    .parameters({operation:"help"});
  card
    .action()
    .title("Hello 🌎")
    .target({key:"actionTarget-cardActions"})
    .parameters({operation:"1"});

  card
    .link("https://marketplace.atlassian.com/addons/app/stride") //Stride Actions Documentation
    .preview("https://cdn.glitch.com/743df685-0959-475b-8abb-394f391411b8%2FSoftware%20Development_1%402x.png?1530130850214");

  card
    .detail()
    .title("*Note*")
    .text("Watch for a return message when you click a button");

  return doc.toJSON();
}

module.exports = async function(cloudId, conversationId, senderId, successHandler, errorHandler) {
  //Get user info for sender
  let userInfo = stride.api.users.get(cloudId, senderId);

  //send cards to the conversation

  //Card 1
  let opts = { body: getCardWithLozenges() };
  await stride.api.messages.sendMessage(cloudId, conversationId, opts)
    .then(successHandler,errorHandler);
  //Card 2
  opts.body = getCardWithBadges();
  await stride.api.messages.sendMessage(cloudId, conversationId, opts)
    .then(successHandler,errorHandler);
  //Card 3
  opts.body = getCardWithIcons();
  await stride.api.messages.sendMessage(cloudId, conversationId, opts)
    .then(successHandler,errorHandler);
  //Card 4
  opts.body = getCardWithUsers(await userInfo);
  await stride.api.messages.sendMessage(cloudId, conversationId, opts)
    .then(successHandler,errorHandler);
  //Card 5
  opts.body = getCardWithPreview();
  await stride.api.messages.sendMessage(cloudId, conversationId, opts)
    .then(successHandler,errorHandler);
  //Card 6
  opts.body = getCardWithActions();
  await stride.api.messages.sendMessage(cloudId, conversationId, opts)
    .then(successHandler,errorHandler);
  //Card 7
  opts.body = getPreviewCardWithActions();
  await stride.api.messages.sendMessage(cloudId, conversationId, opts)
    .then(successHandler,errorHandler);


};
