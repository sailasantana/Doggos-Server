const DashboardService = {

    getBoard(db,user_name){
        return db
            .select('*')
            .from('userdashboard')
            .where({user_name})
            

    },

    postToBoard(db, business){
        return db   
            .insert(business)
            .into('userdashboard')
            .returning('*')
            .then(result => {
                return result[0]
            })

    },
    

    deleteFromBoard(db,id){
        return db  
            .select('*')
            .from('userdashboard')               
            .where({id})
            .delete()
    }

}

module.exports = { DashboardService }