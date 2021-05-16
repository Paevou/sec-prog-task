const userDB = require('./userDB.js');

const testUser = {
    email: "test@test.com",
    firstname: "Test",
    lastname: "Tester",
    pw_hash_salt: "testHash"
}
beforeEach( () => {
    return userDB.resetDB()
    .then(() => {
        
        return userDB.addUser(testUser)
        .then(() => {
            // console.log("Added");
            return;
        })
        .catch((err) => {
            console.error("Error in addition: ", err);
        })
    })
    .catch((err) => {
        console.error("Error in reset: ", err);
    })
});

afterAll(done => {
    done()
});

describe('SQL injection tests', () => {   

    test('SQL injection attack 200 or 1=1', () => {
        return userDB.getUserByEmail('200 or 1=1').then(data => {
            expect(data).toEqual({});
        });
    });
});

describe('database operations', () => {  

    test('User added', () => {
        return userDB.addUser({
                email: testUser.email + "add", 
                firstname: testUser.firstname + "add", 
                lastname: testUser.lastname + "add", 
                pw_hash_salt: testUser.pw_hash_salt + "add"
                })
        .then(data => {
            expect(data).toEqual("OK");
        });
    });

    test('Same email addition error', () => {
        return userDB.addUser({
            email: testUser.email + "add", 
            firstname: testUser.firstname + "add", 
            lastname: testUser.lastname + "add", 
            pw_hash_salt: testUser.pw_hash_salt + "add"
            })
    .then(() => {
        return userDB.addUser({
            email: testUser.email + "add", 
            firstname: testUser.firstname + "add", 
            lastname: testUser.lastname + "add", 
            pw_hash_salt: testUser.pw_hash_salt + "add"
            })
        .then(data => {
            expect(data).toBeInstanceOf(Error);
        });
    });
        
    });

    test('User found', () => {
        return userDB.getUserByEmail(testUser.email)
        .then(data => {
            expect(data).toEqual(testUser);
        });
    });

    test('User not found', () => {
        return userDB.getUserByEmail(testUser.email + "no")
        .then(data => {
            expect(data).toEqual({});
        });
    });

    test('User updated', () => {
        return userDB.updateUser(testUser.email, {
                firstname: testUser.firstname + "update",
                lastname: testUser.lastname + "update",
                pw_hash_salt: testUser.pw_hash_salt + "update"})
        .then(data => {
            expect(data).toEqual("OK");
        });
    });

    test('User email not found -> not updated', () => {
        return userDB.updateUser(testUser.email + "no", {
                firstname: testUser.firstname + "update",
                lastname: testUser.lastname + "update",
                pw_hash_salt: testUser.pw_hash_salt + "update"})
        .then(data => {
            expect(data).toBeInstanceOf(Error);
        });
    });

    test('User removed', () => {
        return userDB.removeUser(testUser.email)
        .then(data => {
            expect(data).toEqual("OK");
        });
    });
})
