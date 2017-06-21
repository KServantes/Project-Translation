var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('cards.cdb');
var check;
db.serialize(function(){

  db.run("CREATE TABLE if not exists cartas(id TEXT PRIMARY KEY, english_name TEXT, spanish_name TEXT, jap_name TEXT, card_type TEXT, attribute TEXT, type TEXT, level TEXT, rank TEXT, pendulum_scale TEXT, property TEXT, link_markers TEXT, atk_def_link TEXT, card_description_me TEXT, card_description_pe TEXT, url TEXT, image_url TEXT, set_card TEXT, variants TEXT, bash TEXT,render TEXT)");
  
  
  db.each("SELECT id, name FROM texts WHERE id NOT IN (SELECT id FROM cartas) LIMIT 0,100", function(err, row) {
   
  /*console.log(row.id + " " + row.name);*/
        
request.get({ url: "http://yugioh.wikia.com/wiki/" + encodeURIComponent(row.name), timeout: 600000}, function(error, response, body) {
  if(error) {
    console.log("Error: " + error);
  }
  console.log("Status code: " + response.statusCode);
  console.log(row.id);
  
  var $ = cheerio.load(body);
  
  
  
  $('tbody:has(th.cardtable-header)').each(function( index ) {
      
    /*$(this).find('tr > th.cardtable-header > span').text("");*/
    /*var english_name = $(this).find('tr > th.cardtable-header').text().trim();
	var spanish_name = $(this).find('tr.cardtablerow > td.cardtablerowdata > span[lang="es"]').text().trim();*/
	
	var jap_name = $(this).find('tr.cardtablerow:has(th.cardtablerowheader:contains(base)) > td.cardtablerowdata > span[lang="ja"]').text().trim();
	
	if(jap_name == ""){
		jap_name = $(this).find('tr.cardtablerow:has(th.cardtablerowheader:contains(Japanese)) > td.cardtablerowdata > span[lang="ja"]').text().trim();
	};
	var card_type = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Card type"]) > td.cardtablerowdata > a').text().trim();

	
	var property_list = [
		['Normal Trap'],
		['Continuous Trap'],
		['Counter Trap'],
		['Normal Spell'],
		['Continuous Spell'],
		['Equip Spell'],
		['Quick-Play Spell'],
		['Field Spell'],
		['Ritual Spell']
	];
	var property = "";
	for(var i=0; i < property_list.length; i++){
		property += $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Property"]) > td.cardtablerowdata > a[title="' + property_list[i] + ' Card"]').text().trim();
	};
	
	var passcode = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Passcode"]) > td.cardtablerowdata > a').remove();
	/*var spanish_card_description1 = $(this).find('td.navbox-list > span[lang="es"]').first().text().trim();*/
	/*var spanish_card_description2 = $(this).find('td.cardtablespanrow:has(b:contains("Card descriptions")) > table.navbox.hlist > tbody > tr > td > span').text();*/
	/*var spanish_card_description3 = $(this).find('table.collapsible.autocollapse.navbox-inner').text().trim();*/
	var attribute = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Attribute"]) > td.cardtablerowdata > a').text().trim();
	var type = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Type"]) > td.cardtablerowdata').text().trim();
	
	var level = ""; 
	var rank = "";
	var pendulum_scale = "";
	
	for(var i=0; i<=13; i++){
		level += $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Level"]) > td.cardtablerowdata > a[title="Level ' + i + ' Monster Cards"]').text().trim();
		rank += $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Rank"]) > td.cardtablerowdata > a[title="Rank ' + i + ' Monster Cards"]').text().trim();
		pendulum_scale += $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Pendulum Scale"]) > td.cardtablerowdata > a[title="Pendulum Scale ' + i + ' Monster Cards"]').text().trim();
	};
	
	var link_markers = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="Link Marker"]) > td.cardtablerowdata').text().trim();
	var atk_def_link = $(this).find('tr.cardtablerow:has(th.cardtablerowheader > a[title="ATK"]) > td.cardtablerowdata').text().trim();
	var set_card = $(this).find('td > a.mw-redirect').first().text().trim();
	/*console.log(jap_name);*/
    var stmt = db.prepare("INSERT into cartas(id, english_name, jap_name, card_type, attribute, type, level, rank, pendulum_scale, property, link_markers, atk_def_link, set_card) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
	stmt.run(row.id, row.name, jap_name, card_type, attribute, type, level, rank, pendulum_scale, property, link_markers, atk_def_link, set_card);
	
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