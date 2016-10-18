var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	var longUrl = req.query.new;

	if (longUrl) {
		// if a URL was included in the query string, validate format with regex
		var urlRegex = /https?:\/\/www\.[\w-]+\.[\w-]+[\.\w-]*/;
		if (urlRegex.test(longUrl)) {
			// check the database to see if it has been shortened before
			req.db.collection('short').findOne({ longUrl: longUrl }, { _id: 0 }, function(err, doc) {
				if (err) {
					var err = new Error('An error occurred while checking the database for the URL.');
					err.status = 500; // internal server error
					next(err);
				} else {
					if (doc) {
						console.log('This URL has been entered into the database before.');
						res.send(doc);
					} else {
						console.log('New URL provided. Generating short version...');
						// generate a short URL for this URL
						generateShort();
					}
				}
			});
		} else {
			// the URL provided in the query string is invalid
			res.send({ "original_url": null, "short_url": null });
		}
	} else {
		// if no 'new' URL was included in the query string, serve index
		res.render('index');
	}


	function generateShort() {
		// this function generates a random short URL and inserts it into the database,
		// before sending the new document to the client
		
		var alphaNumeric = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","0","1","2","3","4","5","6","7","8","9"];
		var randomStr = '';

		for (var i = 0; i < 5; i++) {
			randomStr += alphaNumeric[Math.floor(Math.random()*alphaNumeric.length)];
		}
		
		var shortUrl = 'http://localhost:3000/' + randomStr;
		// var shortUrl = 'https://shourl.herokuapp.com/' + randomStr;

	  req.db.collection('short').findOne({ shortUrl: shortUrl }, function(err, doc) {
	  	if (err) {
	  		var err = new Error('An error occurred during the short URL generation.');
	  		err.status = 500; // internal server error
	  		next(err);
	  	} else {
	  		if (doc) {
	  			console.log('This short URL already exists. Generating another...');
	  			generateShort();
	  		} else {
	  			console.log('Unique short URL generated.');
	  			var urlObj = {
						shortUrl: shortUrl,
						longUrl: longUrl
	  			};

	  			req.db.collection('short').insertOne(urlObj, function(err, result) {
						if (err) {
							var err = new Error('An error occurred while updating the database with the short URL.');
							err.status = 500;
							next(err);
						} else {
							console.log('Document successfully inserted.');
							var generatedDoc = {};
							generatedDoc.shortUrl = result.ops[0].shortUrl;
							generatedDoc.longUrl = result.ops[0].longUrl;
							res.send(generatedDoc);
						}	
	  			});
	  		}
	  	}
	  });	
	}
});

router.get('/:shortAddress', function(req, res, next) {
	
});


module.exports = router;
