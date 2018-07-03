Hello World Bot for Stride API
=================

This tutorial will teach you the basics of developing apps for Stride using Node.js by looking at an introductory hello world app.

Follow instructions on this page to build a simple Stride app.

## Remix this project

<a href="https://glitch.com/edit/#!/remix/hello-world-stride" dynamic-url="https://glitch.com/edit/#!/remix/{{glitch_project_name}}"><img src="https://cdn.glitch.com/2703baf2-b643-4da7-ab91-7ee2a2d00b5b%2Fremix-button.svg" alt="Remix on Glitch" /></a>

<a href="https://glitch.com/edit/#!/hello-world-stride" dynamic-url="https://glitch.com/edit/#!/{{glitch_project_name}}">View Code</a>


## Create an app

The app you will build in this tutorial contains a simple [bot](https://developer.atlassian.com/cloud/stride/learning/bots) that responds to direct messages or mentions of its bot name. To work with the Stride API you will need to create a app at [developer.atlassian.com](https://developer.atlassian.com/apps/). 

To create your first Stride app:

1. Open the <a href="https://developer.atlassian.com/apps/create" target="_blank">Create an App</a> page.
1. Give your new app a name in the **App name** field.
1. If desired, add a short description in the **Description** field.
1. Click **Create**; you'll be directed to your app's dashboard page.
1. Click **Enable API** for the Stride API.
1. Use the Copy button on the **Enabled APIs** tab to copy the **Client Id** and the **Client Secret** for use below as the `{clientId}` and `{clientSecret}`.
1. In your glitch app put your client ID and client secret in the `.env` file. You can safely store app secrets in `.env` (nobody can see this but you and people you invite)

### Link the app descriptor

The [app descriptor](https://developer.atlassian.com/cloud/stride/blocks/app-descriptor) for the hello world for stride app is hosted at [/descriptor](/descriptor). You have to link it to your app in the app configuration page where you created your app earlier.

To link the app descriptor to your app:

1. Navigate to your <a href="https://developer.atlassian.com/apps" target="_blank">My Apps</a> page.
1. Click to open the app and then click the **Install** tab.
1. Enter your app descriptor URL, `https://{{glitch_project_name}}.glitch.me/descriptor`, in the **Descriptor URL** field.
1. Click **Refresh**. When the app descriptor is installed you will see a *The descriptor has been updated successfully!* message displayed.

## Install the app

Now your app is created and configured, and your app descriptor is linked, and you can add the app to a conversation:

<div id="InstallButton"></div>

## Install the app through the user interface

1. In your app dashboard, in the **Install** tab, click **Copy** for the **Installation URL**.
1. Open Stride.
1. Open the conversation in which you'd like to install the app.
1. Click ![apps_icon](https://developer.atlassian.com/cloud/stride/images/apps_icon.png) to open the **Apps** sidebar, and then click the **+** button to open the Atlassian Marketplace in Stride.
1. Click **Connect your app** in the **Connect your own app** box, and then select the **Installation URL** tab.
1. Paste in the **Installation URL**. Your app information should appear in the window.
1. Click **Agree**.

In a few seconds, your newly-installed app should appear in the **Apps** sidebar, and the app should send a message to the conversation.

## Test the app

Your app is ready to roll, so let's see it in action.

When the bot is installed it will give you a simple menu for possible actions:


Stride API Hello World Menu
------------------------------
@ mention or direct message this bot with one of these commands:

* `1` - Hello World
* `2` - Sending Markdown
* `3` - Mentioning Users
* `4` - Application Cards
* `help` - Show this help menu  

Inspect all the messages in Stride with the [Developer Toolkit](https://developer.atlassian.com/cloud/stride/developer-toolkit/).


## Next steps

* Take a look at the files in the skills folder. Each one corresponds to a menu option. 
* Change things up. Try changing the messages sent by the app!
* Inspect the messages using the [Developer Toolkit](https://developer.atlassian.com/cloud/stride/developer-toolkit/)
* Read through our **Learning** section, which has more [tutorials](https://developer.atlassian.com/cloud/stride/tutorials) and explains different concepts
 including [sites and users](https://developer.atlassian.com/cloud/stride/learning/sites-users), [conversations](https://developer.atlassian.com/cloud/stride/learning/conversations), 
 [messages](https://developer.atlassian.com/cloud/stride/learning/messages), [bots](/cloud/stride/learning/bots), and more.
* Take a look at our fully featured [Reference App](https://developer.atlassian.com/cloud/stride/reference-app). The reference app has quite a bit more functionality built in, and is really a showcase of what you can do with the API in Stride.


## Explore our other glitch projects

<a href="https://glitch.com/stride">Stride on Glitch</a>
<iframe src="https://glitch.com/stride" style="width:100%; height:600px"></iframe>

_emoji's provided by [twemoji](https://twemoji.twitter.com/)_