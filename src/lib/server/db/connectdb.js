import sqlite3 from 'sqlite3';

import { setUpSQLightErrorData, logError } from '$lib/gadgetBag';

sqlite3.verbose()


// atob("dsfsd")
// btoa('2fasdfa')

const db_store_hub = './src/lib/server/db/store_hub.db';
const tablesSchema = `
        CREATE TABLE IF NOT EXISTS Users(
            email TEXT PRIMARY KEY NOT NULL CHECK (LENGTH(email) > 0),
            name TEXT NOT NULL CHECK (LENGTH(name) > 0),
            password TEXT NOT NULL CHECK (LENGTH(password) > 0),
            role TEXT DEFAULT "admin",
            settings JSON
        );

        CREATE TABLE IF NOT EXISTS Products(
            rowid INTEGER PRIMARY KEY,
            barcode TEXT ,
            name TEXT NOT NULL CHECK (LENGTH(name) > 0),
            description TEXT,
            price REAL CHECK (LENGTH(price) > 0 ),
            category TEXT DEFAULT 'none'
        );


        CREATE TABLE IF NOT EXISTS Sells(
            sell_id INTEGER PRIMARY KEY NOT NULL,
            product_id INTEGER,
            seller_id INTEGER,
            sell_price REAL NOT NULL CHECK(LENGTH(sell_price) > 0),
            sell_date INTEGER NOT NULL CHECK(LENGTH(sell_date) > 0),
            FOREIGN KEY (product_id) REFERENCES  products(rowid),
            FOREIGN KEY (seller_id) REFERENCES user(email)
        );

        CREATE TABLE IF NOT EXISTS Sessions(
            session_id TEXT PRIMARY KEY NOT NULL CHECK(LENGTH(session_id) > 0),
            email TEXT NOT NULL CHECK(LENGTH(email) > 0),
            date DATE NOT NULL CHECK(LENGTH(date) > 0),
            expire_date DATE NOT NULL CHECK(LENGTH(expire_date) > 0),
            FOREIGN KEY (email) REFERENCES Users(email)
        );

        CREATE TABLE IF NOT EXISTS Brands(
            name TEXT PRIMARY KEY NOT NULL CHECK(LENGTH(name) > 0)
        );

        CREATE TABLE IF NOT EXISTS Categories(
            name TEXT PRIMARY KEY NOT NULL CHECK(LENGTH(name) > 0)
        );


    `;


(function initiateDataBase(/**@type {string} */ dbPath) {
    // the default SQLite db flag is sqlite.OPEN_READWRITE & sqlite.OPEN_CREATE
    const db = new sqlite3.Database(dbPath, (err) => {
        if (err) console.error(err.message); // log the error if any and exit gracefully
    })
    console.log('------------------------------------------------------------');
    console.log(`Connection with SQLIte: ${dbPath}`)
    console.log('has been established');
    console.log('------------------------------------------------------------');


    db.exec(tablesSchema,
        (error) => {
            //  runQuery(db);
            if (error) {
                console.log(error.message)
            } else {
                console.log('------------------------------------------------------------');
                console.log('If tables: Users, Products, Sells, Sessions did not exist now they DO!');
                console.log('------------------------------------------------------------');
            }

        }
    );
    db.close()
})(db_store_hub);




/**
 * 
 * @param {string} [filePath= './src/lib/server/db/store_hub.db'] default = './src/lib/server/db/store_hub.db'
 * 
 */
function connect(filePath = './src/lib/server/db/store_hub.db') {
    const db = new sqlite3.Database(filePath, err => {
        if (err) console.error(err.message)
    })

    console.log(`//=> Connection with SQLIte: ${filePath} has been established`)
    console.log('------------------------------------------------------------');

    return db
}


