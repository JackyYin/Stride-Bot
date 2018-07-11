const express = require("express");
const router = express.Router({ mergeParams: true });
const auth = require("./auth")(process.env.CLIENT_SECRET);

/**
 *  @name Lifecycle: app descriptor
 *  @see {@link https://developer.atlassian.com/cloud/stride/blocks/app-descriptor/ | Descriptor Requests }
 *  @see {@link https://developer.atlassian.com/cloud/stride/blocks/app-lifecycle/ | Lifecycle Events }
 *  @description
 *
 *  The app descriptor is a JSON file that describes how Stride should communicate with the app.
 *  The descriptor includes general information for the app, as well as the modules that the app wants to use.
 *  The app descriptor serves as the glue between the app and Stride. When a user installs an app,
 *  what they are really doing is installing this descriptor file.
 *
 *  Stride needs to be able to retrieve this from your app server.
 **/
router.get("/descriptor", function(req, res) {
  res.json({
    baseUrl: `https://${req.headers.host}`,
    key: "checkin",
    lifecycle: {
      installed: "/installed",
      uninstalled: "/uninstalled"
    },
    modules: {
      "chat:bot": [
        {
          key: "bot-1",
          mention: {
            url: "/mentions"
          },
          directMessage: {
            url: "/mentions"
          }
        }
      ],
      "chat:dialog": [
        {
          key: 'dialog-leaveChart',
          title: {
            value: 'Leave Chart Dialog',
          },
          options: {
            size: {
              width: '500px',
              height: '500px',
            },
            primaryAction: {
              key: 'dialogAction-sendForm',
              name: {
                value: 'Send',
              },
            },
            secondaryActions: [
              {
                key: 'dialogAction-closeDialog',
                name: {
                  value: 'Close',
                },
              },
            ],
          },
          url: '/dialogs/dialog/leaveChart',
          authentication: 'jwt',
        },
      ],
      "chat:glance": [
        {
          key: 'glance-leaveChart',
          name: {
            value: 'Leave Chart',
          },
          icon: {
            url: '/public/img/logo.png',
            'url@2x': '/public/img/logo.png',
          },
          target: 'actionTarget-sendToDialog-leaveChart',
          queryUrl: '/glances/glance/leaveChart/state',
          authentication: 'jwt',
        }
      ],
      "chat:actionTarget":[
        {
          "key": "actionTarget-cardActions",
          "callService": {
            "url": "/cardActions"
          },
          "parameters": {
            "easter": "egg"
          }
        },
        {
          key: 'actionTarget-sendToDialog-leaveChart',
          openDialog: {
            key: 'dialog-leaveChart',
          },
        },
      ]
    }
  });
});

/**
 *  @name Lifecycle: installation events
 *  @see {@link https://developer.atlassian.com/cloud/stride/blocks/app-lifecycle/ | Installation Events }
 *  @description
 *
 *  In order to be granted access to a conversation (for instance, to send messages) an app must be installed by a user in the conversation.
 *  Your app can be notified whenever a user installs or uninstalls it in a conversation. Stride makes a POST
 *  request that will be made to the lifecycle URL defined in the app descriptor.
 **/
router.post("/installed", auth, async (req, res, next) => {
  res.sendStatus(204);
  let context = {
    cloudId: req.body.cloudId,
    userId: req.body.userId,
    conversationId: req.body.resourceId
  };
  await require("../skills/helpMenu")(
    context.cloudId,
    context.conversationId
  ).catch(err => {
    console.error(`error sending message on install: ${err}`);
  });
  console.log(
    `installed:
     cloudId:\t${context.cloudId}
     conversationId:\t${context.conversationId}`
  );
});

/**
 *  @name Lifecycle: installation events
 *  @see {@link https://developer.atlassian.com/cloud/stride/blocks/app-lifecycle/ | Installation Events }
 *  @description
 *
 *  Apps can be uninstalled by a user. This is the even where your app will be notified of an uninstall.
 **/
router.post("/uninstalled", auth, async (req, res, next) => {
  res.sendStatus(204);
  let context = {
    cloudId: req.body.cloudId,
    userId: req.body.userId,
    conversationId: req.body.resourceId
  };
  console.log(
    `uninstalled:
     cloudId:${context.cloudId}
     conversationId:\t${context.conversationId}`
  );
});

module.exports = router;
