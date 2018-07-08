//The Stride JS client library handles API authentication and calling REST endpoints from the Stride API
const Client = require("stride-node-client");
const { CLIENT_ID, CLIENT_SECRET } = process.env;
const stride = new Client({ CLIENT_ID, CLIENT_SECRET, NODE_ENV: "production" });


module.exports = function ( cloudId, conversationId) {
  let opts = {
    body: "**_Obi 他媽智障！_**", //Markdown hello world
    headers: { "Content-Type": "text/markdown", accept: "application/json" }
  };
 var code = "{\r\n    \"type\": \"doc\",\r\n    \"content\": [ \r\n      {\r\n        \"type\": \"table\",\r\n        \"content\": [\r\n          {\r\n            \"type\": \"tableRow\",\r\n            \"content\": [\r\n              {\r\n                \"type\": \"tableHeader\",\r\n                \"attrs\":\r\n                  {\r\n                    \"colspan\":2,\r\n                    \"rowspan\":2\r\n                  }\r\n                ,\r\n                \"content\":[\r\n                  {\r\n                    \"type\": \"paragraph\",\r\n                    \"content\":[\r\n                      {\r\n                        \"type\": \"text\",\r\n                        \"text\": \"Table Header\"\r\n                      }\r\n                    ]\r\n                    \r\n                  }\r\n                ]\r\n              },\r\n              {\r\n                \"type\": \"tableHeader\",\r\n                \"attrs\":\r\n                  {\r\n                    \"colspan\":1,\r\n                    \"rowspan\":1\r\n                  }\r\n                ,\r\n                \"content\":[\r\n                  {\r\n                    \"type\": \"paragraph\",\r\n                    \"content\":[\r\n                      {\r\n                        \"type\": \"text\",\r\n                        \"text\": \"Table Header\"\r\n                      }\r\n                    ]\r\n                    \r\n                  }\r\n                ]\r\n              },\r\n{\r\n                \"type\": \"tableHeader\",\r\n                \"attrs\":\r\n                  {\r\n                    \"colspan\":1,\r\n                    \"rowspan\":1\r\n                  }\r\n                ,\r\n                \"content\":[\r\n                  {\r\n                    \"type\": \"paragraph\",\r\n                    \"content\":[\r\n                      {\r\n                        \"type\": \"text\",\r\n                        \"text\": \"Table Header\"\r\n                      }\r\n                    ]\r\n                    \r\n                  }\r\n                ]\r\n              }\r\n            ]\r\n          },\r\n          {\r\n            \"type\": \"tableRow\",\r\n            \"content\": [\r\n              {\r\n                \"type\": \"tableCell\",\r\n                \"attrs\":\r\n                  {\r\n                    \"colspan\":1,\r\n                    \"rowspan\":1,\r\n                    \"background\":\"blue\"\r\n                  }\r\n                ,\r\n                \"content\":[\r\n                  {\r\n                    \"type\": \"paragraph\",\r\n                    \"content\":[\r\n                      {\r\n                        \"type\": \"text\",\r\n                        \"text\": \"Cell 1\"\r\n                      }\r\n                    ]\r\n                    \r\n                  }\r\n                ]\r\n              },\r\n              {\r\n                \"type\": \"tableCell\",\r\n                \"attrs\":\r\n                  {\r\n                    \"colspan\":1,\r\n                    \"rowspan\":1,\r\n                    \"background\":\"#0000FF\"\r\n                  }\r\n                ,\r\n                \"content\":[\r\n                  {\r\n                    \"type\": \"paragraph\",\r\n                    \"content\":[\r\n                      {\r\n                        \"type\": \"text\",\r\n                        \"text\": \"Cell 2\"\r\n                      }\r\n                    ]\r\n                    \r\n                  }\r\n                ]\r\n              }\r\n            ]\r\n          }\r\n        ]\r\n      }\r\n    ],\r\n    \"version\": 1\r\n  }"
  var reply = {
    "type": "doc",
    "content": [ 
      {
        "type": "rule"
      },
      {
        "type": "heading",
        "attrs": {
          "level": 3
        },
        "content": [
          {
            "type": "text",
            "text": "Table Example:"
          }
        ]
      },
      {
        "type": "rule"
      },
      {
        "type": "table",
        "content": [
          {
            "type": "tableRow",
            "content": [
              {
                "type": "tableHeader",
                "attrs":
                  {
                    "colspan":2,
                    "rowspan":2
                  }
                ,
                "content":[
                  {
                    "type": "paragraph",
                    "content":[
                      {
                        "type": "text",
                        "text": "Table Header"
                      }
                    ]
                    
                  }
                ]
              },
              {
                "type": "tableHeader",
                "attrs":
                  {
                    "colspan":1,
                    "rowspan":1
                  }
                ,
                "content":[
                  {
                    "type": "paragraph",
                    "content":[
                      {
                        "type": "text",
                        "text": "Table Header"
                      }
                    ]
                    
                  }
                ]
              },
{
                "type": "tableHeader",
                "attrs":
                  {
                    "colspan":1,
                    "rowspan":1
                  }
                ,
                "content":[
                  {
                    "type": "paragraph",
                    "content":[
                      {
                        "type": "text",
                        "text": "Table Header"
                      }
                    ]
                    
                  }
                ]
              }
            ]
          },
          {
            "type": "tableRow",
            "content": [
              {
                "type": "tableCell",
                "attrs":
                  {
                    "colspan":1,
                    "rowspan":1,
                    "background":"blue"
                  }
                ,
                "content":[
                  {
                    "type": "paragraph",
                    "content":[
                      {
                        "type": "text",
                        "text": "Cell 1"
                      }
                    ]
                    
                  }
                ]
              },
              {
                "type": "tableCell",
                "attrs":
                  {
                    "colspan":1,
                    "rowspan":1,
                    "background":"#0000FF"
                  }
                ,
                "content":[
                  {
                    "type": "paragraph",
                    "content":[
                      {
                        "type": "text",
                        "text": "Cell 2"
                      }
                    ]
                    
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "type": "rule"
      },
      {
        "type": "paragraph",
        "content":[
          {
            "type": "text",
            "text": "Here is the JSON (ADF) code to build the example above. \nNOTE: Table is currently not supported by adf-builder."
          }
        ]
      },
      {
        "type": "codeBlock",
        "attrs": {
          "language": "javascript"
        },
        "content": [
          {
            "type": "text",
            "text": code
          }
        ]
      }
    ],
    "version": 1
  }
  //send response to the conversation
  return stride.api.messages.sendMessage(cloudId, conversationId, {body: reply})
};