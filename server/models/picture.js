var mongoose = require('mongoose');

var Picture = mongoose.model('Picture', {
	URL:{
		type: String,
		required: true,
		minlength:1,
		trim: true // removes leading or trailing whitespace
	},
	category:{
		type: String,
		required: true,
		minlength:1,
		trim: true 
	},
	description:{
		type:String,
		default: null,
		trim: true 
	}
});

module.exports = {Picture}