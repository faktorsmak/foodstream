// TODO - function out prams validation
// TODO - function for login check

// define vars
var mongoose = require('mongoose'), 
	db = mongoose.createConnection('localhost', 'foodstream'),
	url = require('url'),
	fs = require('fs'),
	truncate = require('./utils.js').truncate,
	resizeImage = require('./utils.js').resizeImage;

// import model
var Member = require('../models/Member')(mongoose);
var ActivityStream = require('../models/ActivityStream')(mongoose,resizeImage,fs);

/*
 * GET home page.
 */

exports.index = function(req, res) {
	res.render('index', { user : req.session.user});
}

/*
 * GET sign-in page
 */
exports.signin = function(req, res) {
	res.render('signin', {user : req.session.user});
}

/*
 * GET sign-in page
 */
exports.signup = function(req, res) {
	res.render('signup', {user : req.session.user});
}

/*
 * GET Member Profile page
 */
exports.profile = function(req, res) {
	// profileID should be the member whos page were on
	var profileID = req.params.id;
	//console.log("getting profile with id:", profileID);
	// grab that member's info
	Member.findMemberByID(profileID, function(account) {
		if (account) {
			ActivityStream.getLatestActivities(account._id, function(err, activities) {
				// send acount info to view
				res.render('profile', { account: account, activities: activities, user : req.session.user });
			});
		} else {
			// could not found member, send error
			res.send(400);
		}
	});
}

/*
 * POST Member Login
 */
exports.memberLogin = function(req, res){
	// Set parmas
	var email = req.param('email', ''),
	password = req.param('password', ''),
	rememberMe = req.param('rememberMe', '');
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
		req.session.user = account;
		req.session.loggedIn = true;
		req.session.memberId = account._id;
		req.session.firstName = account.first_name;
		req.session.lastName = account.last_name;
		req.session.email = account.email;
		// user click the remember feild
		if(rememberMe == "on") {
			// set cookies
			res.cookie('username', account.first_name, { maxAge: 900000, httpOnly: true });
			// we will have to store the username and password in order for this work
			// since password is not being encrypted i'm not going to store it for now...
		};
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
		username = req.param('username', ''),
		first = req.param('first_name', ''),
		last = req.param('last_name', '');
	// Are parmas vaild?
	if ( null == email || email.length < 1 || null == password || password.length < 1 || null == username || username.length < 1 ) {
		res.send(400); //kick them out
		return;
	};
	if ( null == first || first.length < 1 || null == last || last.length < 1 ) {
		res.send(400); //kick them out
		return;
	};
	// Register the Member
	Member.register(email,password,username,first,last, function(account) {
		// Made the account / return an account
		if(account){
			res.send(200); //there is an account
		} else {
			res.send(400); //there isn't an account
		}
	});
};

/*
 * POST Member Follow
 */
exports.memberFollow = function(req, res){
	// Set parmas
	var email = req.param('email', ''),
		first = req.param('first_name', ''),
		last = req.param('last_name', '');
	// Are parmas vaild?
	if ( null == email || email.length < 1) {
		res.send(400); //kick them out
		return;
	};
	if ( null == first || first.length < 1 || null == last || last.length < 1 ) {
		res.send(400); //kick them out
		return;
	};
	// is the user loggin?
	if(!req.session.email) {
		res.send(400); //kick them out
		return;
	};
	// add follower
	Member.startFollow(email,first,last,req.session.email, function(results) {
		// it worked...
		if(results){
			res.send(200); 
		} else {
			// something went wrong
			// so wrong...
			res.send(400);
		}
	});
};

/*
 * POST Member Unfollow
 */
exports.memberUnfollow = function(req, res){
	// Set parmas
	var email = req.param('email', '');
		// Are parmas vaild?
	if ( null == email || email.length < 1) {
		res.send(400); //kick them out
		return;
	};
	// is the user loggin?
	if(!req.session.email) {
		res.send(400); //kick them out
		return;
	};
	// remove follower
	Member.stopFollow(email,req.session.email, function(results) {
		// it worked...
		if(results){
			res.send(200); 
		} else {
			// something went wrong
			// so wrong...
			res.send(400);
		}
	});
};

/*
 * GET activity
 */
exports.getActivity = function(req, res) {
	// profileID should be the member whos page were on
	var profileID = req.params.id;
	//console.log("getting profile with id:", profileID);
	// grab that member's info
	Member.findMemberByID(profileID, function(account) {
		if (account) {
			ActivityStream.getLatestActivities(account._id, function(err, activities) {
				// send acount info to view
				res.send({ account: account, activities: activities });
			});
		} else {
			// could not found member, send error
			res.send(400);
		}
	});
}

/*
 * GET Add Activity Form
 */
exports.addActivityForm = function(req, res) {
	if (req.session.user) {
		res.render('newactivity', {user: req.session.user});
	} else {
		res.redirect('/signin');
	}
};

/*
 * POST Add Activity
 */
exports.addActivity = function(req, res) {
	ActivityStream.addActivity(req.session.user._id, req.body.type, req.body.description, req.body.activityDate, req.files.image, function(err) {
		if (err) res.send(500);
		res.redirect('/profile/' + req.session.user._id);
	});
};
