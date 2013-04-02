var mongoose = require('mongoose'), 
        db = mongoose.createConnection('localhost', 'foodstream'),
        url = require('url'),
        fs = require('fs'),
        truncate = require('./utils.js').truncate,
        resizeImage = require('./utils.js').resizeImage;


/*
var bookSchema = new mongoose.Schema({ 
        title:String,
        description:String,
        publishdate:Date 
}); 
var Book = db.model('Book', bookSchema); 
*/


/*
 * GET home page.
 */

exports.index = function(req, res) {
    res.render('index', { blah : 'bar'});
}

/*
 * GET sign-in page
 */
exports.signin = function(req, res) {
    res.render('signin', {});
}
