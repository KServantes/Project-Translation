var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('cards.cdb');
var check;

db.serialize(function() {

	db.each("SELECT id, english_name, jap_name, url FROM cartas WHERE card_description_me IS NULL AND url IS NOT NULL LIMIT 0,100", function(err, row) {
		
		var url2 = encodeURIComponent(row.url);
  
		request.get({ url: row.url , timeout: 600000}, function(error, response, body) {
			if(error) {
				console.log(row.id);
				console.log("Error: " + error);
			}
			console.log("Status code: " + response.statusCode);
			
			if(response.statusCode == "404"){
				var stmt = db.prepare("UPDATE cartas SET render = ? WHERE id = ?");
				stmt.run("not found", row.id);
			}
			
			console.log(row.url);
			var $ = cheerio.load(body);
  
			/*var stmt = db.prepare("UPDATE cartas SET bash = ?  WHERE id=?;");
			stmt.run(30, row.id);*/
  
			$('#WikiaArticle').each(function( index ) {
				/*#mw-content-text > div.infobox_border > div*/
				/*$(this).find('br').replaceWith('(***)');*/
				var spanish_name = $(this).find('#mw-content-text > div.infobox_border > div > aside > section:nth-child(2) > div:nth-child(2) > div > div').first().text().trim();
				var jap_name = $(this).find('#mw-content-text > div.infobox_border > div > aside > section:nth-child(2) > div:nth-child(4) > div > div:nth-child(1)').first().text().trim();
								
				$(this).find('div.InfoboxDescripcion > div > div > div:nth-child(2) > p > i > br').replaceWith('\n');				
				var card_description_me = $(this).find('div.InfoboxDescripcion > div > div > div:nth-child(2) > p > i').first().text().trim();
				$(this).find('div.InfoboxPendulo > div > div > div:nth-child(2) > p > i > br').replaceWith('\n');	
				var card_description_pe = $(this).find('div.InfoboxPendulo > div > div > div:nth-child(2) > p > i').first().text().trim();
				
				/*console.log(card_description_pe);
				console.log(card_description_me);
				console.log(row.id);*/
				
				$(this).find('ul > li > span[style="vertical-align:sub"] > a').remove();
				var set_card = $(this).find('ul > li > span[style="vertical-align:sub"]').first().text().trim().split("/"); 
				set_card = set_card[0].substring(1).replace(/\s+/g,'').replace(')','');

				if(!set_card){
					$(this).find('#mw-content-text > ul:nth-child(8) > li > i > b').remove();
					set_card = $(this).find('#mw-content-text > ul:nth-child(8) > li > i').first().text().trim();
				}
				
				if(!set_card){
					set_card = $(this).find('#mw-content-text > ul:nth-child(7) > li > i').first().text().trim();
				}
				
				var english_name = $(this).find('#mw-content-text > div.infobox_border > div > aside > section:nth-child(2) > div:nth-child(3) > div > div > p > a > span').text().trim();
				
				/*var passcode = $(this).find('#mw-content-text > div.infobox_border > div > aside > section:nth-child(3) > div:nth-child(3) > div > div').text().trim();*/
				
				function save_name (){
					/*console.log(set_card);*/
					stmt = db.prepare("UPDATE cartas SET spanish_name = ?, card_description_me = ?, card_description_pe = ?, set_card = ? WHERE id = ?;");
					stmt.run(spanish_name, card_description_me, card_description_pe, set_card, row.id);
					
					/*stmt = db.prepare("UPDATE cartas SET spanish_name = ?, card_description_me = ?, card_description_pe = ?, render = ? WHERE id = ?");
					stmt.run(spanish_name, card_description_me, card_description_pe, 500, row.id);*/
					
				};
				
				function delete_name (){
						/*stmt = db.prepare("UPDATE cartas SET spanish_name = ? WHERE id = ?;");
						stmt.run('', row.id);*/
				};
				
				if(english_name != row.english_name){
				
					delete_name();
					
					if(jap_name != row.jap_name){
					
						delete_name();
						/* stmt = db.prepare("UPDATE cartas SET bash = ? WHERE id = ?;");
						stmt.run(9, row.id);*/
						
					}else{
						save_name();
					};			
				}else{
					save_name();
				};
			});
		});
	});
});