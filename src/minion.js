var requestMachine = require('./request-machine.js')
var request = require('request')
var uuid = require('uuid')
var _ = require('lodash')

var ip = require('os').networkInterfaces().eth0.filter(function(val) {
    return val.family == 'IPv4' && val.internal == false
})[0].address


var minion = {
    initializedOn: Date.now(),
    id: uuid(),
    ip: ip,
    mastermindUrl: 'http://mastermind.sensedia.com',
    configTimestamp: null,
    config: {}
}

var sendReport = function(callback) {
    console.log("Sending report to Mastermind.");
    request.post({
        uri: minion.mastermindUrl + '/minions',
        json: true,
        body: {
            id: minion.id,
            ip: minion.ip,
            lastOrderReceivedOn: minion.configTimestamp,
            status: requestMachine.getStatus(),
            pendingRequests: requestMachine.getPendingRequests(),
            initializedOn: minion.initializedOn,
            totalRequests: requestMachine.getTotalRequests(),
            counts: []
        }
    }, function(err, response, body) {
        console.log("Report sent successfully.");
        if ( callback ) callback(err, response, body);
    });
}

var getOrders = function() {
}

setInterval(5000, function() {
    sendReport(function() {
        request.get(minion.mastermindUrl + '/minions/' + minion.id + '/orders',
            function(error, response, body) {

                // Se a configuracao eh diferente da que tinhamos guardado,
                // atualiza. Observe que isto nao fara efeito ate o proximo
                // requestMachine.start() .
                if ( minion.configTimestamp == null ||
                     minion.configTimestamp != body.configTimestamp ) {
                    minion.configTimestamp = body.configTimestamp
                    minion.config = body.config
                }

                var cmd = body.command
                if ( cmd === 'start' ) {
                    requestMachine.start(minion.config)
                } else if ( cmd === 'stop' ) {
                    requestMachine.stop()
                }
            }
        );
    });
});



// Periodicamente, comunica com o Mastermind para enviar o relatorio de requests
// e ver se existem novas ordens.
