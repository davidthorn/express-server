const express = require('express');

const app = express();

const AuthorisationMiddleware = (req, res, next) => {

    if(!req.headers.authorization && !req.headers.authorisation) {
        res.status(401).send({ message: "Unauthorised" })
        return res.end()
    }

    next()
}

const requestLogger = (req, res, next) => {
    
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
    response.status(200).send('Hello world')
})

app.listen(3000, () => {
    console.log('listening')
});