var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('cards.cdb');
var check;
db.serialize(function() {

  db.each("SELECT id, url FROM cartas", function(err, row) {
  
  /*console.log(row.url);*/
  
request(row.url, function(error, response, body) {
  if(error) {
    console.log("Error: " + error);
  }
  console.log("Status code: " + response.statusCode);

  var $ = cheerio.load(body);
  
  $('#WikiaArticle').each(function( index ) {
      /*#mw-content-text > div.infobox_border > div*/
	  $(this).find('br').replaceWith('(***)');
      /*var spanish_name = $(this).find('#mw-content-text > div.infobox_border > div > aside > section:nth-child(2) > div:nth-child(2) > div > div').first().text().trim();*/
	  var card_description_me = $(this).find('div.InfoboxDescripcion > div > div > div:nth-child(2) > p > i').first().text().trim();
	  var card_description_pe = $(this).find('div.InfoboxPendulo > div > div > div:nth-child(2) > p > i').first().text().trim();
      /*console.log(card_description_pe);
	  console.log(card_description_me);
	  console.log(row.id);*/
	  $(this).find('ul > li > span[style="vertical-align:sub"] > a').remove();
	  var set_card = $(this).find('ul > li > span[style="vertical-align:sub"]').first().text().trim().split("/");
	  var stmt = db.prepare("UPDATE cartas SET card_description_me = ?, card_description_pe = ?, set_card = ? WHERE id = ?;");
	  stmt.run(card_description_me, card_description_pe, set_card[0].substring(1).replace(/\s+/g, ''), row.id);
	  
  });
  });
 });
});