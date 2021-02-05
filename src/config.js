module.exports = {
    PORT: process.env.PORT || 8040,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://saila@localhost/doggoUser',
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://saila@localhost/doggoUser-test',
    JWT_SECRET: process.env.JWT_SECRET || 'MY_SECRET_KEY'

}