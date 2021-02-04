const app = require('../src/app')

describe('App', () => {
  it('GET /api responds with 200 and "Welcome to DoggosWelcome API!"', () => {
    return supertest(app)
      .get('/')
      .expect(200, 'Welcome to the DoggosWelcome API!')
  })
})