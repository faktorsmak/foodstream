module.exports = function(Activity, mongoose, resizeImage, fs) {
	// TODO - getLatestActivities needs to sort the Activities
	// TODO - getLatestActivities needs to return an error if there is one

	// getLatestActivities - gets the newest 7 days of actvity
	var getLatestActivities = function(memberID, callback) {
		// Activity.find({memberID: memberID}).sort('-activityDate').exec(function(err, activities) {
		// 	callback(err, activities);
		// });
		Activity.findMemberByID(memberID, function(account) {
			if (!account) {
				// no account was found
				callback();
			} else {
				// return member doc
				callback(account.memberStream);
			};

		});
	};

	// addActivity - Register the member with some info
	var addActivity = function(memberID, type, description, activityDate, image, callback) {
		// image is from req.files.image
		console.log("dszfdf",activityDate);
		activityObj = {
			memberID: memberID,
			type: type,
			description: description,
			addedDate: activityDate,
			activityDate: activityDate,
			modifiedDate: activityDate
		};
		// find member
		Activity.findMemberByID(memberID, function(account) {
			// push activity into 'memberStream' of the member obj
			account.memberStream.push(activityObj);
			// save that activity!
			account.save( function(err, accountSave){
				if (err) {
					console.log('encountered an error: ', err);
					callback(err);
				} else {
					var imageID = 1;
					// pull the id of activity we just made
					for (var i = 0; i <= accountSave.memberStream.length; i++) {
						if (accountSave.memberStream[i] && accountSave.memberStream[i].addedDate == activityDate) {
							imageID = accountSave.memberStream[i]._id;
						};
					};
					if (image.size > 0) {
						var tmp_path = image.path;
						// set where the file should actually exists - in this case it is in the "images/activity" directory
						var target_path = './public/images/activity/' + imageID;
						resizeImage(tmp_path, target_path, 500, 500, function(err) {
							if (err) {
								console.log('encountered an error resizing the image: ', err);
								return callback({error: true, errMsg: err});
							}
							// delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
							fs.unlink(tmp_path, function(err) {
								callback(err);
							});
						});
					} else {
						callback(null);
					}
				};
			});
		});
	};

	return {
		Activity: Activity,
		addActivity: addActivity,
		getLatestActivities: getLatestActivities
	}
};