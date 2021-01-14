const express = require('express')
const DashboardRouter = express.Router()
const bodyParser = express.json()
const { DashboardService } = require('dashboard-router')
const app = require('../app')


DashboardRouter
    .route('/:username/dashboard')
    .get((req,res,next) => {

        const {username} = req.params

        if(!username){
            return res.status(404).json({error:{
                message: `User Not Found`
            }})
        }

        DashboardRouter(
            req.app.get('db'),
            req.params.username

        )
        .then( dashboard => {
            return res.status(200).json(dashboard)
        })
        .catch(next);

    })
    .post(bodyParser, (req,res,next) => {

        const title = req.body.title
        const doggoAddress = req.body.address

        const business = { title, doggoAddress }

        for (const [key,value] of Object.entries(business)){
            if(value == null){
                return res.status(400).json({error:{
                    message: `Missing ${key} in request body`
                }});
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

    })
    
    
    DashboardRouter
    .route('/:username/dashboard/:id')
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