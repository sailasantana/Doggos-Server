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


    //GET tests
    context ('Given there are spots saved in the db', () => {
      const testDashboard = createDashboardArray();
      const testUsers = createUsersArray();
      const validUser = testUsers[0];

      console.log(testUsers)
              
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
      
      
      it ('GET api/:user_name/dashboard responds 200 and with all spots saved by user', () => {
          return supertest(app)
          .get(`/api/${validUser.user_name}/dashboard`)
          .set('session_token', helpers.makeAuthHeader(validUser))
          .expect(200)

      });
    })


    //POST TESTS
    describe (`POST api/:user_name/dashboard`, () => {
        const testDashboard = createDashboardArray();
        const testUsers = createUsersArray();
        const testUser = testUsers[0];


      const requiredFields = ['title', 'doggoaddress'];

      requiredFields.forEach(field => {
          const newSpot = {
            title: 'Test title',
            doggoaddress: 'Test address',
            user_name: `${testUser.user_name}`
        };

          it (`Responds with 400 and an error message when the ${field} is missing'`, () => {
              delete newSpot[field]

              return supertest(app)
                  .post(`/api/${testUser.user_name}/dashboard`)
                  .set('session_token', helpers.makeAuthHeader(testUser))
                  .send(newSpot)
                  .expect(400, {
                      error: { message: `Missing ${field} in request body`}
                  })
          });
      });



  });

});