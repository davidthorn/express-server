# Express Server - Examples

This is a test project which allows for me to learn and document all my finding about how you create express servers.

# Installation

> Install the express package 

```bash
npm install --save-dev express
```

# Create a basic server

From what it seems all we have to do is to instantiate an express object.

```javascript
const express = require('express');
const app = express();
```

Add a listener to a route.
```javascript
app.get('/home' , (request, response) => {
    response.send('Hello world');
})
```

Then start to listen on a port

```javascript
app.listen(3000)
```

Then send a curl get request to /home

# Creating Logging Middleware

Middlware Documentation: [http://expressjs.com/en/guide/writing-middleware.html](http://expressjs.com/en/guide/writing-middleware.html)

A middleware is a method which is registered with the server to be called prior to all requests are received. 

The middleware should be passed the request and response object and also a method to be called to execute the next middleware.

The middleware has the opportunity to manipulate the headers, query params and or body prior to the actually request listeners receives it.

In addition the middleware can inhibit the request from actually proceeding if the content of the request does not meet the requirements for the request at that path.

### Create a middleware which will log the request method, path and all headers which were sent.

```javascript

const requestLogger = (request, response, next) => {
    
    const method = request.method
    const path = request.path
    const query = request.query
    const headers = request.headers

    console.log(`${method} ${path} ${JSON.stringify(query)}`)
    
    Object.keys(headers).forEach(k => {
        console.log(`${k}: ${headers[k]}`)
    })
    
    next();
}
```

We now need to register the middleware with the express server prior to the app starting to listen on the port.


```javascript
app.use(requestLogger);
```

Now run `curl localhost:3000/home` in the command line and you will see the following output.

```bash
GET /home
host: localhost:3000
user-agent: curl/7.61.0
accept: */
```

# Check Authorisation Header Middleware

So it can be that some requests require that a access  token of some sort be present within the headers and if it is not present then the user should receive a `401 Unauthorised` statusCode.

```javascript

const AuthorisationMiddleware = (req, res, next) => {

    /// check if the headers has a property of authorization
    /// if not then 
    if(!req.headers.authorization) {
        res.status(401).send({ message: "Unauthorised" })
    }

    next()
}

app.use([AuthorisationMiddleware, ...])

```

# Body Parser

### Installing the body-parser library

The body parser library is a middleware which will convert the form data to a javascript object without you having to do it.

```bash
npm install --save-dev body-parser
```

### Add the urlencoded middleware to express

```javascript
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
```

You can now access the form data as a javascript object directly through the `request.body` property.
