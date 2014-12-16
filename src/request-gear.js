var http = require('http')
var url = require('url')
var _ = require('lodash')

exports.launch = function(config, defaults, callback) {

	var idGenerator = +Date.now()

	// TODO lidar com defaults
	// TODO interpolar propriedades

	var parsedUrl = url.parse(config.url);
	var options = {
		hostname: parsedUrl.hostname,
		port: parsedUrl.port || ( parsedUrl.protocol == 'http:' ? 80 : 443 ),
		method: config.method,
		path: parsedUrl.path,
		headers: config.headers,
		id: ++idGenerator
	}

	var req = http.request(options, function(res) {
		// console.log("received")

	  // eh necessario ler a resposta para esvaziar o buffer e
	  // disparar o evento 'end'
	  res.setEncoding('utf8');
	  var body = ''
		res.on('data', function (chunk) { body += chunk })

	  res.on('end', function() {
			options.t1 = Date.now()
			callback( null, res.statusCode, body, options )
		})

		res.setTimeout(config.timeoutMillis, function() {
			options.t1 = Date.now()
			req.abort()
			callback("response timeout", null, options)
		})
	})

	req.on('socket', function() {
		options.t0 = Date.now()
	})

	req.setTimeout(config.timeoutMillis, function() {
		options.t1 = Date.now()
		req.abort()
		callback("request timeout", null, options)
	})

	req.on('error', function(e) {
	  callback(e)
	});

	// write data to request body
	if ( config.body ) {
		var contents = _.isFunction(config.body)
			? config.body(options)
			: config.body ;

		// console.log('about to write body', contents)

		req.write(contents);
	}

	req.end();
}