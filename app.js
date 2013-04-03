var express = require('express')
	http = require('http'),
	path = require('path'),
    routes = require(__dirname + '/routes/main.js'),
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
	app.use(express.static(__dirname + '/public'));
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
app.get('/', routes.index);
app.get('/signin', routes.signin);
app.get('/signup', routes.signup);

// member
app.post('/memberLogin', routes.memberLogin);
app.get('/profile/:id?', routes.profile);
app.get('/memberLogout', routes.memberLogout);
app.post('/memberRegister', routes.memberRegister);

// error
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.send(500, 'Something broke!');
});

// run on port 8080
app.listen(8080);
console.log("Server Running!");