const users = {
    table: 'Users',
    /**
     * 
     * @param {string} username 
     * @param {string} email 
     * @param {string} password 
     * @returns 
     */
    add(username, email, password) {
        return new Promise((resolve, reject) => {
            let db = connect();
            const query = `INSERT INTO ${this.table} (name, email, password) VALUES( ?, ?, ?)`

            db.run(query, [username, email, password], function (error) {
                if (error) {
                    reject(setUpSQLightErrorData(error))
                    return;
                }

                if (!this.changes) {
                    reject({ isSuccessful: false })
                } else {
                    resolve({ isSuccessful: true })
                }

            })
        })
    },
    getHim(id) {
        console.log('Get him');

    },
    remove($email) {
        return new Promise((resolve, reject) => {
            const db = connect();
            const query = `DELETE FROM ${this.table} WHERE email = $email`


            db.run(query, { $email }, function (error) {
                if (error) {
                    logError(error)
                    return;
                }

                if (!this.changes) {
                    reject({ isSuccessful: false });
                } else {
                    resolve({ isSuccessful: true });
                }
            })
        })
    }


}
const sessions = {
    /**
     * I could add device so there can be many single sessions 
     * for an single device
     * @param {string} $email 
     * @param {string} $session_id 
     * @param {Date} $date 
     * @param {Date} $expireDate 
     * @returns {Promise<{ isSuccessful: boolean,[ error: { message: string, code: string, errorNum: number }] }>}
     */
    async add($email, $session_id, $date, $expireDate) {

        const hasRecord = await this.getByEmail($email).catch(error => error);

        if (hasRecord.isSuccessful) {
            await this.removeIt($email).catch(error => console.error(error))
        }

        return new Promise((resolve, reject) => {

            const db = connect();
            const query = 'INSERT INTO Sessions (email, session_id, date, expire_date) VALUES($email, $session_id, $date, $expireDate)'

            db.run(query, { $email, $session_id, $date, $expireDate }, function (error) {
                if (error) {
                    logError(error)
                    return;
                }

                if (this.changes) {
                    resolve({ isSuccessful: true })
                } else {
                    reject({ isSuccessful: false })
                }
            })
        })

    },
    /**
     * 
     * @param {string} $email 
     * @returns {Promise<{ isSuccessful: boolean, data: {email: string, data:number, expire_date: number }}>}
     */
    getByEmail($email) {
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
     * @param {string} $session_id 
     * @returns {Promise<{ isSuccessful: boolean, data: {email: string, data:number, expire_date: number }}>}
     */
    getBySessionId($session_id) {
        return new Promise((resolved, reject) => {
            const db = connect();
            const query = 'SELECT * FROM Sessions WHERE session_id = $session_id'

            db.get(query, { $session_id }, function (error, row) {
                if (error) {
                    console.log(error)
                    reject({ isSuccessful: false, data: null })
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
        // To DELETE a row I need to delete all dependencies(foreign key) as well
        return new Promise((resolve, reject) => {
            const db = connect();
            const query = 'DELETE FROM Sessions WHERE email = $email';


            db.run(query, { $email }, function (error) {
                if (error) {
                    reject(setUpSQLightErrorData(error));
                } else {

                    if (!this.changes) {
                        reject({ isSuccessful: false });
                    } else {
                        resolve({ isSuccessful: true });
                    }
                }

            })



        })
    }
}

const log = {

}
const products = {
    add() {
        // 
    },
    remove(id) {
        // 
    }
}

const brands = {
    __tableName: 'Brands',
    /**
     * 
     * @param {string} $brandName 
     * @returns 
     */
    async add($brandName) {
        const hasBrand = await this.find($brandName).catch(error => error)

        if (hasBrand) {
            return {
                isSuccessful: false, message: `${hasBrand} name already exist!`
            }
        }

        return new Promise((resolve, reject) => {
            const db = connect();
            const query = `INSERT INTO ${this.__tableName}(name) VALUES($brandName)`;

            db.run(query, { $brandName }, function (error) {
                if (error) {
                    logError(error)
                    return;
                }

                resolve({ isSuccessful: true })
            })

        })
    },
    /**
     * It is not case sensitive so  'John' === 'jOHn'
     * @param {string} $brandName 
     * @returns {Promise<boolean>}
     */
    async find($brandName) {
        return new Promise((resolve, reject) => {
            const db = connect();
            const query = `SELECT name FROM ${this.__tableName} WHERE LOWER(name) = $brandName`

            db.get(query, { $brandName: $brandName.toLowerCase() }, function (error, row) {
                if (error) {
                    logError(error)
                    return;
                }

                resolve(row)
            })

        })
    },
    /**
     * 
     * @param {string} $brandName 
     * @param {string} $newBrandName 
     * @returns 
     */
    update($brandName, $newBrandName) {
        return new Promise((resolve, reject) => {
            const db = connect();
            const query = `UPDATE ${this.__tableName} SET name = $newBrandName WHERE name='${$brandName}'`

            db.run(query, { $newBrandName }, function (error) {
                if (error) {
                    logError(error)
                    return;
                }
                if (!this.changes) {
                    reject(false)
                } else {
                    resolve(true)
                }
            })
        })
    },
    delete($brandName) {
        return new Promise((resolve, reject) => {
            const db = connect();

            const query = `DELETE FROM ${this.__tableName} WHERE name = $brandName`
            db.run(query, { $brandName }, function (error) {
                if (error) {
                    logError(error)
                    return;
                }

                if (!this.changes) {
                    reject(false)
                } else {
                    resolve(true)
                }
            })
        })
    },
    getAll() {
        return new Promise((resolve, reject) => {
            const db = connect();
            const query = `SELECT * FROM ${this.__tableName}`
            db.all(query, function (error, rows) {
                if (error) {
                    logError(error)
                    return;
                }
                resolve(rows)
            })

        })
    }
}
const categories = {
    __tableName: 'Categories',
    /**
     * 
     * @param {string} $categoryName 
     */
    async add($categoryName) {
        const hasCategory = await this.find($categoryName).catch(error => error)


        if (hasCategory) {
            return {
                error: true, message: 'The category name already exist!'
            }
        }
        return new Promise((resolve, reject) => {
            const db = connect();
            const query = `INSERT INTO ${this.__tableName}(name) VALUES($categoryName)`

            db.run(query, { $categoryName }, function (error) {
                if (error) {
                    logError(error)
                    return;
                }

                resolve({ error: false })
            })
        })
    },
    async update($categoryName, $newCategoryName) {
        return new Promise((resolve, reject) => {
            const db = connect()
            const query = `UPDATE ${this.__tableName} SET name = $newCategoryName WHERE name = '${$categoryName}'`

            db.run(query, { $newCategoryName }, function (error) {
                if (error) {
                    logError(error)
                    return;
                }
                if (!this.changes) {
                    reject(false)
                } else {
                    resolve(true)
                }
            })
        })
    },
    async delete() {
        return new Promise((resolve, reject) => {
            // 
        })
    },
    async find($categoryName) {
        return new Promise((resolve, reject) => {
            const db = connect();
            const query = `SELECT name FROM ${this.__tableName} WHERE LOWER(name) = $categoryName`

            db.get(query, { $categoryName: $categoryName.toLowerCase() }, function (error, row) {
                if (error) {
                    logError(error)
                    return;
                }

                resolve(row)
            })
        })
    },
    async getdAll() {
        return new Promise((resolve, reject) => {
            const db = connect()
            const query = `SELECT * FROM ${this.__tableName}`
            db.all(query, function (error, rows) {
                if (error) {
                    logError(error)
                    return;
                }
                resolve(rows)
            })
        })
    },
}
function checkTables() {
    const db = connect()
    const allTableQuery = "SELECT name FROM sqlite_master WHERE type='table';"

    return new Promise((resolve, reject) => {
        db.all(allTableQuery, [], (error, rows) => {
            if (error) {
                reject({
                    isSuccessful: false,
                    error: {
                        message: error.message,
                        code: error.code,
                        err: error.errno
                    }
                })
            } else {
                resolve({
                    isSuccessful: true,
                    rows
                })
            }
        })
        // Should I close it inside the promise or here is OK? 
        db.close()
    })
}


export default {
    users,
    sessions,
    log,
    products,
    brands,
    categories
}

// const db = storeHubDataBase()

// db.users.add('Gosho', 'gosho3@mail', '123').catch(error => console.error(error))
