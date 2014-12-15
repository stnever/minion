var http = require('http');
http.globalAgent.maxSockets = 1000;

var gear = require('./request-gear.js')
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
  config.threads.forEach(function(t) {
    // TODO calcular rate
    timers[t.id] = setInterval(function() {
      var pendingReq = pending[t.id]
      if ( t.maxPending != null && pendingReq >= t.maxPending ) {
        console.log('max reached')
        return;
      }

      pending[t.id] = pending[t.id] + 1
      gear.launch(t, config.defaults, function(err, status, body, options) {
        pending[t.id] = pending[t.id] - 1;
        var dt = options.t1 - options.t0;
        totalRequests++;
        if ( err ) console.log("Error (in " + dt + "ms): " + err);
        else {
          console.log( "req " + options.id + ": " + options.method
            + " " + options.hostname + options.path + " HTTP "
            + status + " " + dt + "ms")
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

    