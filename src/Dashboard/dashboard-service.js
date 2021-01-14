const DashboardService = {

    getBoard(db,username){
        return db
            .select('*')
            .from('user-board')
            .where({username})
            .returning('*')
            

    },

    postToBoard(db, business){
        return db   
            .insert(business)
            .into('user-board')
            .returning('*')
            .then(result => {
                return result[0]
            })

    },

    deleteFromBoard(db,id){
        return db   
            .where({id})
            .delete()
    }

}

module.exports = { DashboardService }