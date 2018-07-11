const express = require('express');
const router = express.Router({mergeParams:true});
const cors = require('cors');

const stride = require('../client');
/**
 * @name Glances
 * @description
 * This adds a glance to the sidebar. When the user clicks on it, Stride opens the module whose key is specified in "target".
 * @see {@link https://developer.atlassian.com/cloud/stride/apis/jsapi/about-javascript-api/ | API Reference: Glances-Sidebars }
 * @see {@link https://developer.atlassian.com/cloud/stride/learning/glances-sidebars/ | Concept Guide }
 * @see {@link https://developer.atlassian.com/cloud/stride/learning/adding-glances/ | How-to Guide }
 * Glances are declared in the app descriptor. You can configure multiple glances in a single app descriptor.
 * When a user clicks a glance Stride opens up a target sidebar, as a chat:sidebar or chat:dialog, for the app.
 * When a user first opens a Stride conversation where the app is installed, the Stride app makes a REST call to the queryURL to get the initial value for the glance.
 * You can then update the glance for a conversation at any time by making a REST call to Stride.
 * Stride will then make sure glances are updated for all connected Stride users.
 *
 * descriptor.json setup
 * ``` "chat:glance": [
 * {
 *   "key": "glance-showcase",
 *  "name": {
 *     "value": "App Glance"
 *   },
 *   "icon": {
 *     "url": "/icon.png",
 *     "url@2x": "/icon.png"
 *   },
 *   "target": "sidebar-showcase",
 *   "queryUrl": "/glances/glance/showcase/state"
 * }
 * ]
 * ```
 *
 **/
router.get('/glance/leaveChart/state', cors(), (req, res) => {
  console.log("glnace leaveChart state");
  res.send(JSON.stringify({ label: { value: 'Leave Chart Form' } }));
});

router.post('/updateGlanceState', async (req, res, next) => {
  const { cloudId, conversationId } = res.locals.context;

  try {
    //update the glance
    var glanceKey = 'glance-showcase';
    let optsDoc = {
      body: {
        label: 'API showcase - glance updated!',
        metadata: {},
      },
    };
    await stride.api.modules.updateGlanceState(cloudId, conversationId, glanceKey, optsDoc);

    // then send a confirmation message in the room

    let optsDoc2 = {
      body: 'The glance state was updated',
      headers: { 'Content-Type': 'text/plain', accept: 'application/json' },
    };

    await stride.api.messages.sendMessage(cloudId, conversationId, optsDoc2);

    res.sendStatus(204);
  } catch (err) {
    res.sendStatus(500);
    next(err);
  }
});

module.exports = router;
