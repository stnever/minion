var _ = require('lodash')
var requestMachine = require("../src/request-machine.js")
var uuid = require('uuid')

var s = '0123456789abcdefghijklmnopqrsuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
var slen = s.length - 1;

function randomAlphanumeric(size) {
	var r = [];
	for ( var i = 0; i < size; i++ )
		r.push(s[_.random(slen)])
	return r.join();
}

function rnd(arr) {
	return arr[_.random(arr.length)]
}

function generateDoc() {
	return {
		  id 							: uuid.v4()
		, appToken				: randomAlphanumeric(12)
		, authToken				: randomAlphanumeric(12)
		, appName					: 'App  ' + randomAlphanumeric(6)
		, authOwner   		: 'User ' + randomAlphanumeric(6)
		, date 		       	: new Date().toISOString()
		, method					: rnd(['GET', 'POST', 'PUT', 'DELETE'])
		, environment 		: rnd(['production', 'sandbox'])
		, apiId       		: _.random(10)
		, resourcePath		: '/' + randomAlphanumeric(6)
		, url							: 'http://host/path/' + randomAlphanumeric(6)
		, fromAddress 		: '127.0.0.1'
		, httpStatus			: rnd([200,201,302,400,404,429,500])
		, latency					: _.random(1500)
		, requestHeaders	: 'req_head ' + randomAlphanumeric(100)
		, responseHeaders	: 'res_head ' + randomAlphanumeric(100)
		, requestBody			: 'req_body ' + randomAlphanumeric(100)
		, responseBody		: 'res_body ' + randomAlphanumeric(2048)
		, gatewayTrace		: 'trace ' + randomAlphanumeric(100)
		, compressedBodies: false
	}
}

requestMachine.start({
	threads: [
		{
			id: "req1",
			rate: 2000,
			// maxPending: 10,
			url: "http://10.0.0.5:8080/solr-4.10.2/ApiCallsIndex/update?commitWithin=10000",
			method: "POST",
			headers: {
				"Content-Type": "application/json; charset=utf-8"
			},
			timeoutMillis: 5000,
			body: function(options) {
				var docs = _.times(1000, generateDoc)
				return JSON.stringify(docs, null, ' ')
			}
		}
	]
})