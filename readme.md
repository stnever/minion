## Synopsis

minion is the worker for the Minion-Mastermind load test tool. See that project for more information.

Minions are long-term worker processes that periodically query the Mastermind server for new configuration and orders. When orders are received, they begin working and periodically send work reports back to the Mastermind, until they receive an order to stop.

Minions operate a *request machine*, which makes HTTP(S) requests. A minion's configuration includes many request instructions: for example, she may be configured to make a `GET` request to an endpoint, 5 times per second, and also to `POST` some content to another endpoint, once per minute.

## Code Example

Normally, you just run the minion process, telling it where to find the Mastermind server:

    minion http://mastermind.example.com

That'll leave it running. You can then control it through the Mastermind webapp.

If you want to use minion without the Mastermind server, in a standalone fashion, you must operate the RequestMachine yourself:

		var requestMachine = require('minion/request-machine')
		requestMachine.start({
      threads: [
        {id: 'req1', rate: 50, maxPending: 10, timeoutMillis: 5000, url: 'http://google.com'},
        {id: 'req2', rate: 5000, maxPending: 10, timeoutMillis: 5000, url: 'http://myserver.com/orders', body: "some request body"}
      ]
    })


## Motivation

I wanted to perform load test analysis of several REST-like APIs and middleware. Even though I know how to use JMeter and LoadUI, they both seemed too bloated and complicated for some simple tasks.

The minion process is well suited to be placed in a lot of short-lived, disposable cloud machines (like t1.micro in EC2, or dynos in heroku). You launch one long-lived Mastermind server to control and aggregate results, then launch dozen of Minion machines to wreak havoc on your servers :)

## Configuration Reference

This is the expected format of the configuration object that the RequestMachine uses:

    {
      id: 'name-of-this-configuration',

      // the following values are inherited by the request
      // definitions below. Request values have precedence
      // over these.
      defaults: {

        // hold some vars for {{interpolation}} later.
        vars: {
          sellerId: 123,
          userId: 'joe@example.com'
        },

        // request headers
        headers: {
          'Content-Type': "application/json"
          'X-Seller-Id': "{{sellerId}}"
        }
      }
    }

    


## License

MIT