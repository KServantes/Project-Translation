var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('cards.cdb');
var check;


db.serialize(function() {

	db.each("SELECT id, english_name, jap_name, set_card FROM cartas WHERE spanish_name IS NULL LIMIT 0,100", function(err, row) {
		/*console.log(row.id + " " + row.jap_name);*/
		var search = "";
		if(row.jap_name == ""){
			search = row.english_name;
		}else{
			search = row.jap_name;
		};

		request.get({ url: "http://es.yugioh.wikia.com/wiki/Especial:Buscar?search=" +  encodeURIComponent(search), timeout:600000}, function(error, response, body) {
			if(error) {
				console.log("Error: " + error);
			}
			console.log("Status code: " + response.statusCode);
			console.log(row.id);
			/*console.log(encodeURIComponent(search));*/
			var $ = cheerio.load(body);
			var url = "";
			
			var stmt = db.prepare("UPDATE cartas SET bash = ?  WHERE id=?;");
			/* stmt.run(10, row.id); */
			
			$('ul.Results').each(function( index ) {
				var spanish_name = $(this).find('a.result-link[data-pos="1"]').first().text().trim();
				url = $(this).find('a.result-link[data-pos="1"]').last().text().trim();
				stmt = db.prepare("UPDATE cartas SET spanish_name = ?, url = ?  WHERE id=?;");
				stmt.run(spanish_name, url, row.id);
				
				
			});
			if(url == ""){
				
			}       
		});
	});
});

