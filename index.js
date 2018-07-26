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
