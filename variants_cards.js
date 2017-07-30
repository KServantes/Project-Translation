var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('cards.cdb');
var sizeOf = require('image-size');
var check;


	db.serialize(function(){
		

		db.each("SELECT COUNT(*) AS cantidad, spanish_name FROM cartas WHERE render IS NULL GROUP BY spanish_name HAVING (COUNT(*) > 1);", function(err, row) {
			
			for(var i = 0; i < row.cantidad; i++){
			
				var stmt = db.prepare('update cartas set render = ? where id = (select id from cartas where spanish_name = ? AND render is null group by spanish_name)');
				stmt.run((i+1), row.spanish_name);
			}

		});	
	
	});



