const express = require('express')
const SearchRouter = express.Router()
const bodyParser = express.json()
const fetch = require('node-fetch')
const zipcodes = require('zipcodes')

// zip = 'a'
// let example = zipcodes.lookup(zip)
// console.log(example)

function formatQueryParams(params){
    const queryItems = Object.keys(params)
                    .map(key => `${(key)}=${(params[key])}`)
    return queryItems.join('&');
}

function getPlaces(zip, type){
return   {
    key: process.env.KEY, 
    query : `dog friendly ${type} in zip code ${zip}`
 }
}

SearchRouter
    .route('/search')
    .post(bodyParser, (req,res,next) => {

        const { zip, type } = req.body;
        const baseUrl = 'https://maps.googleapis.com/maps/api/place/textsearch/json'
        const key = process.env.KEY

        if(zipcodes.lookup(req.body.zip) == undefined){
            
            res.statusMessage = "Invalid Zip Code"
            return res.status(401).end()
        }

        else { 
            const params = getPlaces(zip, type)
             
        }

        const params = getPlaces(zip, type)


        const queryString = formatQueryParams(params)
        //console.log(queryString)
        const url = baseUrl + '?' + queryString;
            console.log(url)
            fetch(url)
                .then(response => {
                    if(response.ok){
                        return response.json()
                    }
                    throw new Error(response.statusText); 
                })
                .then(responseJson => {
                    return res.status(200).json(responseJson)
                })
                .catch(err => {
                    console.log(err)
                })

        }



    )



        module.exports = SearchRouter;


      
    
  



