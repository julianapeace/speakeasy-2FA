var express = require ('express')
var app = express()
var fs = require('fs')
var axios = require ('axios')
const body_parser = require('body-parser');
const importEnv = require('import-env');
const port = process.env.PORT || 8000;

var speakeasy = require ('speakeasy');

var secret = speakeasy.generateSecret({length:20})
/*
Example generatedSecret
{ ascii: 'y5g!pk}[pa(Rbh2RX4:k',
  hex: '79356721706b7d5b706128526268325258343a6b',
  base32: 'PE2WOILQNN6VW4DBFBJGE2BSKJMDIOTL',
  otpauth_url: 'otpauth://totp/SecretKey?secret=PE2WOILQNN6VW4DBFBJGE2BSKJMDIOTL' }
*/

var promise = require('bluebird');
var pgp = require('pg-promise')({
  promiseLib: promise
});

var DATABASE_URL = "postgres://127.0.0.1:5432/speakeasy_2fa";
var db = pgp(DATABASE_URL);

db.none('INSERT INTO secrets(secret)' + 'VALUES($1)', secret.base32)
  .then(success =>{
    console.log('Inserted one secret: ', secret.base32)
  })
  .catch(err =>{
    console.log(err)
  })

var QRCode = require('qrcode');

app.use(body_parser.urlencoded({extended: false}));
app.set('view engine', 'hbs');
app.use(express.static('public'));


app.get('/', function(req, res) {
  QRCode.toDataURL(secret.otpauth_url, function (err, url) {
    if (err) throw err
    response = url
    res.render('index.hbs', { 'response':response });
  })
});


app.get('/authenticator', function(req, res) {
  res.render('authenticator.hbs', { 'response': response });
})


app.post('/code', function(req, res) {
  db.any('SELECT * FROM secrets ORDER BY ID DESC LIMIT 1')
    .then(result => {
      console.log('Latest Secret: ', result[0].secret)
      var secret = result[0].secret
      var token = speakeasy.totp({
        secret: secret,
        encoding: 'base32'
      });
      console.log('Token: ', token)
      console.log('Code Submitted', req.body.code)
      if (req.body.code == token) {
        console.log('Authenticated!!!')
        // var string = encodeURIComponent('something that would break');
        response = "Authenticated!!!"
        res.render('entry.hbs', { 'response': response });
      } else {
        console.log('Authentication failed')
        response = "Authentication Failed"
        res.render('entry.hbs', { 'response': response });
      }
    })
    .catch(err =>{
      console.log(err)
    })
})


app.listen(port, function(){
  console.log( 'listening on port ' + port )
});
