var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('cards.cdb');

function getText(array, i){

	var array2 = array[i].split(" ");
		
	var type = array2[0];
	var number = array2[1];
	var text = array[i].replace(array2[0],'').replace(array2[1],'').trim();

	var query = 'SELECT * FROM strings WHERE text_english = "' + text + '"';
  
	var result = null;
	db.all(query, function (err, rows) {
  
		if(err){
			console.log(err);
		}else{
		
			if (typeof rows !== 'undefined' && rows.length > 0){
			
			}else{
				var stmt = db.prepare('INSERT INTO strings(type, number, text_english) SELECT ?, ?, ? WHERE NOT EXISTS(SELECT 1 FROM strings WHERE text_english = ?);');
				stmt.run(type, number, text, text);
				console.log(array[i]);
			}
		
		}
	});
  return result;
}


db.serialize(function() {
	
	var array = fs.readFileSync('strings.conf').toString().split("\n");
	for(i in array){
		if(array[i].indexOf('#') < 0){
			getText(array, i);
		}
	}
});	