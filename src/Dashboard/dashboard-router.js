const express = require('express')
const DashboardRouter = express.Router()
const bodyParser = express.json()
const { DashboardService } = require('./dashboard-service')
const app = require('../app')


DashboardRouter
    .route('/:user_name/dashboard')
    .get((req,res,next) => {

         let {user_name} = req.params

        if(!user_name){
            return res.status(404).json({error:{
                message: `User Not Found`
            }})
        }

        DashboardService.getBoard(
            req.app.get('db'),
            req.params.user_name

        )
        .then( dashboard => {
            return res.status(200).json(dashboard)
        })
        .catch(next);

    })
    .post(bodyParser, (req,res,next) => {

       const {title, doggoaddress} = req.body
       const  user_name  = req.params.user_name

       const business = { title, doggoaddress, user_name }


        for (const [key,value] of Object.entries(business)){
            if(value == null){
                return res.status(400).json({error:{
                    message: `Missing ${key} in request body`
                }});
            }
        }  
        DashboardService.postToBoard(
            req.app.get('db'),
            business
        )
        .then(business => {
            return res
                        .status(201)
                        .json(business)
                        
        })
        .catch(next);
       }
    )
    
    
    DashboardRouter
    .route('/:user_name/dashboard/:id')
    .delete((req,res,next) => {
        
        const {id} = req.params

        if(!id){
            return res.status(404).json({error:
            {message:  'ID does not exist'}})
        }

        DashboardService.deleteFromBoard(
            req.app.get('db'),
            req.params.id
        )
        .then(business => {
            return res.status(204).end()
        })
        .catch(next);

    })

    module.exports = DashboardRouter;