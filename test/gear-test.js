var gear = require('../src/request-gear.js')

gear.launch({
	url: "http://supermock.demo.sensedia.com",
	method: "GET",
	headers: {
		"X-Something": "X-Value"
	},
	timeoutMillis: 5000
}, {}, function(err, status, body, options) {
	if ( err ) console.log(err)
	else console.log(options, status)
})