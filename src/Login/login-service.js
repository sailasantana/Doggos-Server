const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;
const xss = require('xss');


const LoginService = {
    getUser(db, user){
        return db   
            .select('*')
            .from('doggouser')
            .where(user)
            .then( result => {
                return result[0]
            })
    },
    addUser(db, newUser){
        return db('doggouser')
            .insert(newUser)
            .returning('*')
            .then(result => {
                return result[0]
            })

    },
    hasDuplicateUser(db, user_name) {
        return db('doggouser')
            .where({user_name})
            .first()
            .then(user => !!user);
    },
    validatePassword(password) {
        if (password.length < 8) {
            return `Password must be longer than 8 characters.`;
        }
        if (password.length > 72) {
            return `Password must be less than 72 characters.`;
        }
        if (password.startsWith(' ') || password.endsWith(' ')) {
            return `Password must not start or end with a space.`;
        }
        if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
            return `Password must contain 1 upper case letter, lower case letter, number, and special character.`;
        }
        return null;
    },
    serializeUser(user) {
        return {
            id: user.id,
            user_name: xss(user.user_name),
            date_created: new Date(user.date_created)
        };
    }

}

module.exports = { LoginService }