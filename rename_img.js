var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('cards.cdb');
var fs = require('fs');

db.serialize(function(){

	db.each('SELECT id, spanish_name FROM cartas WHERE bash = "0"', function(err, row) {
	
		if (fs.existsSync('img_spanish/' + row.spanish_name.replace(" *", "").replace("*", "") + '.jpg')) {
		
			var stmt = db.prepare("UPDATE cartas SET bash = ? WHERE id = ?;");
			stmt.run('1', row.id);
			
			fs.rename('img_spanish/' + row.spanish_name.replace(" *", "").replace("*", "") + '.jpg', 'img_spanish/' + row.id + '.jpg', function(err) {
				if ( err ) console.log('ERROR: ' + err);
			});
		};
	});
});



