const express = require('express')
const bodyParser = require('body-parser')
const app = express();
const port = process.env.PORT || 5000;
const line = require('@line/bot-sdk');

const MongoClient = require('mongodb').MongoClient
const assert = require('assert');
// Connection URL
const dbUrl = 'mongodb://user02:user02@ds157834.mlab.com:57834/smartqr';
// Database Name
const dbName = 'smartqr';

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

    console.log(`[type] ==> ${type}`);
    console.log(`[replyToken] ==> ${replyToken}`);
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
          let command = text.split(' ')[0] || ''
          let name = text.split(' ')[1] || ''
          let messageResponse = {
            type: 'text',
            text: `ไม่พบข้อมูล`
          }
          console.log(`text: ${text}`);
          console.log(`command: ${command}`);
          console.log(`name: ${name}`);
          
          if((!text || !name) && (command != 'help') ) {
            replyMessage(replyToken, messageResponse)
          } else {
            findItem(name, (res) => {
              let result = res[0];
              switch (command.toLowerCase()) {
                case 'img':
                case 'image':
                  messageResponse = {
                    type: "image",
                    originalContentUrl: result.imgUrl,
                    previewImageUrl: result.imgUrl
                  }
                  break;
                case 'fb':
                case 'facebook':
                  messageResponse = {
                    type: 'text',
                    text: `Facebook's ${name} are ${result.facebook}`
                  }
                  break;
                case 'age':
                  messageResponse = {
                    type: 'text',
                    text: `${name} are ${result.age} years old.`
                  }
                  break;
                case 'help':
                  messageResponse = {
                    type: 'text',
                    text: `ท่านสามารถใช้คำสั่ง เหล่านี้ได้\n\n- img <name>\n- fb <name>\n- age <name>`
                  }
                  break;
                default:
                  messageResponse = [
                    // {
                    //   type: 'text',
                    //   text: `ขอโทษ :( ไม่รู้จักคำสั่ง ${command}`
                    // },
                    {
                      type: "sticker",
                      packageId: "149",
                      stickerId: "2"
                    }
                  ]
                  break;
              }
              replyMessage(replyToken, messageResponse)
            })
          }
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

const insertDocuments = function(db, callback) {
  // Get the documents collection
  const collection = db.collection('users');
  // Insert some documents
  collection.insertMany([
    {
      name : 'Nottdev',
      age: 24,
      facebook: 'Siriphon Panyathipo',
      imgUrl: 'https://scontent.fbkk9-2.fna.fbcdn.net/v/t1.0-9/17457928_1659726007655883_7886800315195540494_n.jpg?_nc_cat=109&_nc_eui2=AeEPAEmC0qe9blIvQabDb0XO6YlmsMsVmyUvmh8pUKKcRkH17YP97GElL9swPUXL3j_LK6z5XD7CAWEP5k2VwANgfQKWWGkjN9KduO_e67yDXA&_nc_ht=scontent.fbkk9-2.fna&oh=2e062822cddc626a92387558a955bfb5&oe=5CC9D07E'
    },
    {
      name : 'Moss',
      age: 32,
      facebook: 'Moss Witsanu',
      imgUrl: 'https://scontent.fbkk12-3.fna.fbcdn.net/v/t1.0-9/29571134_1645809525510438_2293228680666824482_n.jpg?_nc_cat=110&_nc_eui2=AeHyf0saTT8lpDrdX0_fwMe430aG24RgZfRKrvdriKm9BOXOxZrYTyHy5w0oTVEG3jpo0yE2PGrJaP_nHSwlulwgFBHsAMWaCvPqLgw0tAeXtg&_nc_ht=scontent.fbkk12-3.fna&oh=ecb30aec5b7fb546f53d8e9c03d521b3&oe=5CBB8B59'
    },
    {
      name : 'Jojo',
      age: 50,
      facebook: 'kidsada makthrapsukho',
      imgUrl: 'https://scontent.fbkk12-1.fna.fbcdn.net/v/t1.0-9/50434618_2029720283786025_217569419579097088_o.jpg?_nc_cat=106&_nc_eui2=AeG3k0IfbLQIbWXIBOYKPb70m8rz4s0CFHyE_BQOrn5Hx48E2C_57i5Rr2kalcZ5ZKh9r-2-cBRUm4MEJYVV02yKNX-aQI4YOj8lP-SoeC5FGQ&_nc_ht=scontent.fbkk12-1.fna&oh=e71a43f918c48b6487a291ee953a7a62&oe=5CC8CBE1'
    },
    {
      name : 'Gna',
      age: 25,
      facebook: 'Ganee Geena',
      imgUrl: 'https://scontent.fbkk12-1.fna.fbcdn.net/v/t1.0-9/49603490_2123424297713598_2333824815636414464_o.jpg?_nc_cat=101&_nc_eui2=AeGS-Jbyv0bfK_q4jTjNjBEOLFXOStu3tUz04rGPgwL-K9vxPb_HDCtCDZR6m133aSJ9UFNMMrhKImyCY1fuPLq0zoLYNBIdax1rmTPh9KkxEw&_nc_ht=scontent.fbkk12-1.fna&oh=e39624b343f7361d2251257796059f8c&oe=5CC16052'
    },
    {
      name : 'Bee',
      age: 18,
      facebook: 'beesie sasipa',
      imgUrl: 'https://scontent.fbkk8-2.fna.fbcdn.net/v/t1.0-9/50234250_1269253893230895_5072265018326646784_o.jpg?_nc_cat=107&_nc_eui2=AeHoLFLm0XZuLm3MEFP_krfkuJuCHYec1piJye-v8H8jxtqtIZXJAEg4-b6zw74qYlczipEAoQswCc7i21o11L2d_9SRRv6MqydSyiG8ftAsGg&_nc_ht=scontent.fbkk8-2.fna&oh=c88f82422d1878c89d75635632dd17e2&oe=5CBE95E2'
    },
    {
      name : `Q`,
      age: 18,
      facebook: 'beesie sasipa',
      imgUrl: 'https://scontent.fbkk8-3.fna.fbcdn.net/v/t1.0-9/11225389_1075174129200326_353947681497853547_n.jpg?_nc_cat=111&_nc_eui2=AeGfTRD9anaUyD_s6GTSiYxvstv2CpbEcrS25U3uZvW9LyULj4aGFJ69WN9x3VBiJAXZFHQJTkXI-ZWXmfmUL1rg_uzdYxXvBZPS796cyOKyaA&_nc_ht=scontent.fbkk8-3.fna&oh=5d11391094a605ee4adecbd730b5042d&oe=5CB8C5A9'
    }
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(6, result.result.n);
    assert.equal(6, result.ops.length);
    console.log("Inserted 5 documents into the collection");
    callback(result);
  });
}

const findItem = (value, callback) => {
  MongoClient.connect(dbUrl,  (err, client) => {
    assert.equal(null, err);
    var db = client.db(dbName)
    const collection = db.collection('users');
    collection.find({name: value}).toArray( (err, result) => {
      if (err) throw err
      console.log("Connected successfully to server");
      console.log(result)
      callback(result);
    })
  })
}

app.listen(port,() => {
  console.log(`Listening on port ${port}`);
});