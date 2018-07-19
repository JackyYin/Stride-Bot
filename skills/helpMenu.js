//The Stride JS client library handles API authentication and calling REST endpoints from the Stride API
const Client = require("stride-node-client");
const { CLIENT_ID, CLIENT_SECRET } = process.env;
const stride = new Client({ CLIENT_ID, CLIENT_SECRET, NODE_ENV: "production" });

const message =
`
Checkin 使用者幫助手冊
------------------------------
安安你好 我是你最傲嬌的請假好朋友obi機器人🤖️～ 
要跟我對話請輸入下面的關鍵字唷，不然我不會理你的ㄌㄩㄝ～

第一次使用的捧油，請先輸入 \`@checkin\` \`auth\` + （你的email）： 來認證你的mail唷。

* \`@checkin\` \`giphy\`  +（你想要貼的醜圖關鍵字 ）： 你要的醜圖就會出現在對話窗咯～！

* \`@checkin\` \`annual\` ： 查看你還剩多少特休時數。

* \`@checkin\` \`chart\` ： 匯出你目前請假狀態的一柱擎天圖。
（你也可以從右方的 Leave chart form圖示調整查看期間）

更多功能敬請期待～～～

`;

module.exports = function ( cloudId, conversationId) {
  let opts = {
    body: message, //Markdown hello world
    headers: { "Content-Type": "text/markdown", accept: "application/json" }
  };

  //send response to the conversation
  return stride.api.messages.sendMessage(cloudId, conversationId, opts)
};