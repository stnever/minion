var http = require('http');
http.globalAgent.maxSockets = 100;

var requestMachine = require("../src/request-machine.js")

requestMachine.start({
	threads: [
		{
			id: "req1",
			rate: 50,
			// maxPending: 10,
			url: "http://supermock.demo.sensedia.com?sleepMinMillis=1250",
			method: "GET",
			headers: {
				"X-Something": "X-Value"
			},
			timeoutMillis: 5000
		}
	]
})