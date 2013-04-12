module.exports = function(mongoose) {
	// TODO - encrypted member passwords
	// TODO - Log errors
	// TODO - use username to id members (stop using email)

	// Schema for followers
	var Followers = new mongoose.Schema({
		first_name: { type: String },
		last_name: { type: String },
		email: { type: String  }
	});

	// Member Schema
	var memberSchema = new mongoose.Schema({
		//every member should least have this info
		email: { type: String }, //set these to require and cap them...
		password: { type: String },
		username: { type: String },
		first_name: { type: String },
		last_name: { type: String },
		followers:  [Followers],
	});

	// Member Object
	var Member = mongoose.model('Member', memberSchema);

	// findMemberByEmail - Finds member by their email
	var findMemberByEmail = function(email, callback) {
		Member.findOne({email:email}, function(err,doc) {
			//return member doc if found
			callback(doc);
		});
	};

	// findMemberByEmail - Finds member by their username
	var findMemberByUserName = function(username, callback) {
		Member.findOne({username:username}, function(err,doc) {
			//return member doc if found
			callback(doc);
		});
	};

	// findMemberByID - Finds member by their _id
	var findMemberByID = function(id, callback) {
		Member.findOne({_id:id}, function(err,doc) {
			//return member doc if found
			callback(doc);
		});
	};

	// login - Member login call
	var login = function(email, password, callback) {
		Member.findOne({email:email,password:password},function(err,member){
			//return member doc if found
			callback(member);
		});
	};

	// register - Register the member with some info
	var register = function(email,password,username,first,last,callback) {
		// first make sure the user doesn't all ready have an account
		findMemberByEmail(email, function(account) {
			if (!account) {
				// no account was found, so make one
				var user = new Member({
					email: email,
					password: password,
					username: username,
					first_name: first,
					last_name: last
				});

				// make that user!
				user.save( function(err, results){
					// should we log err?
					callback(results);
				});
			} else {
				// return member doc
				callback(account);
			};
		})
	};

	// areYouAllReadyFollowingThem - pick a better name
	var areYouAllReadyFollowingThem = function(email,member) {
		//email - user who is being added
		//member - user who wants to add
		var friendsArray = member.followers;
		//you cant follow yourself
		if(member.email == email){ return true; };
		//loop over following
		for (var i = friendsArray.length - 1; i >= 0; i--) {
			if(friendsArray[i].email == email){
				return true; // found a match
			};
		};
		//member is not following them
		return false;
	};

	// startFollow - adds follow to member obj
	var startFollow = function(email,first,last,member,callback) {
		// member is the user who is doing the following
		//set follower object
		followerObj = {
			first_name: first,
			last_name: last,
			email: email
		};
		// find member
		findMemberByEmail(member, function(account) {
			//test if member if all ready following them
			if(!areYouAllReadyFollowingThem(email,account)){
				//push followerObj into 'followers' of the member obj
				account.followers.push(followerObj);
				//save that follower!
				account.save( function(err, results){
					// should we log err?
					callback(results);
				});
			};
		});
	};

	// stopFollow - removes follow to member obj
	var stopFollow = function(followerEmail,accountEmail,callback) {
		// accountEmail is the member who is deleting
		// followerEmail is the follower who is being removed
		// find member
		findMemberByEmail(accountEmail, function(account) {
			// if account has no followers, return
			if (account.followers == null){
				return;
			};
			// loop over each follower
			account.followers.forEach(function(Followers) {
				if (Followers.email == followerEmail ) {
					// found follower, remove them
					account.followers.remove(Followers);
				}
			});
			// save changes
			account.save( function(err, results){
				// should we log err?
				callback(results);
			});
		});
	};

	return {
		Member: Member,
		login: login,
		findMemberByEmail: findMemberByEmail,
		findMemberByID: findMemberByID,
		register: register,
		startFollow: startFollow,
		stopFollow: stopFollow
	}
};