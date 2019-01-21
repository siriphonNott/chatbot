const express = require('express')
const bodyParser = require('body-parser')
const app = express();
const port = process.env.PORT || 5000;
const line = require('@line/bot-sdk');

const client = new line.Client({
  channelAccessToken: 'X3lJ+f68IyxFIM0ZdbE39ZjN4cQBjQcpdo2JjmfFL14nR2xPwM+yhD4Pnm61q+3FN2e0XNez79ZHWvgLK+eqRjYCUqGRqjhQmOY+CQ/6Vv5ek/fyCIoPSCu3nwFkYNogCKSa7Vx0J1/uk4rPzL1SkAdB04t89/1O/w1cDnyilFU='
});
 
// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send({status: 'ok'});
});

app.post('/webhook', (req, res) => {
  console.log('==> /webhook');
  let body = req.body || ''; 
  console.log('==> Body ');
  console.log(body);

  if(req.body && body.events) {
    let events = body.events[0];
    let source = events.source;
    let message = events.message;
    let type = events.type;
    let replyToken = events.replyToken;

    console.log(`[type] ==>`);
    console.log(type);
    console.log(`[replyToken] ==>`);
    console.log(replyToken);
    console.log(`[source] ==>`);
    console.log(source);
    console.log(`[message] ==>`);
    console.log(message);

    switch (type) {
      case 'message':
        let type = message.type;
        console.log(`[message type] ==> ${type}`);
        let id = message.id;
        if(type == 'text') {
          let text = message.text;

          const messageResponse = [
            {
              type: 'text',
              text: `NottDev สวัสดีครับ มีอะไรหรอครับ? ก็มาดิครับ`
            },
            {
              type: "sticker",
              packageId: "51626496",
              stickerId: "11538"
            }
          ];
        
        replyMessage(replyToken, messageResponse)

        } else if(type == 'sticker') {
          let stickerId = message.stickerId;
          let packageId = message.packageId;
        }
        
        break;
      case 'follow':
        break;
      case 'unfollow':
        break;
      case 'join':
        break;
      case 'leave':
        break;
      default:
        break;
    }
  }

  let response = {
    status: 'ok',
    body: body
  }
  
  res.send(response);
});

//Method
const replyMessage = (replyToken, message) => {
  console.log('==> [replyMessage]');
  console.log(`==> replyToken: ${replyToken}`);
  console.log(`==> message: `);
  console.log(message);

  client.replyMessage(replyToken, message)
  .then(() => {
    console.log('replyMessage is successfully!');
  })
  .catch((err) => {
    console.log(err);
  });
}

app.listen(port,() => {
  console.log(`Listening on port ${port}`);
});