require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

var count=0;
var slurl=[];
app.post('/api/shorturl', (req,res)=>{
  let reg = /https*:\/\//;
  const myURL = new URL(req.body.url);
  console.log(myURL);
dns.lookup(myURL.hostname, (err, address, family)=>{
  if(err||!(myURL.protocol=="https:"||myURL.protocol=="http:")){
    res.json({"error":"Invalid URL"})
  }else {
    ++count;
    let x = {original_url:req.body.url, short_url:count};
    slurl.push(x);
    res.json(x);
    console.log(slurl);
  }})
})
app.get('/api/shorturl/:mew', (req,res)=>{
  let foundurl = slurl.find((x)=> x.short_url==req.params.mew);
  console.log(foundurl);
  if(foundurl){
  res.redirect(foundurl.original_url.toString());
  } else {
    res.json({"error":"Invalid URL"})
  }
})
