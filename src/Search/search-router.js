const express = require('express')
const SearchRouter = express.Router()
const bodyParser = express.json()
const fetch = require('node-fetch')

//const STORE = require('../data.json')


function formatQueryParams(params){
    console.log(5)
    const queryItems = Object.keys(params)
                    .map(key => `${(key)}=${(params[key])}`)
    console.log(6)
    return queryItems.join('&');
}

function getPlaces(zip, type){
return   {
    key: process.env.key, 
    query : `dog friendly ${type} in zip code ${zip}`
 }
}

SearchRouter
    .route('/search')
    .get(bodyParser, (req,res,next) => {

        console.log(1)
        const { zip, type } = req.body;


        console.log(2)
       
        const baseUrl = 'https://maps.googleapis.com/maps/api/place/textsearch/json'
        //?key=AIzaSyAZ9e8yrmg_qJFoBB7Giz4ZKzQNPl7fDm4&query=dog  friendly bars in zip code 11201'
        const key = process.env.key

        console.log(3)


        const params = getPlaces(zip, type)
        const queryString = formatQueryParams(params)
        console.log(2)
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


      
    
  




    //     if(req.params.zip){

    //         let placesToReturn = [];

    //         for(i=0; i < STORE.results.length ; i++){

    //             let splitString = STORE.results[i].formatted_address.split(',')
    //             let zipFromStore = splitString[2].split(" ")[2]
    //             if(zipFromStore == zip){
    //                 placesToReturn.push(STORE.result[i]);

    //             }
    //             else return 'No dog-friendly businesses associated with that zip'
    //         } 
            
    //         return res.status(200).json(placesToReturn)
    //     }
    //     else return 'Zip is required!'
    


            
            //response = response.filter(zip => 

            //for (i=0; i < STORE.results.length; i++){

            //let zipAddress =  (STORE.results[i].formatted_address)[2].split(" ")[2]

            //if(zipAddress = zip){
                //return 
            //}


           // }
                
              
              //)