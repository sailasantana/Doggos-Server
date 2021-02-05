function createUsersArray() { 
    return [
        {
            date_created: '2021-01-24T16:28:32.615Z',
            date_modified: '2021-01-24T16:28:32.615Z',
            first_name:'hello',
            last_name:'456',
            user_name: 'hello456',
            password: '@FakePassword456'
        },
        {
            date_created: '2021-01-27T16:28:32.615Z',
            date_modified: '2021-01-24T16:28:32.615Z',
            first_name:'bye',
            last_name:'789',
            user_name: 'bye789',
            password: '@FakePassword789'

        },
        {
            date_created: '2021-01-29T16:28:32.615Z', 
            date_modified: '2021-01-24T16:28:32.615Z',
            first_name:'howdy',
            last_name:'123',
            user_name: 'howdy123',
            password: '@FakePassword123'
        },
    ];
}

module.exports = {
    createUsersArray
}