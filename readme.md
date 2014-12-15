## Synopsis

minionJS is the worker for the Minion-Mastermind load test tool. See that project for more information.

Minions are long-term worker processes that periodically query the Mastermind server for new configuration and orders. When orders are received, they begin working and periodically send work reports back to the Mastermind, until they receive an order to stop.

Minions operate a *request machine*, which makes HTTP(S) requests. A minion's configuration includes many request instructions: for example, she may be configured to make a `GET` request to an endpoint, 5 times per second, and also to `POST` some content to another endpoint, once per minute.

## Code Example

If you want to use minionJS in a standalone fashion, you must operate the RequestMachine yourself:

		var requestMachine = require('minionjs')
		minion.

Show what the library does as concisely as possible, developers should be able to figure out **how** your project solves their problem by looking at the code example. Make sure the API you are showing off is obvious, and that your code is short and concise.

## Motivation

A short description of the motivation behind the creation and maintenance of the project. This should explain **why** the project exists.

## Installation

Provide code examples and explanations of how to get the project.

## API Reference

Depending on the size of the project, if it is small and simple enough the reference docs can be added to the README. For medium size to larger projects it is important to at least provide a link to where the API reference docs live.

## Tests

Describe and show how to run the tests with code examples.

## Contributors

Let people know how they can dive into the project, include important links to things like issue trackers, irc, twitter accounts if applicable.

## License

A short snippet describing the license (MIT, Apache, etc.)