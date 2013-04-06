module.exports = function(mongoose, resizeImage, fs) {

	// Schema for an Activity
	var activitySchema = new mongoose.Schema({
		memberID: { type: String }, // reference to members collection
		type: { type: String },	 // breakfast, lunch, dinner, snack, drink
		description: { type: String },  // optional description of the activity
		activityDate: { type: Date },  // when the activity occurred
		modifiedDate: { type: Date },  // when the activity was added/updated
	});

	// Activity Object
	var Activity = mongoose.model('Activity', activitySchema);

	// getLatestActivities - gets the newest 7 days of actvity
	var getLatestActivities = function(memberID, callback) {
		Activity.find({memberID: memberID}).sort('-activityDate').exec(function(err, activities) {
		   callback(err, activities);
		}); 
	};

	// addActivity - Register the member with some info
	var addActivity = function(memberID, type, description, activityDate, image, callback) {
		// image is from req.files.image
		var activity = new Activity();
		activity.memberID = memberID;
		activity.type = type;
		activity.description = description;
		activity.activityDate = new Date();;
		activity.modifiedDate = new Date();

		activity.save(function(err, newActivity) {
			if (err) {
				console.log('encountered an error: ', err);
				callback(err);
			} else {
				if (image.size > 0) {
					var tmp_path = image.path;
					// set where the file should actually exists - in this case it is in the "images/activity" directory
					var target_path = './public/images/activity/' + newActivity._id;
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
			}
		});
	};

	return {
		Activity: Activity,
		addActivity: addActivity,
		getLatestActivities: getLatestActivities
	}
};