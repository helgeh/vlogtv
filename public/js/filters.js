'use strict';

var moment = require('moment');

module.exports = {
	prettyDate: function () {
	  return function (input) {
	    var m = moment.utc(input);
	    return m.format('Do [of] MMMM YYYY [(]ddd[)]');
	  }
	}
};