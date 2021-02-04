const bcrypt = require('bcrypt');


function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
        ...user,
        password: bcrypt.hashSync(user.password, 1)
    }))
    return db.into('doggoUser').insert(preppedUsers)
        .then(() => {
            db.raw(
                `SELECT setval('doggoUser_id_seq), ?)`,
                [users[users.length - 1].id]
            )
        })
}

module.exports = { seedUsers }