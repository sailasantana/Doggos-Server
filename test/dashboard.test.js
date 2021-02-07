const {expect} = require('chai');
const knex = require('knex');
const app = require('../src/app');
const {createDashboardArray} = require('./dashboard-fixtures');
const {createUsersArray} = require('./user-fixtures');
const helpers = require('./test-helpers');
const { before } = require('mocha');

describe ('Dashboard Endpoints', function() {
    let db;

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        });
        app.set('db', db)
    });

    after('disconnect from db', () => db.destroy());

    before('clean the first table', () => db.raw('TRUNCATE TABLE userdashboard RESTART IDENTITY;'));

    before('clean the second table', () => db('doggouser').delete());

    afterEach('cleanup first table', () => db.raw('TRUNCATE TABLE userdashboard RESTART IDENTITY;'))

    //afterEach('cleanup second table', () => db('doggouser').delete());

    //GET tests
    context ('Given there are spots saved in the db', () => {
      const testDashboard = createDashboardArray();
      const testUsers = createUsersArray();
      const validUser = testUsers[0];
              
      beforeEach('insert test users', () => {
        return db
            .into('doggouser')
            .insert(testUsers)

      })


      
      beforeEach('insert dashboard spots', () => {
          return db
          .into('userdashboard')
          .insert(testDashboard)
      });
      

      const expectedSpots = testDashboard.filter(spot => spot.user_name === validUser.user_name);
      console.log(expectedSpots)
      
      it ('GET api/:user_name/dashboard responds 200 and with all spots saved by user', () => {
          return supertest(app)
          .get(`/api/${validUser.user_name}/dashboard`)
          .set('session_token', helpers.makeAuthHeader(validUser))
          .expect(200, expectedSpots)

      });
    })


    //POST TESTS
    describe (`POST api/:user_name/dashboard`, () => {
        const testDashboard = createDashboardArray();
        const testUsers = createUsersArray();
        const testUser = testUsers[0];
                
        beforeEach('insert test users', () => {
          return db
              .into('doggouser')
              .insert(testUsers)
  
        })
     
        beforeEach('insert dashboard spots', () => {
            return db
            .into('userdashboard')
            .insert(testDashboard)
        });

        after(() => db.destroy())


      const newSpot = {
          title: 'Test title',
          doggoaddress: 'Test address',
          user_name: `${testUser.user_name}`
      };

      it ('Creates a new spot in dasboard, responds with 201', () => {
          return supertest(app)
              .post(`/api/${testUser.user_name}/dashboard`)
              .set('session_token', helpers.makeAuthHeader(testUser))
              .send(newSpot)
              .expect(201)
              .expect(res => {
                  expect(res.body.title).to.eql(newSpot.title)
                  expect(res.body.doggoaddress).to.eql(newSpot.doggoaddress)
                  expect(res.body.user_name).to.eql(newSpot.user_name)
                  expect(res.body).to.have.property('id')
                  expect(res.body).to.have.property('date_created')
                  expect(res.body).to.have.property('date_modified')

              })
           
      });

      const requiredFields = ['title', 'doggoaddress', 'user_name'];

      requiredFields.forEach(field => {
          const newSpot = {
            title: 'Test title',
            doggoaddress: 'Test address',
            user_name: `${testUser}`
        };

          it (`Responds with 400 and an error message when the ${field} is missing'`, () => {
              delete newSpot[field]

              return supertest(app)
                  .post(`/api/${testUser}/dashboard`)
                  .set('session_token', helpers.makeAuthHeader(testUser))
                  .send(newSpot)
                  .expect(400, {
                      error: { message: `Missing ${field} in request body`}
                  })
          });
      });

      //DELETE TESTS
      describe (`DELETE 'api/:user_name/dashboard/:id'`, () => {
        
        context('Given there are saved spots in db', () => {
            const testDashboard = createDashboardArray();
            const testUsers = createUsersArray();
                    
            beforeEach('insert test users', () => {
                return db
                    .into('doggouser')
                    .insert(testUsers)
        
              })
            
            beforeEach('insert saved spots', () => {
                return db
                .into('userdashboard')
                .insert(testDashboard)
            })

            it ('Responds with 204 and removes the saved spot', () => {
                const idToDelete = 1; 
                const testUser = testUsers[0]

                const expectedEntries = testDashbaord.filter(spot => spot.id !== idToDelete);

                return supertest(app)
                    .delete(`/api/${testUser.user_name}/dashboard/${idToDelete}`)
                    .set('session_token', helpers.makeAuthHeader(testUser))
                    .expect(204)
                    .then(res => {
                        supertest(app)
                            .get(`/api/${testUser.user_name}/dashboard`)
                            .expect(expectedEntries)
                    });
            });


        });
    });


  });

});