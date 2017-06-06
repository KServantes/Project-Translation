var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('cards.cdb');
var check;
db.serialize(function() {

  db.run("CREATE TABLE if not exists cartas(id TEXT PRIMARY KEY, english_name TEXT, spanish_name TEXT, jap_name TEXT, card_type TEXT, attribute TEXT, type TEXT, level TEXT, rank TEXT, pendulum_scale TEXT, property TEXT, link_markers TEXT, atk_def_link TEXT, card_description_me TEXT, card_description_pe TEXT, url TEXT, image_url TEXT, set_card TEXT)");
  
  db.each("SELECT id, name FROM texts LIMIT 0,10 ", function(err, row) {
  
  /*console.log(row.id + " " + row.name);*/
      
request("http://yugioh.wikia.com/wiki/" + row.name, function(error, response, body) {
  if(error) {
    console.log("Error: " + error);
  }
  console.log("Status code: " + response.statusCode);

  var $ = cheerio.load(body);
  
  $('tbody:has(th.cardtable-header)').each(function( index ) {
      
    /*$(this).find('tr > th.cardtable-header > span').text("");*/
    /*var english_name = $(this).find('tr > th.cardtable-header').text().trim();
	var spanish_name = $(this).find('tr.cardtablerow > td.cardtablerowdata > span[lang="es"]').text().trim();*/
	var jap_name = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > i:contains(rōmaji)) > td.cardtablerowdata').text().trim();
	var card_type = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Card type"]) > td.cardtablerowdata > a').text().trim();

    var property1 = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Property"]) > td.cardtablerowdata > a[title="Normal Trap Card"]').text().trim();
	var property2 = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Property"]) > td.cardtablerowdata > a[title="Continuous Trap Card"]').text().trim();
	var property3 = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Property"]) > td.cardtablerowdata > a[title="Counter Trap Card"]').text().trim();
    var property4 = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Property"]) > td.cardtablerowdata > a[title="Spell Card"]').text().trim();
	var property5 = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Property"]) > td.cardtablerowdata > a[title="Continuous Spell Card"]').text().trim();
	var property6 = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Property"]) > td.cardtablerowdata > a[title="Equip Spell Card"]').text().trim();
	var property7 = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Property"]) > td.cardtablerowdata > a[title="Quick-Play Spell Card"]').text().trim();
	var property8 = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Property"]) > td.cardtablerowdata > a[title="Field Spell Card"]').text().trim();
	var property9 = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Property"]) > td.cardtablerowdata > a[title="Ritual Spell Card"]').text().trim();
		
	var passcode = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Passcode"]) > td.cardtablerowdata > a').remove();
	/*var spanish_card_description1 = $(this).find('td.navbox-list > span[lang="es"]').first().text().trim();*/
	/*var spanish_card_description2 = $(this).find('td.cardtablespanrow:has(b:contains("Card descriptions")) > table.navbox.hlist > tbody > tr > td > span').text();*/
	/*var spanish_card_description3 = $(this).find('table.collapsible.autocollapse.navbox-inner').text().trim();*/
	var attribute = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Attribute"]) > td.cardtablerowdata > a').text().trim();
	var type = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Type"]) > td.cardtablerowdata').text().trim();
	
	var level0 = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Level"]) > td.cardtablerowdata > a[title="Level 0 Monster Cards"]').text().trim();
	var level1 = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Level"]) > td.cardtablerowdata > a[title="Level 1 Monster Cards"]').text().trim();
	var level2 = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Level"]) > td.cardtablerowdata > a[title="Level 2 Monster Cards"]').text().trim();
	var level3 = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Level"]) > td.cardtablerowdata > a[title="Level 3 Monster Cards"]').text().trim();
	var level4 = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Level"]) > td.cardtablerowdata > a[title="Level 4 Monster Cards"]').text().trim();
	var level5 = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Level"]) > td.cardtablerowdata > a[title="Level 5 Monster Cards"]').text().trim();
	var level6 = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Level"]) > td.cardtablerowdata > a[title="Level 6 Monster Cards"]').text().trim();
	var level7 = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Level"]) > td.cardtablerowdata > a[title="Level 7 Monster Cards"]').text().trim();
	var level8 = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Level"]) > td.cardtablerowdata > a[title="Level 8 Monster Cards"]').text().trim();
	var level9 = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Level"]) > td.cardtablerowdata > a[title="Level 9 Monster Cards"]').text().trim();
	var level10 = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Level"]) > td.cardtablerowdata > a[title="Level 10 Monster Cards"]').text().trim();
	var level11 = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Level"]) > td.cardtablerowdata > a[title="Level 11 Monster Cards"]').text().trim();
	var level12 = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Level"]) > td.cardtablerowdata > a[title="Level 12 Monster Cards"]').text().trim();
		
	var rank0 = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Rank"]) > td.cardtablerowdata > a[title="Rank 0 Monster Cards"]').text().trim();
	var rank1 = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Rank"]) > td.cardtablerowdata > a[title="Rank 1 Monster Cards"]').text().trim();
	var rank2 = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Rank"]) > td.cardtablerowdata > a[title="Rank 2 Monster Cards"]').text().trim();
	var rank3 = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Rank"]) > td.cardtablerowdata > a[title="Rank 3 Monster Cards"]').text().trim();
	var rank4 = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Rank"]) > td.cardtablerowdata > a[title="Rank 4 Monster Cards"]').text().trim();
	var rank5 = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Rank"]) > td.cardtablerowdata > a[title="Rank 5 Monster Cards"]').text().trim();
	var rank6 = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Rank"]) > td.cardtablerowdata > a[title="Rank 6 Monster Cards"]').text().trim();
	var rank7 = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Rank"]) > td.cardtablerowdata > a[title="Rank 7 Monster Cards"]').text().trim();
	var rank8 = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Rank"]) > td.cardtablerowdata > a[title="Rank 8 Monster Cards"]').text().trim();
	var rank9 = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Rank"]) > td.cardtablerowdata > a[title="Rank 9 Monster Cards"]').text().trim();
	var rank10 = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Rank"]) > td.cardtablerowdata > a[title="Rank 10 Monster Cards"]').text().trim();
	var rank11 = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Rank"]) > td.cardtablerowdata > a[title="Rank 11 Monster Cards"]').text().trim();
	var rank12 = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Rank"]) > td.cardtablerowdata > a[title="Rank 12 Monster Cards"]').text().trim();
		
	var pendulum_scale0 = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Pendulum Scale"]) > td.cardtablerowdata > a[title="Pendulum Scale 0 Monster Cards"]').text().trim();
	var pendulum_scale1 = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Pendulum Scale"]) > td.cardtablerowdata > a[title="Pendulum Scale 1 Monster Cards"]').text().trim();
	var pendulum_scale2 = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Pendulum Scale"]) > td.cardtablerowdata > a[title="Pendulum Scale 2 Monster Cards"]').text().trim();
	var pendulum_scale3 = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Pendulum Scale"]) > td.cardtablerowdata > a[title="Pendulum Scale 3 Monster Cards"]').text().trim();
	var pendulum_scale4 = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Pendulum Scale"]) > td.cardtablerowdata > a[title="Pendulum Scale 4 Monster Cards"]').text().trim();
	var pendulum_scale5 = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Pendulum Scale"]) > td.cardtablerowdata > a[title="Pendulum Scale 5 Monster Cards"]').text().trim();
	var pendulum_scale6 = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Pendulum Scale"]) > td.cardtablerowdata > a[title="Pendulum Scale 6 Monster Cards"]').text().trim();
	var pendulum_scale7 = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Pendulum Scale"]) > td.cardtablerowdata > a[title="Pendulum Scale 7 Monster Cards"]').text().trim();
	var pendulum_scale8 = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Pendulum Scale"]) > td.cardtablerowdata > a[title="Pendulum Scale 8 Monster Cards"]').text().trim();
	var pendulum_scale9 = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Pendulum Scale"]) > td.cardtablerowdata > a[title="Pendulum Scale 9 Monster Cards"]').text().trim();
	var pendulum_scale10 = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Pendulum Scale"]) > td.cardtablerowdata > a[title="Pendulum Scale 10 Monster Cards"]').text().trim();
	var pendulum_scale11 = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Pendulum Scale"]) > td.cardtablerowdata > a[title="Pendulum Scale 11 Monster Cards"]').text().trim();
	var pendulum_scale12 = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Pendulum Scale"]) > td.cardtablerowdata > a[title="Pendulum Scale 12 Monster Cards"]').text().trim();
	var pendulum_scale13 = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Pendulum Scale"]) > td.cardtablerowdata > a[title="Pendulum Scale 13 Monster Cards"]').text().trim();
		
	var link_markers = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Link Marker"]) > td.cardtablerowdata').text().trim();
	var atk_def_link = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="ATK"]) > td.cardtablerowdata').text().trim();
	var set_card = $(this).find('td > a.mw-redirect').first().text().trim();
    var stmt = db.prepare("INSERT into cartas(id, english_name, jap_name, card_type, attribute, type, level, rank, pendulum_scale, property, link_markers, atk_def_link, set_card) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
	stmt.run(row.id, row.name, jap_name, card_type, attribute, type, level0 + level1 + level2 + level3 + level4 + level5 + level6 + level7 + level8 + level9 + level10 + level11 + level12, rank0 + rank1 + rank2 + rank3 + rank4 + rank5 + rank6 + rank7 + rank8 + rank9 + rank10 + rank11 + rank12, pendulum_scale0 + pendulum_scale1 + pendulum_scale2 + pendulum_scale3 + pendulum_scale4 + pendulum_scale5 + pendulum_scale6 + pendulum_scale7 + pendulum_scale8 + pendulum_scale9 + pendulum_scale10 + pendulum_scale11 + pendulum_scale12 + pendulum_scale13, property1 + property2 + property3 + property4 + property5 + property6 + property7 + property8 + property9, link_markers, atk_def_link, set_card);
	
  });
  
/*$('td.cardtablespanrow:has(b:contains("Card descriptions"))').each(function( index ) {*/
  /*$(this).find('br').addClass('remover');*/
  /*$(this).find('.remove').replaceWith('*');*/
  /*$(this).find('br').replaceWith('(***)');
   
  var spanish_card_description = $(this).find('td.navbox-list > span[lang="es"]').text().trim();
  var spanish_card_description_pe = $(this).find('dl:has(span:contains("Efecto de Péndulo")) > dd > span').text().trim();
  var spanish_card_description_me = $(this).find('dl:has(span:contains("Efecto de Monstruo")) > dd > span').text().trim();
    
  fs.appendFile('cartas_es.sql', 
  
  spanish_card_description + "','" + 
  spanish_card_description_me + "','" + 
  spanish_card_description_pe + "'),");
    
  });*/
  /*hackernews.text( hackernews.text().replace(matcher, newText));*/
  /*fs.appendFile('cartas_es.sql', '\n', function(error) {
  if (error) {}
  });*/
  
  });
 });
});