const dotenv = require('dotenv').config({path: __dirname + "/.env"});
// Enables the psql queries to have parametrised identifiers for easy updating of the user fields
const format = require('pg-format');
const { Pool, Client } = require('pg');
// pools will use environment variables
// for connection information
// These values need to be set in .env
const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT
  });

/**
 * Adds a new user
 * @param {object} user 
 */
const addUser = function(user) {    
    const query_string = "INSERT INTO users(email, firstname, lastname, pw_hash_salt) VALUES($1, $2, $3, $4) RETURNING *";
    const values = [user['email'], user['firstname'], user['lastname'], user['pw_hash_salt']];
    return pool
        .query(query_string, values)
        .then(res => {
            if(res.rows.length == 0 ) {
                return "Addition Failed";
            }
            
            // console.log("user added");
            return "OK";
        })
        .catch(err => {
            console.error(err.stack);          
            return err;            
        })
}
/**
 * Updates user with userId to the given status
 * @param {varchar} email 
 * @param {object of pairs} info 
 */
const updateUser = function(email, info) {
    // TODO: 0 length object     )
    let query_string = "UPDATE users SET ";
    for(const [key, value] of Object.entries(info)) {
        query_string += format('%I=%L, ', key.toLowerCase(), value)
    }
    query_string = query_string.substr(0, query_string.length - 2);
    query_string += " WHERE email=$1 RETURNING *"
    
    const values = [email];
    return pool
        .query(query_string, values)
        .then(res => {
            if(res.rows.length == 0 ) {
                return "Update Failed";
            }
            // console.log("user updated");
            return "OK";
        })
        .catch(err => {
            console.error(err.stack);            
            return err;
        })
}
/**
 * Removes user with email
 * @param {integer} email 
 */
const removeUser = function(email) {
    const query_string = "DELETE FROM users WHERE email=$1 RETURNING *";
    const values = [email];
    return pool
        .query(query_string, values)
        .then(res => {
            // console.log("user removed");
            return "OK";
        })
        .catch(err => {
            console.error(err.stack);
            return err;
        })
}

/**
 * Gets a user with the email from database
 * @param {integer} email 
 */
const getUserByEmail = function(email) {    
    const query_string = "SELECT * FROM users WHERE email=$1";
    const values = [email];
    return pool
        .query(query_string, values)
        .then(res => {  
            if(res.rows.length == 0 ) {
                // console.log("No user by id");
                return {};
            }             
            return res.rows[0];
        })
        .catch(err => {
            console.error(err.stack);
            return err;
        })
}

/**
 * Gets all the users in database
 */
const getUsers = function() {
    const query_string = "SELECT * FROM users;";
    return pool
        .query(query_string)
        .then(res => {
            if(res.rows.length == 0 ) {
                // console.log("No users");
                return []
            }
            let users = []
            for(i=0; i<res.rows.length; i++) {
                users.push(res.rows[i])
            }
            // console.log("users fetched");
            return users;
        })
        .catch(err => {
            console.error(err.stack);           
            return err;
        })
}

/**
 * Initializes the database
 */
 const userDBInit = function () {
    // Set users database table   
    // TODO: Don't delete table after testing
    const user_table = `CREATE TABLE IF NOT EXISTS users (
        email VARCHAR PRIMARY KEY,
        firstname VARCHAR NOT NULL,
        lastname VARCHAR NOT NULL,
        pw_hash_salt VARCHAR NOT NULL
    );`;
    pool
        .query(user_table)
        .then(res => {
            // console.log("Table created/checked")

            // Test the functions and add some test data
            if(process.env.MODE=="dev") {   
                let test_data = {
                    email: "test@test.com",
                    firstName: "Test",
                    lastName: "Tester",
                    pw_hash_salt: "testHash"
                }
                addUser(test_data)
                .then( () => {
                    updateUser(test_data["email"], {firstName: "Test1", lastName: "Tester1"})
                    .then(() => {
                        test_data = {
                            email: "test2@test2.com",
                            firstName: "Test2",
                            lastName: "Tester2",
                            pw_hash_salt: "testHash2"
                        }
                        addUser(test_data)
                        .then(() => {
                            removeUser(test_data['email']);
                        })
                    })                            
                })                    
            }
        })
.catch(err => {console.error(err.stack)})
}


module.exports = {addUser, updateUser, removeUser, getUserByEmail, getUsers, userDBInit}
