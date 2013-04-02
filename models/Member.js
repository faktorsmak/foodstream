module.exports = function(mongoose) {
	// TODO - encrypted member passwords

	// Member Schema
	var memberSchema = new mongoose.Schema({
		//every member should least have this info
		email: { type: String }, //set these to require and cap them...
		password:  { type: String },
		first_name:  { type: String },
		last_name:  { type: String }
	});

	// Member Object
	var Member = mongoose.model('Member', memberSchema);

	// Register Callback
	var registerCallback = function(err) {
		if (err) {
			return console.log(err);
		};
		return console.log('Member was Made');
	};

	// findMemberByEmail - Finds member by their email
	var findMemberByEmail = function(email, callback) {
		Member.findOne({email:email}, function(err,doc) {
			//return member doc if found
			callback(doc);
		});
	};


	// login - Member login call
	var login = function(email, password, callback) {
		Member.findOne({email:email,password:password},function(err,doc){
			//return member doc if found
			callback(doc);
		});
	};

	// register - Register the member with some info
	var register = function(email,password,first,last,callback) {
		// first make sure the user doesn't all ready have an account
		findMemberByEmail(email, function(account) {
			if (!account) {
					// no accout was found, so make one
					var user = new Member({
						email: email,
						password: password,
						first_name: first,
						last_name: last
					});
					// make that user!
					user.save(registerCallback);
			}
			// return member doc
			callback(account);
		})
	};

	return {
		Member: Member,
		login: login,
		findMemberByEmail: findMemberByEmail,
		register: register
	}
};