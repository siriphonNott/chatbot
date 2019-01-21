const express = require('express')
const bodyParser = require('body-parser')
const app = express();
const port = process.env.PORT || 5000;

// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send({status: 'ok'});
});

app.post('/webhook', (req, res) => {
  console.log('==> /webhook');
  let body = req.body; 
  let events = body.events[0];
  let source = events.source;
  let message = events.message;
  console.log('==> Body ');
  console.log(body);
  console.log(`source ==> ${source}`);
  console.log(`message ==> ${message}`);

  let response = {
    status: 'ok',
    body: body
  }
  
  res.send(response);
});

app.listen(port,() => {
  console.log(`Listening on port ${port}`);
});