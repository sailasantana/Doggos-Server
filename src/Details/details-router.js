const express = require('express')
const DetailsRouter = express.Router()
const bodyParser = express.json()
const fetch = require('node-fetch')


function formatQueryParams(params){
    const queryItems = Object.keys(params)
                    .map(key => `${(key)}=${(params[key])}`)
    return queryItems.join('&');
}

function getPlaces(place_id){
return   {
    key: process.env.KEY, 
    fields: "name,reviews,website,formatted_phone_number",
    place_id : place_id
 }
}

DetailsRouter
    .route('/details/:place_id')
    .get( (req,res,next) => {

        const { place_id } = req.params;


       
        const baseUrl = 'https://maps.googleapis.com/maps/api/place/details/json'
        const key = process.env.KEY



        const params = getPlaces(place_id)
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



        module.exports = DetailsRouter;


      
    
  





