const LoginService = {
    getUser(db, user){
        return db   
            .select('*')
            .from('doggoUser')
            .where(user)
            .then( result => {
                return result[0]
            })
    },
    addUser(db, newUser){
        return db('doggoUser')
            .insert(newUser)
            .returning('*')
            .then(result => {
                return result[0]
            })

    }

}

module.exports = { LoginService }