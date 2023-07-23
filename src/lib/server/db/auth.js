import sqlite3 from "sqlite3";
import { setUpSQLightErrorData, logError } from "$lib/gadgetBag";

sqlite3.verbose()

// If there is not table users it will throw an error
// Table schema
// CREATE TABLE IF NOT EXISTS Users(
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
        /**
         * 
         * @param {string} $email 
         * @param {string} $password 
         * @returns {Promise<{error: Error | null}>}
         */
        async signIn($email, $password) {
            // check if the user exist then add
            // const hasUers = await this.isUserExist(email)


            return new Promise((resolve, reject) => {
                const db = connect();
                const query = `SELECT * FROM Users WHERE email = $email AND password = $password`

                db.get(query, { $email, $password }, function (error, row) {
                    if (error) {
                        logError(error)
                        return;
                    }

                    if (row) {
                        resolve({ error: null, })
                    } else {
                        reject({
                            error:
                                { message: 'Invalid Credentials' }
                        })
                    }
                })
            })

        },
        /**
         * 
         * @param {string} $name 
         * @param {string} $email 
         * @param {string} $password 
         * @returns {Promise<{ isSuccessful: boolean, error: object}>} 
         */
        singUp($name, $email, $password) {
            return new Promise((resolve, reject) => {

                const db = connect()

                // add it to the auth db 
                // and 
                // To storeHub db

                let query = `INSERT INTO Users (name, email, password) VALUES($name, $email, $password)`


                db.run(query, { $name, $email, $password }, function (error) {
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

                const storeHubDbPath = './src/lib/server/db/store_hub.db';
                const storeHubDb = connect(storeHubDbPath)

                query = 'INSERT INTO Users (name, email, password) VALUES($name, $email, $password)'
                storeHubDb.run(query, { $name, $email, $password },
                    (error) => {
                        console.error(error)
                    }
                )



            });
        },
        isUserExist(email) {
            return new Promise((resolve, reject) => {
                const db = connect();
                const query = `SELECT EXISTS(SELECT 1 FROM Users WHERE email = ?) AS hasUser`

                db.get(query, [email], function (error, row) {
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
                    if (row.hasUser) resolve(true)

                    resolve(false)
                })

            });
        }

    }
}

export default authDataBase()


let test = new Promise((resolve, reject) => {
    console.log('First line')
    resolve('resolved')
    console.log('Second line')
    reject('rejected')

})
