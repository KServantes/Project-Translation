var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('cards.cdb');
var sizeOf = require('image-size');
var check;

fs.appendFile('cartas_es.tcgb', '{"game":1,"version":2,"cards":{' +  '\n' , function (error) {
	if (error) { 
		console.log("Error: " + error); 
	}

	db.serialize(function(){
		

		var dw = "";
		var dh = "";

		db.each('SELECT id, english_name, spanish_name, card_type, url, pendulum_scale, type, attribute, level, rank, property, card_description_me, card_description_pe, set_card, atk_def_link, card_effect_types FROM cartas WHERE image_url IS NOT NULL  AND bash IS NULL AND type NOT LIKE "%Link%" LIMIT 0,100', function(err, row) {
			var id = "";
			
			
		
			if (fs.existsSync('img/' + row.id + '.jpg')) {
			
				console.log(row.id);
			
				var dimensions = sizeOf('img/' + row.id + '.jpg');
				dw = dimensions.width;
				dh = dimensions.height;
			
				var items = [
					["Effect",  2, 10],
					["Fusion",  1,  9],
					["Ritual",  3, 11],
					["Synchro", 4, 12],
					["Xyz",     7, 15],
					["Token",   6, 14]
				];
			
				var background = "";
				if(row.card_type == "Spell"){ background = "16"; };
				if(row.card_type == "Trap"){ background = "18"; };
				if(row.card_type == "Monster"){ 
					if(row.pendulum_scale == ""){
						background = 0;
						
						if(row.card_effect_types){ background = 2; };
						
						for(var i=0; i < items.length; i++){
							if(row.type.search(items[i][0])!= -1){ background = items[i][1]; };
						};
					}else{
						background = 8;
						for(var i=0; i < items.length; i++){
							if(row.type.search(items[i][0])!= -1){ background = items[i][2]; };
						};
					};
				};
			
				
			
				/*console.log(row.card_type);	
				console.log(row.type);
				console.log(background);*/
			
				var attribute = "";
				if(row.card_type.search("Spell") != -1){
					attribute = 6;
				}else{
					attribute = 7;
				};
				var attribute_list = [
					["DARK",   0],
					["DIVINE", 1],
					["EARTH",  2],
					["FIRE",   3],
					["LAUGH",  4],
					["LIGHT",  5],
					["SPELL",  6],
					["TRAP",   7],
					["WATER",  8],
					["WIND",   9]
				];
			
				for(var i=0; i < attribute_list.length; i++){
					if(row.attribute.search(attribute_list[i][0]) != -1){ attribute = attribute_list[i][1]};
				};
				
				if(row.attribute.indexOf("?") >= 0) { attribute = 4 };
				/*if(row.attribute.search(/\?/g) != -1){ attribute = 4};*/
			
				/*console.log(attribute);*/
			
				var level_rank = row.level + row.rank;
				if(level_rank == ""){level_rank = 0;};
				if(level_rank == "?"){level_rank = 0;};
				
				var icon = 0;
				var icon_list = [
					["Normal",     0],
					["Continuous", 1],
					["Counter",    2],
					["Equip",      3],
					["Field",      4],
					["Quick-Play", 5],
					["Ritual",     6]
				];
			
				for(var i=0; i < icon_list.length; i++){
					if(row.property.search(icon_list[i][0]) != -1){ icon = icon_list[i][1]};
				};
			
				var text_me = row.card_description_me;
				/*text_me = text_me.replace('Esta carta puede ser usada como una "Ficha', 'Invocado Especialmente por el efecto de "');
				text_me = text_me.replace("* Si se usa como otra Ficha, aplica el Tipo/Atributo/Nivel/ATK/DEF de esa Ficha.", "");*/
				
				text_me = text_me.replace(/\\/g,"\\\\");
				text_me = text_me.replace(/\//g, '\\/');
				text_me = text_me.replace(/"/g, '\\"');
				
				if(row.card_description_pe != null){ 
					
					var text_pe = row.card_description_pe;
					text_pe = text_pe.replace(/\\/g,"\\\\");
					text_pe = text_pe.replace(/\//g, '\\/');
					text_pe = text_pe.replace(/"/g, '\\"'); 
				
				};
			
				row.spanish_name = row.spanish_name.replace(/\\/g,"\\\\");
				row.spanish_name = row.spanish_name.replace(/\//g, '\\/');
				row.spanish_name = row.spanish_name.replace(/"/g, '\\"');
				row.spanish_name = row.spanish_name.replace(" *", "").replace("*", "");
			
				var type_list =[
					/* Types */
					["Aqua", "Aqua"],
					["Beast-Warrior", "Guerrero-Bestia"],
					["Divine-Beast", "Bestia divina"],
					["Winged Beast", "Bestia Alada"],
					["Beast", "Bestia"],
					["Fiend", "Demonio"],
					["Dinosaur", "Dinosaurio"],
					["Dragon", "Dragón"],
					["Warrior", "Guerrero"],
					["Fairy", "Hada"],
					["Insect", "Insecto"],
					["Spellcaster", "Lanzador de Conjuros"],
					["Machine", "Máquina"],
					["Fish", "Pez"],
					["Plant", "Planta"],
					["Psychic", "Psíquico"],
					["Pyro", "Piro"],
					["Reptile", "Reptil"],
					["Rock", "Roca"],
					["Sea Serpent", "Serpiente Marina"],
					["Thunder", "Trueno"],
					["Wyrm", "Wyrm"],
					["Zombie", "Zombi"],
					["Creator God", "Dios creador"],
					["Cyberse", "Ciberso"],
		
					/* Monster Card Types */
					["Fusion", "Fusión"],
					["Ritual", "Ritual"],
					["Synchro", "Síncronia"],
					["Xyz", "Xyz"],
					[" / Token", ""],
					["Pendulum", "Péndulo"],
					["Link", "Enlace"],
					["Effect", "Efecto"],
					["Normal", "Normal"],
					
					/* Abilities */
					["Tuner", "Cantante"],
					["Toon", "Toon"],
					["Union", "Unión"],
					["Spirit", "Spirit"],
					["Gemini", "Géminis"],
					["Flip", "Volteo"],
					
					/* Format Style */
					['?', '?'],
					[' / ', '","']
				];
			
				for(var i=0; i < type_list.length; i++){
					if(row.type.indexOf(type_list[i][0]) >= 0){ row.type = row.type.replace(type_list[i][0],type_list[i][1]);};
				};
				
				/*row.type = row.type.replace("?","???");
				console.log(row.type);*/
			
				var atk_def_link = row.atk_def_link.replace(' / ', '","def":"');
			
				if(atk_def_link == ""){ atk_def_link = '0","def":"0';};
			
				if(row.pendulum_scale == ""){ row.pendulum_scale = 0;}; 
				
				/*var directory_img = require('path').basename(__dirname);
				var directory_img = require('path').basename(__filename);*/
				
				var directory_img = require('path').resolve(__dirname).replace(/\\/g,"\\\\") + "\\\\img\\\\";
			
				var stmt = db.prepare("UPDATE cartas SET bash = ? WHERE id = ?;");
				stmt.run('0', row.id);
			
				fs.appendFileSync('cartas_es.tcgb', 
					'"' + row.spanish_name + '":{' +
					'"artwork":"' + directory_img + row.id + '.jpg",' +
					'"artwork_crop":[0,0,' + dw + ',' + dh + '],' +
					'"background":' + background + ',' +
					'"rarity":0,' +
					'"attribute":' + attribute + ',' +
					'"level":"' + level_rank + '",' +
					'"icon":' + icon + ',' +
					'"description":"' + text_me + '",' +
					'"pendulum_description":"' + text_pe + '",' +
					'"pendulum_scales":[' + row.pendulum_scale + ',' + row.pendulum_scale + '],' +
					'"subtypes":["' + row.type + '"],' +
					'"atk":"' + atk_def_link + '",'	+	
					'"edition":1,' +
					'"set":"' + row.set_card + '",' +
					'"card_number":"' + row.id + '",' +
					'"limitation":"",' +
					'"sticker":2,' +
					'"copyright":1},' +
					'\n' 
				);
			};
		});	
	});
});



