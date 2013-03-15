var express = require('express')
	http = require('http'),
	path = require('path'),
	engine = require('ejs-locals'),
	MemoryStore = require('connect').session.MemoryStore,
	dbPath = 'mongodb://localhost/foodstream',
	mongoose = require('mongoose');

var app = express();

// use ejs-locals for all ejs templates:
app.engine('ejs', engine);

// configure Express
app.configure(function() {
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.engine('ejs', engine);
	app.use(express.cookieParser());
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.session({ 
		secret: 'eat more food', 
		store: new MemoryStore() 
	}));
	mongoose.connect(dbPath, function onMongooseError(err) {
		if (err) throw err;
	});
});

// homepage
app.get('/', function(req, res){
	res.render('index',{pagename: 'Homepage'});
});

// error
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.send(500, 'Something broke!');
});

// run on port 8080
app.listen(8080);
console.log("Server Running!");