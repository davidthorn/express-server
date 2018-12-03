const express = require('express');
const bodyParser = require('body-parser')

const app = express();
app.use(bodyParser.urlencoded({ extended: true }))

const AuthorisationMiddleware = (req, res, next) => {

    if(!req.headers.authorization && !req.headers.authorisation) {
        res.status(401).send({ message: "Unauthorised" })
        return res.end()
    }

    next()
}

const requestLogger = (req, res, next) => {
    
    if(req.method === "POST") {
        return next()
    }

    const method = req.method
    const path = req.path
    const query = req.query

    const end = res.end

    res.end = (chunck, encoding) => {
        console.log(`${method} ${path} ${JSON.stringify(query)} ${res.statusCode}`)
    
        Object.keys(req.headers).forEach(k => {
            console.log(`${k}: ${req.headers[k]}`)
        })
       
        res.end = end
        res.end(chunck, encoding)
    }
    
    next();
}


app.use([requestLogger, AuthorisationMiddleware ]);

app.get('/home' , (request, response) => {
    console.log(request.body)
    response.status(200).send('Hello world')
})

app.post('/home' , (request, response) => {
    console.log(request.body)
    response.status(200).send('Hello world')

    
})

app.listen(3000, () => {
    console.log('listening')
});