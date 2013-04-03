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

// import model
var Member = require('../models/Member')(mongoose);

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

/*
 * GET sign-in page
 */
exports.signup = function(req, res) {
    res.render('signup', {});
}

/*
 * GET Member Profile page
 */
exports.profile = function(req, res) {
    // profileID should be the member whos page were on
    var profileID = req.params.id;
    // grab that member's info
    Member.findMemberByEmail(profileID, function(account) {
        if (account) {
            // send acount info to view
            res.render('profile', { account: account });
        } else {
            // could not found member, send error
            res.render('profile', { });
        }
    });
}

/*
 * POST Member Login
 */
exports.memberLogin = function(req, res){
    // Set parmas
    var email = req.param('email', ''),
    password = req.param('password', '');
    // Are parmas vaild?
    if ( null == email || email.length < 1 || null == password || password.length < 1 ) {
        res.send(400); //kick them out
        return;
    };
    // Lets try loggin in...
    Member.login(email, password, function(account) {
        if (!account) {
            res.send(401); //could not find account
            return; // or wrong password or email
        }
        // Set session info
        req.session.loggedIn = true;
        req.session.memberId = account._id;
        req.session.firstName = account.first_name;
        req.session.lastName = account.last_name;
        res.send(200);
    });
};

/*
 * GET Member Logout
 */
exports.memberLogout = function(req, res){
    req.session.destroy(function(err){ });
    res.redirect('/'); //go back to index
};

/*
 * POST Member Register
 */
exports.memberRegister = function(req, res){
    // Set parmas
    var password = req.param('password', ''),
        email = req.param('email', ''),
        first = req.param('first_name', ''),
        last = req.param('last_name', '');
    // Are parmas vaild?
    if ( null == email || email.length < 1 || null == password || password.length < 1 ) {
        res.send(400); //kick them out
        return;
    };
    if ( null == first || first.length < 1 || null == last || last.length < 1 ) {
        res.send(400); //kick them out
        return;
    };
    // Register the Member
    Member.register(email,password,first,last, function(account) {
        // Made the account / return an account
        if(account){
            res.send(200); //there is an account
        } else {
            res.send(400); //there isn't an account
        }
    });
};