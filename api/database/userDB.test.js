const userDB = require('./userDB.js');

beforeEach(() => {
    return userDB.userDBInit();
});

afterAll(done => {
    done()
});

test('SQL injection attack 200 or 1=1', () => {
    return userDB.getUserByEmail('200 or 1=1').then(data => {
        expect(data).toEqual({});
    });
});

// With test data
test('User found', () => {
    return userDB.getUserByEmail('test@test.com').then(data => {
        console.log(data)
        expect(data).toEqual({
            email: 'test@test.com',
            firstname: 'Test1',
            lastname: 'Tester1',
            pw_hash_salt: 'testHash'
          });
    });
});