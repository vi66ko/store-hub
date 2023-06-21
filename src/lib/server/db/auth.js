import sqlite3 from "sqlite3"



// Table schema
// CREATE TABLE IF NOT EXISTS Users(
//     name TEXT NOT NULL CHECK (LENGTH(name) > 0),
//     email TEXT PRIMARY KEY NOT NULL CHECK (LENGTH(email) > 0),
//     password TEXT NOT NULL CHECK (LENGTH(password) > 0)
// );


function authDataBase() {

    function connect(filePath = './src/lib/server/db/auth.db') {
        const db = new sqlite3.Database(filePath, error => {
            if (error) console.error(error)
        })

        return db
    }

    return {
        signIn(email, password) {
            // check if the user exist then add
            // create a session

        },
        singUp({ username, email, password }) {
            return new Promise((resolve, reject) => {

                const db = connect()

                // add it to the auth db 
                // and 
                // To storeHub db
                const query = `INSERT INTO Users (name, email, password) VALUES($username, $email, $password)`
                console.log('I am inside bro.')
                db.run(query, { username, email, password }, function (error) {
                    // 
                    if (error) {
                        reject({
                            isSuccessful: false,
                            error: {
                                message: error.message,
                                code: error.code,
                                errorNum: error.errno
                            }
                        })
                    }

                    resolve({ isSuccessful: true })
                })

            })




        },
        isUserExist(email) {
            // 
        }

    }
}

export default authDataBase()