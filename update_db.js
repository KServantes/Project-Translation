var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('cards.cdb');
var sizeOf = require('image-size');
var check;


	db.serialize(function(){
		

		db.each("SELECT id, name FROM texts WHERE name in (select english_name from cartas where image_url is null)", function(err, row) {

				var stmt = db.prepare('UPDATE cartas SET id = ? where english_name = ? AND image_url is null');
				stmt.run(row.id, row.name);
				console.log(row.id);

		});	
	
	});



