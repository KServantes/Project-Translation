var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('cards.cdb');
const download = require('image-downloader');
var check;
var urlExists = require('url-exists');
 
urlExists('https://raw.githubusercontent.com/moecube/ygopro-images/master/pics/10000000.jpg', function(err, exists) {
  console.log('obelisco');
  console.log(exists); // true 
});
 
urlExists('https://raw.githubusercontent.com/moecube/ygopro-images/master/pics/10.jpg', function(err, exists) {
  console.log('no hay nada');
  console.log(exists); // false 
});