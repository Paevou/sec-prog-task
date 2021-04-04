const userDB = require('./userDB.js');

beforeEach(() => {
    return userDB.userDBInit();
});

afterAll(done => {
    done()
});

test('SQL injection attack 200 or 1=1', () => {
    return userDB.getUserByEmail('200 or 1=1').then(data => {
        expect(data).toBe('404: Not Found');
    });
});