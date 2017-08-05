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
			if(array[i].indexOf('#') < 0){
				if (typeof rows !== 'undefined' && rows.length > 0){
					fs.appendFileSync('strings_update.conf', type.replace('setcode','setname') + ' ' + number + ' ' + rows[0].text_spanish + '\n');
				}
			}else{
				fs.appendFileSync('strings_update.conf', array[i] + '\n');
			}
		}
	});
  return result;
}


db.serialize(function() {
	
	var array = fs.readFileSync('strings.conf').toString().split("\n");
	for(i in array){	
		getText(array, i);	
	}
});	