var http = require('http');
http.globalAgent.maxSockets = 1000;

var tube = require('./request-tube.js')
var _ = require('lodash')

var timers = {};
var pending = {};
var totalRequests = 0;
var status = 'waiting'

exports.stop = function() {
  status = 'stopping'
  _(timers).forOwn(function(v, k) {
    clearInterval(v)
  })
  status = 'waiting'
}

exports.start = function(config) {
  if ( status !== 'waiting' )
    return;

  console.log("Running request machine")
  status = 'running'

  totalRequests = 0
  pending = {}

  tubes = config.threads || config.tubes;

  tubes.forEach(function(t) {
    // TODO calcular rate
    timers[t.id] = setInterval(function() {
      var pendingReq = pending[t.id]
      if ( t.maxPending != null && pendingReq >= t.maxPending ) {
        console.log('max reached')
        return;
      }

      pending[t.id] = pending[t.id] + 1
      tube.launch(t, config.defaults, function(err, status, body, options) {
        pending[t.id] = pending[t.id] - 1;
        var dt = options.t1 - options.t0;
        totalRequests++;
        if ( err ) console.log("Error (in " + dt + "ms): " + err);
        else {
          console.log( "req " + options.id + ": " + options.method
            + " " + options.hostname + options.path + " HTTP "
            + status + " " + dt + "ms")

          if ( status >= 400 )
            console.log(body)
        }
      })
    }, t.rate)
  })
}

exports.getStatus = function() {
  return status
}

exports.getPendingRequests = function() {
  return _(pending).values().reduce(function(sum, num) { return sum+num });
}

exports.getTotalRequests = function() {
  return totalRequests
}

