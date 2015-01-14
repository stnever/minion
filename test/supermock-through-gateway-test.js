var requestMachine = require("../src/request-machine.js")

requestMachine.start({
  tubes: [
    {
      id: "req1",
      rate: 500,
      // maxPending: 10,
      url: "http://10.0.0.5:8080/api/supermock",
      method: "GET",
      timeoutMillis: 5000
    },
    {
      id: "req2",
      rate: 2000,
      // maxPending: 10,
      url: "http://10.0.0.5:8080/api/supermock",
      method: "POST",
      timeoutMillis: 5000,
      body: "some body",
      headers: {
        'Content-Length': "some body".length
      }
    },
  ]
})