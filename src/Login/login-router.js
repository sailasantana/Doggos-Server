
const express = require('express')
const bodyParser = express.json()
const LoginRouter = express.Router()
const { LoginService } = require('./login-service')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const db = require('../server')
const app = express();



LoginRouter
    .route('/login')
    .post(bodyParser, (req,res,next) => {
    
    const { user_name, password } = req.body;
    const user = { user_name };


    LoginService.getUser(db, user)
    .then( result => {

        if(!result){
            res.statusMessage = "User does not exist"
            return res.status(404).end()
        }

        const sessionObj = {
            username : result.username,
            firstname : result.firstname,
            lastName : result.lastName
        }

        //console.log(sessionObj)

        bcrypt.compare(password, result.password)
            .then( result => {
                if(result){
                    jwt.sign(sessionObj, 'secret', {expiresIn : '1m'}, (err, token) => {
                        if(!err){
                            return res.status(200).json({token})
                        }
                        else {
                          res.statusMessage = "Something went wrong with token generation"
                          return res.status(406).end()}
                    })
                }
                else {
                    return res.status(401).json('Your credentials are invalid')
                }
            })
     })
     .catch(next)

})

LoginRouter
    .route('api/validate')
    .get( (req,res) => {
        const { session_token } = req.headers;
    // console.log(req.headers)

        jwt.verify(session_token, 'secret', (err, tokenDecoded) => {
            if(err){
            res.statusMessage = "Not Authoried"
            res.status(401).end()
        }
        else{
            //console.log( tokenDecoded )

            return res.status(200).json({
                message : 'Welcome back ${tokenDecoded.firstName}!'
            })
        }
    })
    })


 LoginRouter
    .route('api/signup')
    .post(bodyParser, (req,res,next) => {
        const { username, password , firstname, lastName } = req.body

        bcrypt.hash(password, 10)
            .then( hashedPassword => {
                const newUser = {
                    username,
                    password : hashedPassword,
                    firstname,
                    lastName
                }

                LoginService.addUser(
                    db, 
                    newUser
                )
                .then( result => {
                    return res.status(201).json( result )
                })
                .catch(next);
        })
})


module.exports = LoginRouter;