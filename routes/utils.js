// define var
var gm = require("gm");

/**
 * Truncate a string to the given length, breaking at word boundaries and adding an elipsis
 * @param string str String to be truncated
 * @param integer limit Max length of the string
 * @return string
 */
exports.truncate = function (str, limit) {
	var bits, i;
	bits = str.split('');
	if (bits.length > limit) {
		for (i = bits.length - 1; i > -1; --i) {
			if (i > limit) {
				bits.length = i;
			}
			else if (' ' === bits[i]) {
				bits.length = i;
				break;
			}
		}
	}
	return bits.join('');
}

/**
 * resize an image
 * @param string inputPath - path to the image file to resize
 * @param string outputPath - path to where the resized image should be written
 * @param number width - max width
 * @param number height - max height
 * @param function callback
 */
exports.resizeImage = function(inputPath, outputPath, width, height, callback) {
	var mygm = gm(inputPath);
	mygm = mygm.resize(width, height);
	mygm.write(outputPath, function (err) {
		// err is null if there is no error
		callback(err);
	});
}

/**
 * validate email
 * @param string email - user input: email
 * @param function callback
 */
exports.validateEmail = function(email, callback) {
	// regex found here - http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
	var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return regex.test(email);
};

/**
 * validate username
 * @param string username - user input: username
 * @param function callback
 */
exports.validateUsername = function(username, callback) {
	//word characters such as 0-9, A-Z, a-z, _
	//literal period
	//literal @
	//between 6 and 50 characters long
	var regex = /^[\w\.@]{6,50}$/;
	return regex.test(username);
};

/**
 * validate password
 * @param string password - user input: password
 * @param function callback
 */
exports.validatePassword = function(password, callback) {
	//word characters such as 0-9, A-Z, a-z, _
	//literal period
	//literal @
	//between 6 and 50 characters long
	var regex = /^[\w\.@]{6,50}$/;
	return regex.test(password);
};

/**
 * validate first name
 * @param string first name - user input: first name
 * @param function callback
 */
exports.validateFirstName = function(firstName, callback) {
	//word characters such as A-Z and a-z
	//between 2 and 30 characters long
	var regex = /[a-zA-Z]{2,30}/;
	return regex.test(firstName);
};

/**
 * validate last name
 * @param string last name - user input: last name
 * @param function callback
 */
exports.validateLastName = function(lastName, callback) {
	//word characters such as A-Z and a-z
	//between 2 and 30 characters long
	var regex = /[a-zA-Z]{2,30}/;
	return regex.test(lastName);
};