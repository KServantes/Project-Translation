var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('cards.cdb');
const download = require('image-downloader');
var check;

db.serialize(function() {

	db.each("SELECT id, english_name, jap_name, set_card FROM cartas WHERE image_url IS NULL LIMIT 0,100", function(err, row) {
  	
			if (fs.existsSync('./img/' + row.id + '.jpg')){
				var stmt = db.prepare("UPDATE cartas SET image_url = ? WHERE id = ?;");
				stmt.run(1, row.id);
				/* console.log("yeah"); */
			}else{
			    
				console.log(row.id);
				const options = {
					url: 'https://raw.githubusercontent.com/moecube/ygopro-images/master/pics/' + row.id + '.jpg',
					dest: './img/'                  
				}
 
				async function downloadIMG() {
					try {
						const { filename, image } = await download.image(options)
						console.log(filename) // => /path/to/dest/image.jpg  
					} catch (e) {
						throw e
					}
				}
 
				downloadIMG()
			};
	});
});
