const dotenv = require('dotenv').config({path: __dirname + "/.env"});

const format = require('pg-format');
const { InsufficientStorage } = require('http-errors');
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

  dbInit();

/**
 * Adds a new user
 * @param {object} user 
 */
const addUser = function(user) {    
    const query_string = "INSERT INTO users(email, f_name, l_name, pw_hash, pw_salt) VALUES($1, $2, $3, $4, $5) RETURNING *";
    const values = [user['email'], user['f_name'], user['l_name'], user['pw_hash'], user['pw_salt']];
    return pool
        .query(query_string, values)
        .then(res => {
            console.log("user added");
            return res;
        })
        .catch(err => {console.error(err.stack)})
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
            console.log("user updated");
            return res;
        })
        .catch(err => {console.error(err.stack)})
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
            console.log("user removed");
            return res;
        })
        .catch(err => {console.error(err.stack)})
}

/**
 * Gets a user with the email from database
 * @param {integer} email 
 */
const getUserById = function(email) {
    const query_string = "SELECT * FROM users WHERE email=$1";
    const values = [email];
    return pool
        .query(query_string, values)
        .then(res => {  
            if(res.rows.length == 0 ) {
                console.log("No user by id");
                return {}
            }  
            console.log("user fetched");
            
            return res.rows[0]['data'];
        })
        .catch(err => {console.error(err.stack);})
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
                console.log("No users");
                return {}
            }
            let users = []
            for(i=0; i<res.rows.length; i++) {
                //users.push(res.rows[i]['data'])
            }
            console.log("users fetched");
            return users;
        })
        .catch(err => {console.error(err.stack);})
}

/**
 * Initializes the database
 */
 function dbInit() {
    // Set users database table   
    const user_table = `CREATE TABLE IF NOT EXISTS users (
        email VARCHAR PRIMARY KEY,
        f_name VARCHAR NOT NULL,
        l_name VARCHAR NOT NULL,
        pw_hash VARCHAR NOT NULL,
        pw_salt VARCHAR NOT NULL
    );`;
    const del_table = `DROP TABLE IF EXISTS users;`;
    pool
        .query(del_table)
        .then(res => {
            console.log("Table droppped if existed");
            pool
                .query(user_table)
                .then(res => {
                    console.log("Table created/checked")

                    // Test the functions and add some test data
                    if(process.env.MODE=="dev") {   
                        let test_data = {
                            email: "test@test.com",
                            f_name: "Test",
                            l_name: "Tester",
                            pw_hash: "testHash",
                            pw_salt: "testSalt"
                        }
                        addUser(test_data)
                        .then( () => {
                            updateUser(test_data["email"], {f_name: "Test1", l_name: "Tester1"})
                            .then(() => {
                                test_data = {
                                    email: "test2@test2.com",
                                    f_name: "Test2",
                                    l_name: "Tester2",
                                    pw_hash: "testHash2",
                                    pw_salt: "testSalt2"
                                }
                                addUser(test_data)
                                .then(() => {
                                    removeUser(test_data['email']);
                                })
                            })
                            
                        })
                    
                    }
                })
        .catch(err => console.error(err.stack))
        })
        .catch(err => {console.error(err.stack);})
    
    
      

}

module.exports = {addUser, updateUser, removeUser, getUserById, getUsers}
