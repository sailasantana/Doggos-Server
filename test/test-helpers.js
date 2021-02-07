const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../src/config');


function makeAuthHeader(user, secret = JWT_SECRET) {

    const sessionObj = {
        firstname: user.first_name,
        lastName: user_last_name,
        username: user_user_name
        }

    const session_token = jwt.sign(
        sessionObj, secret, {expiresIn : '15m'}   
    )
    return session_token;
}


function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
        ...user,
        password: bcrypt.hashSync(user.password, 1)
    }))
    return db.into('doggoUser').insert(preppedUsers)
     
}

module.exports = { makeAuthHeader,seedUsers }