
const express = require('express')
const bodyParser = express.json()
const LoginRouter = express.Router()
const { LoginService } = require('./login-service')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
//const db = require('../server')
const app = express();



LoginRouter
    .route('/login')
    .post(bodyParser, (req,res,next) => {
    
    const { user_name, password } = req.body;
    const user = { user_name };


    LoginService.getUser(req.app.get('db'), user)
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


        bcrypt.compare(password, result.password)
            .then( result => {
                if(result){
                    jwt.sign(sessionObj, 'secret', {expiresIn : '75m'}, (err, token) => {
                        if(!err){
                            return res.status(201).json({token})
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
    .route('/validate')
    .get(( req, res ) => {
        const { session_token } = req.headers;
        console.log( req.headers );
        jwt.verify( session_token, 'secret', ( err, tokenDecoded ) => {
            if( err ){
                res.statusMessage = "Not authorized.";
                return res.status( 401 ).end();
            }
            else{
                console.log( tokenDecoded );
                return res.status( 200 ).json({
                    message : `Welcome back ${tokenDecoded.firstName} ${tokenDecoded.lastName}!`
                });
            }
        });
    });

 LoginRouter
    .route('/signup')
    .post(bodyParser, (req,res,next) => {
        const { user_name, password , first_name, last_name } = req.body

        for (const field of ['user_name', 'password', 'first_name', 'last_name']) {
            if (!req.body[field]) {
                return res.status(400).json({error: `Missing '${field}' in request body.`});
            }
        }

        const passwordChecker =  LoginService.validatePassword(password);

        if (passwordChecker) {
            return res.status(400).json({error: passwordChecker});
        }

        LoginService.hasDuplicateUser(
            req.app.get('db'),
            user_name
        )
            .then(hasDuplicateUser => {
                if (hasDuplicateUser) {
                    return res.status(400).json({error: `Username already taken.`});
                }

                bcrypt.hash(password, 10)
                    .then( hashedPassword => {
                        const newUser = {
                            user_name,
                            password : hashedPassword,
                            first_name,
                            last_name
                        }

                LoginService.addUser(
                    req.app.get('db'), 
                    newUser
                )
                .then( result => {
                    return res.status(201).json( result )
                })
                .catch(next);
        })
    })

})



module.exports = LoginRouter;