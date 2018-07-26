var speakeasy = require ('speakeasy');

var secret = speakeasy.generateSecret({length:20})
/*
Example generatedSecret
{ ascii: 'y5g!pk}[pa(Rbh2RX4:k',
  hex: '79356721706b7d5b706128526268325258343a6b',
  base32: 'PE2WOILQNN6VW4DBFBJGE2BSKJMDIOTL',
  otpauth_url: 'otpauth://totp/SecretKey?secret=PE2WOILQNN6VW4DBFBJGE2BSKJMDIOTL' }
*/
