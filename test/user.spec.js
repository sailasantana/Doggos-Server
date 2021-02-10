const knex = require('knex');
const bcrypt = require('bcrypt');
const app = require('../src/app');
const {createUsersArray} = require('./user-fixtures');
const helpers = require('./test-helpers');
const supertest = require('supertest');
const { expect } = require('chai');


describe ('User Endpoints', function() {
    let db;

    const testUsers = createUsersArray();
    const testUser = testUsers[0]

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy());

    afterEach('cleanup', () => db.raw('TRUNCATE TABLE userdashboard RESTART IDENTITY;'));

    afterEach('cleanup', () => db('doggouser').delete());

    describe ('POST /api/signup', () => {
        context ('User Validation', () => {
    
            

            const requiredFields = ['first_name', 'last_name','user_name', 'password'];

            requiredFields.forEach(field => {
                const registerAttempt = {
                    user_name: 'test_user_name',
                    password: 'A@test password',
                    first_name: 'test'
                }

                it (`Responds with 400 when required ${field} is missing`, () => {
                    delete registerAttempt[field]

                    return supertest(app)
                        .post('/api/signup')
                        .send(registerAttempt)
                        .expect(400, {error: `Missing '${field}' in request body.`})
                })
            })

            it ('Responds 400 when password is less than 8 characters', () => {
                const shortPassword = {
                    user_name: 'test user_name',
                    password: '1234567',
                    first_name: 'test',
                    last_name: 'test'
                }

                return supertest(app)
                    .post('/api/signup')
                    .send(shortPassword)
                    .expect(400, {error: `Password must be longer than 8 characters.`})
            })

            it ('Responds 400 when password is less than 72', () => {
                const longPassword = {
                    user_name: 'test user_name',
                    password: '*'.repeat(73),
                    first_name: 'test',
                    last_name: 'test'
                }

                return supertest(app)
                    .post('/api/signup')
                    .send(longPassword)
                    .expect(400, {error: `Password must be less than 72 characters.`})
            })

            it ('Responds 400 when password begins with a space', () => {
                const spacePassword = {
                    user_name: 'test user_name', 
                    password: ' 123ses4meStreet!',
                    first_name: 'test',
                    last_name: 'test'
                }

                return supertest(app)
                    .post('/api/signup')
                    .send(spacePassword)
                    .expect(400, {error: `Password must not start or end with a space.`})
            })

            it ('Responds 400 when password ends with a space', () => {
                const spacePassword = {
                    user_name: 'test user_name', 
                    password: '123ses4meStreet! ',
                    first_name: 'test',
                    last_name: 'test'


                }

                return supertest(app)
                    .post('/api/signup')
                    .send(spacePassword)
                    .expect(400, {error: `Password must not start or end with a space.`})
            })

            it ('Responds 400 when password is not complex enough', () => {
                const basicPassword = {
                    user_name: 'test user_name',
                    password: '11AAaabb',
                    first_name: 'test',
                    last_name: 'test'
                }

                return supertest(app)
                    .post('/api/signup')
                    .send(basicPassword)
                    .expect(400, {error: `Password must contain 1 upper case letter, lower case letter, number, and special character.`})
            })

        })
    })

    describe ('Successful user POST login request', () => {

        const testUsers = createUsersArray();
        const testUser = testUsers[0];
                
             
        beforeEach('insert test users', () => {
           return helpers.seedUsers(db, testUsers)
        })



        it ('Responds 201 and generates token', () => {
            const user = {
                user_name: testUser.user_name,
                password: testUser.password
            }

            return supertest(app)
                .post('/api/login')
                .send(user)
                .expect(201)
                .expect(res => {
                    expect(res.body).to.have.property('token')
                
                })
              
        })
    }) 

})
