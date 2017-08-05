var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('cards.cdb');

db.serialize(function() {

	db.run("CREATE TABLE if not exists strings(type TEXT, number TEXT, text_english TEXT, text_spanish TEXT)");
	
	var array = fs.readFileSync('strings.conf').toString().split("\n");
	for(i in array) {
		if(array[i].indexOf('#') < 0){
			var array2 = array[i].split(" ");
		
			var type = array2[0];
			var number = array2[1];
			var text = array[i].replace(array2[0],'').replace(array2[1],'').trim();
			console.log(text);
		
			var stmt = db.prepare("INSERT INTO strings(type, number, text_english) VALUES (?, ?, ?)");
			stmt.run(type, number, text);
		}
	}
});