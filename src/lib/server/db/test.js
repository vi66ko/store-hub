// import { dataBaseConnectTo } from "./connectdb";
import sqlite3 from "sqlite3";
sqlite3.verbose()

function update(table) {
    let query = `UPDATE ${table} SET `


    // What about if accept integer or another format?
    return {
        set(fields) {
            let data = '';

            for (const properyName in fields) {
                data += `${properyName} = '${fields[properyName]}', `
            }
            data = data.slice(0, -2); // Remove trailing comma ','
            query += data

            return {
                /**
                 * Here I can give a list of example for all way of where condition
                 * @param {*} condition 
                 */
                where(condition) {
                    query += ` WHERE ${condition};`
                    console.log(query)

                    return {
                        like() { },
                        equalTo() { }
                    }
                }
            }
        }
    }
}



// update('user').set({ name: 'newName', password: 'newPasss' }).where("email = email@mail.co")
// update('user')
//     .set({
//         name: 'newName',
//         password: 'newPasss'
//     })
//     .where("email")
//     .equalTo()



function handelRun(error) {
    if (error) {
        reject({
            isSuccessful: false,
            error: {
                message: error.message,
                code: error.code,
                errorNum: error.errno,
            }
        })
    }

    resolve({
        isSuccessful: true,
        message: "Success!",
        data: "fdasfa"

    })
}


function storeHubDataBase(filePath = './src/lib/server/db/store_hub.db') {

    function connect() {
        const db = new sqlite3.Database(filePath, error => {
            if (error) console.error(error);
        })

        return db;
    }

    return {
        users: {
            table: 'Users',
            add(username, email, password) {
                let db = connect();

                return new Promise((resolve, reject) => {
                    const query = `INSERT INTO ${this.table} (name, email, password) VALUES( ?, ?, ?)`

                    db.run(query, [username, email, password], function (error) {
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
            getHim(id) {
                return "user"
            }


        },
        sessions: {
            /**
             * 
             * @param {string} $email 
             * @param {BufferSource} $initializationVector 
             * @param {number} $date 
             * @param {number} $expireDate 
             * @returns {Promise<{ isSuccessful: boolean,[ error: { message: string, code: string, errorNum: number }] }>}
             */
            async add($email, $initializationVector, $date, $expireDate) {
                const hasRecord = await this.getIt($email);

                if (hasRecord.isSuccessful) {
                    this.removeIt($email)
                }

                return new Promise((resolve, reject) => {
                    const db = connect()
                    const query = 'INSERT INTO Sessions (email, initialization_vector, date, expire_date) VALUES($email, $initializationVector, $date, $expireDate)'

                    db.run(query, { $email, $initializationVector, $date, $expireDate }, function (error) {
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
            /**
             * 
             * @param {string} $email 
             * @returns {Promise<{ isSuccessful: boolean, data: {email: string, initializaionVetor: BufferSource, data:number, expire_date: number }}>}
             */
            getIt($email) {
                return new Promise((resolved, reject) => {
                    const db = connect();
                    const query = 'SELECT * FROM Sessions WHERE email = $email'

                    db.get(query, { $email }, function (error, row) {
                        if (error) {
                            console.log(error)
                            reject({ isSuccessful: false })
                        }
                        resolved({ isSuccessful: true, data: row })
                    })
                })
            },
            /**
             * 
             * @param {string} $email 
             * @returns {Promise<{ isSuccessful: boolean }>}
             */
            removeIt($email) {
                return new Promise((resolve, reject) => {
                    const db = connect();
                    const query = 'DELETE FROM SESSIONS WHERE email = $email';


                    db.run(query, { $email }, function (error) {
                        if (error) {
                            reject({ isSuccessful: false });
                        }

                        if (!this.changes) {
                            reject({ isSuccessful: false });
                        }

                        resolve({ isSuccessful: true });

                    })



                })
            }
        },

        log: {

        },
        products: {
            add() {

            },
            remove(id) {

            }
        }

    }

}

// db.user.add
// db.user.getHim()

export default storeHubDataBase();


// let test = await db.user.add('email@mail.co', 'password');
// console.log(test);
/**
 * what to return
 * {isSuccessful: true| false}
 *
 */

// let see = await db.sessions.add('email5@example.com', 2, 111, 112).catch((error) => console.log(error));
let see = await db.sessions.getIt('email5@example.com').catch((error) => error);
console.log("seeseeseesee");
console.log(see);






