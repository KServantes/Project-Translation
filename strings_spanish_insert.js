var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('cards.cdb');

db.serialize(function() {
	
	var array = fs.readFileSync('strings_es.conf').toString().split("\n");
	for(i in array) {
		if(array[i].indexOf('#') < 0){
			var array2 = array[i].split(" ");
		
			var type = array2[0];
			var number = array2[1];
			var text = array[i].replace(array2[0],'').replace(array2[1],'').trim();
			console.log(text);
		
			var stmt = db.prepare("UPDATE strings SET text_spanish = ? WHERE type = ? AND number = ?");
			stmt.run(text, type, number);
		}
	}
});