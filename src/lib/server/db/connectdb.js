import sqlite3 from 'sqlite3';
import { access, constants } from 'node:fs';


import { setUpSQLightErrorData, logError } from '$lib/gadgetBag';
import { error } from '@sveltejs/kit';

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
            name TEXT NOT NULL CHECK (LENGTH(name) > 0) UNIQUE,
            description TEXT,
            barcode TEXT,
            price REAL DEFAULT 0.0,
            category TEXT DEFAULT 'Others',
            brand TEXT DEFAULT 'none'
        );


        CREATE TABLE IF NOT EXISTS Sells(
            rowid INTEGER PRIMARY KEY,
            product_id INTEGER,
            seller_id INTEGER,
            sell_price REAL NOT NULL CHECK(LENGTH(sell_price) > 0),
            sell_date INTEGER NOT NULL CHECK(LENGTH(sell_date) > 0),
            FOREIGN KEY (product_id) REFERENCES  products(rowid)
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


function initiateDataBase(/**@type {string} */ dbPath) {
    // the default SQLite db flag is sqlite.OPEN_READWRITE & sqlite.OPEN_CREATE
    const db = new sqlite3.Database(dbPath, (err) => {
        if (err) console.error(err.message); // log the error if any and exit gracefully
    })

    console.log('------------------ Database connection ---------------------');
    console.log(`Connection with SQLIte: ${db_store_hub}`)
    console.log('has been established');



    db.exec(tablesSchema,
        (error) => {
            //  runQuery(db);
            if (error) {
                console.log(`{{{{{{{{{{ Error when creating the tables }}}}}}}}}}`)
                console.error(error.message)
            } else {
                console.log()
                console.log('=> Creating the database:');
                console.log('If tables: Users, Products, Sells, Sessions Brands and Categories did not exist now they DO!');
            }
            console.log('------------------------------------------------------------');
            console.log()

        }
    );
    db.close()
}

/**
 * Checking if the file exist
 */
await access(db_store_hub, constants.R_OK, (error) => {
    if (error) {
        initiateDataBase(db_store_hub)
    }

})

//


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
    /**
     * 
     * @param {string} id 
     */
    getHim(id) {
        console.log('Get him', id);

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
    __tableName: 'Products',
    /**
     * 
     * @param {string} $name 
     * @param {string} $description 
     * @param {string} $barcode 
     * @param {number} $price 
     * @param {string} $category 
     * @param {string} $brand 
     * @returns {Promise<boolean>}
     */
    add($name, $description, $barcode, $price, $category, $brand) {
        return new Promise((resolve, reject) => {
            const db = connect();
            const query = `INSERT INTO ${this.__tableName}(name, description, barcode,
                 price, category, brand) VALUES($name, $description, $barcode, $price, $category, $brand)`

            db.run(query, { $name, $description, $barcode, $price, $category, $brand }, function (error) {
                if (error) {
                    logError(error)
                    throw error;
                }

                if (this.changes) {
                    resolve(true)
                } else {
                    reject(false)
                }
            })
        })
    },
    get($productsName) {
        return new Promise((resolve, reject) => {
            const db = connect();
            const query = ``
        })
    },
    /**
     * - This promise will never be rejected
     * - It will return array with the data or an empty one.
     * @returns 
     */
    getAll() {
        return new Promise((resolve, reject) => {
            const db = connect();
            const query = `SELECT * FROM ${this.__tableName}`;

            db.all(query, function (error, rows) {
                if (error) {
                    logError(error)
                    throw error;
                }
                resolve(rows)
            })
        })
    },
    /**
     * @param {number} $id
     * @param {string} $name 
     * @param {string} $description 
     * @param {string} $barcode 
     * @param {string} $price 
     * @param {string} $category 
     * @param {string} $brand
     * @returns {Promise<boolean>}
     */
    update($id, $name, $description, $barcode, $price, $category, $brand) {
        return new Promise((resolve, reject) => {
            const db = connect();

            const query = `UPDATE ${this.__tableName} SET 
            name = $name,
            description = $description,
            barcode = $barcode,
            price = $price, 
            category = $category, 
            brand = $brand
            WHERE rowid = $id
            `

            db.run(query, { $id, $name, $description, $barcode, $price, $category, $brand }, function (error) {
                if (error) {
                    logError(error)
                    throw error;
                }

                if (this.changes) {
                    resolve(true)
                } else {
                    reject(false)
                }
            })
        })
    },
    delete($name) {
        return new Promise((resolve, reject) => {
            const db = connect();
            const query = `DELETE FROM ${this.__tableName} WHERE name = $name`

            db.run(query, { $name }, function (error) {
                if (error) {
                    logError(error)
                    throw error;
                }

                if (this.changes) {
                    resolve(true)
                } else {
                    reject(false)
                }
            })
        })
    },
    /**
     * 
     * @param {string} $name 
     * @param {number} id 
     * @returns {Promise<boolean>}
     */
    find($name, id = 0) {
        return new Promise((resolve, reject) => {
            const db = connect();
            let query = `SELECT * FROM ${this.__tableName} WHERE LOWER(name) = $name`

            if (id) {
                query = `SELECT * FROM ${this.__tableName} WHERE LOWER(name) = $name AND rowid !=${id}`
            }

            db.get(query, { $name: $name.toLowerCase() }, function (error, row) {
                if (error) {
                    logError(error)
                    throw error;
                }

                if (row) {
                    resolve(true)
                } else {
                    reject(false)
                }
            })
        })
    }

}

const sells = {
    __tableName: 'Sells',
    /**
     * 
     * @param {strign} $productId 
     * @param {strign} $sellerId 
     * @param {strign} $sellPrice 
     * @param {number} $sellDate 
     */
    add($productId, $sellerId, $sellPrice, $sellDate) {

        console.log('================== Sell Added ====================')
        console.log($productId, $sellerId, $sellPrice, $sellDate)
        return new Promise((resolve, reject) => {
            const db = connect();
            const query = `INSERT INTO ${this.__tableName}(product_id, seller_id, sell_price, sell_date ) VALUES($productId, $sellerId, $sellPrice, $sellDate)`

            db.run(query, { $productId, $sellerId, $sellPrice, $sellDate }, function (error) {
                if (error) {
                    logError(error)
                    throw error;
                }
                if (this.changes) {
                    resolve(true)
                } else {
                    reject(false)
                }
            })
        })

    }
}


const brands = {
    __tableName: 'Brands',
    /**
     * 
     * @param {string} $brandName 
     * @returns {Promise<boolean>} true if all is good.
     */
    add($brandName) {
        return new Promise((resolve, reject) => {
            const db = connect();
            const query = `INSERT INTO ${this.__tableName}(name) VALUES($brandName)`;

            db.run(query, { $brandName }, function (error) {
                if (error) {
                    logError(error)
                    throw error;
                }
                if (this.changes) {
                    resolve(true)
                } else {
                    reject(false)
                }
            })

        })
    },
    /**
     * It is not case sensitive so  'John' === 'jOHn'
     * @param {string} $brandName 
     * @returns {Promise<boolean>}
     */
    find($brandName) {
        return new Promise((resolve, reject) => {
            const db = connect();
            const query = `SELECT name FROM ${this.__tableName} WHERE LOWER(name) = $brandName`

            db.get(query, { $brandName: $brandName.toLowerCase() }, function (error, row) {
                if (error) {
                    logError(error)
                    throw error;
                }
                if (row) {
                    resolve(true)
                } else {
                    reject(false)
                }
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
                    throw error;
                }

                if (this.changes) {
                    resolve(true)
                } else {
                    reject(false)
                }
            })
        })
    },
    /**
     * 
     * @param {string} $brandName 
     * @returns {Promise<boolean>}
     */
    delete($brandName) {
        return new Promise((resolve, reject) => {
            const db = connect();

            const query = `DELETE FROM ${this.__tableName} WHERE name = $brandName`
            db.run(query, { $brandName }, function (error) {
                if (error) {
                    logError(error)
                    throw error;
                }

                if (this.changes) {
                    resolve(true)
                } else {
                    reject(false)
                }
            })
        })
    },
    /**
     * This promise will never be rejected
     * It is not case sensitive
     * @param {string} $brandName 
     * @returns {Promise<[] | undefined>}
     */
    get($brandName) {
        return new Promise((resolve) => {
            const db = connect();
            const query = `SELECT * FROM ${this.__tableName} WHERE LOWER(name) = $brandName`

            db.get(
                query,
                {
                    $brandName: $brandName.toLowerCase()
                },
                function (error, row) {
                    if (error) {
                        logError(error)
                        throw error;
                    }

                    resolve(row)
                })
        })
    },
    /**
     * This promise will never be rejected
     * It will return array with the data or an empty one.
     * @returns
     */
    getAll() {
        return new Promise((resolve) => {
            const db = connect();
            const query = `SELECT * FROM ${this.__tableName}`
            db.all(query, function (error, rows) {
                if (error) {
                    logError(error)
                    throw error;
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
     * @returns {Promise<boolean>} true if all is good.
     */
    add($categoryName) {
        return new Promise((resolve, reject) => {
            const db = connect();
            const query = `INSERT INTO ${this.__tableName}(name) VALUES($categoryName)`

            db.run(query, { $categoryName }, function (error) {
                if (error) {
                    logError(error)
                    throw error;
                }

                if (this.changes) {
                    resolve(true)
                } else {
                    reject(false)
                }
            })
        })
    },
    /**
     * 
     * @param {string} $categoryName 
     * @param {string} $newCategoryName 
     * @returns {Promise<boolean>}
     */
    update($categoryName, $newCategoryName) {
        return new Promise((resolve, reject) => {
            const db = connect()
            const query = `UPDATE ${this.__tableName} SET name = $newCategoryName WHERE name = $categoryName`

            db.run(query, { $categoryName, $newCategoryName }, function (error) {
                if (error) {
                    logError(error)
                    throw error;
                }

                if (this.changes) {
                    resolve(true)
                } else {
                    reject(false)
                }
            })
        })
    },
    /**
     * 
     * @param {string} $categoryName 
     * @returns {Promise<boolean>}
     */
    delete($categoryName) {
        return new Promise((resolve, reject) => {
            const db = connect();
            const query = `DELETE FROM ${this.__tableName} WHERE name = $categoryName`
            db.run(query, {
                $categoryName
            },
                function (error) {
                    if (error) {
                        logError(error)
                        throw error;
                    }

                    if (this.changes) {
                        resolve(true)
                    } else {
                        reject(false)
                    }
                })
        })
    },
    /**
     * It is not case sensitive so 'John' === 'jOHn'
     
     * @param { 'id' | 'name'} column
     * @param {string} value
     * @returns {Promise<boolean>}
     */
    find(column, value) {
        return new Promise((resolve, reject) => {
            const db = connect();
            const query = `SELECT * FROM ${this.__tableName} WHERE LOWER(${column}) = $name`

            db.get(query, { $name: value.toLowerCase() }, function (error, row) {
                if (error) {
                    logError(error)
                    throw error;
                }

                if (row) {
                    resolve(true)
                } else {
                    reject(false)
                }
            })
        })
    },
    /**
     * This promise will never be rejected
     * It is not case sensitive
     * @param {string} $categoryName 
     * @returns {Promise<[] | undefined>}
     */
    get($categoryName) {
        return new Promise((resolve) => {
            const db = connect();
            const query = `SELECT * FROM ${this.__tableName} WHERE LOWER(name) = $categoryName`

            db.get(
                query,
                {
                    $categoryName: $categoryName.toLowerCase()
                },
                function (error, row) {
                    if (error) {
                        logError(error)
                        throw error;
                    }

                    resolve(row)
                })
        })
    },
    /**
     * This promise will never be rejected
     * It will return array with the data or an empty one.
     * @returns 
     */
    async getAll($categoryName) {
        return new Promise((resolve) => {
            const db = connect()
            const query = `SELECT * FROM ${this.__tableName}`
            db.all(query, function (error, rows) {
                if (error) {
                    logError(error)
                    throw error;
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


/**
 * 
 * @param {number} numSells 
 */
async function generateSells(numSells) {
    const users = ['John', 'Elizabeth', 'Clark'];
    const allProducts = await products.getAll()
    let randomProduct;
    let randomUser;

    for (let i = 0; i < numSells; i++) {
        randomProduct = allProducts[Math.floor(Math.random() * allProducts.length)]
        randomUser = users[Math.floor(Math.random() * users.length)]

        sells.add(randomProduct.rowid, randomUser, randomProduct.price, new Date(generateRandomDate())).catch(error => logError(error))
    }

}

/**
 * @typedef {object} SetUpOptions
 * @property {string} yearMonth - The year and month in the format 'YYYY-MM'.
 * @property {number} workHourStart - The starting hour of work (24-hour format).
 * @property {number} workHourEnd - The ending hour of work (24-hour format).
 * @property {number} monthLength - The number of days in the month.
 */

/**
 * @param {SetUpOptions} setUp  
 * @example
 * // Default values are:
 *  yearMonth: '2024-07'
 *  workTimeStart: 8
 *  workTimeEnd: 20
 *  monthLength: 31
 * 
 * @returns 
 */
function generateRandomDate(setUp = {
    yearMonth: '2024-07',
    workHourStart: 8,
    workHourEnd: 20,
    monthLength: 31
}) {

    let date = Math.floor(Math.random() * setUp.monthLength);
    date = date < 10 ? '0' + date : date;

    let hour = Math.floor(Math.random() * (setUp.workHourEnd - setUp.workHourStart + 1)) + setUp.workHourStart;
    hour = hour < 10 ? '0' + hour : hour;

    let minute = Math.floor(Math.random() * 60);
    minute = minute < 10 ? '0' + minute : minute;


    return new Date(`${setUp.yearMonth}-${date}:${hour}:${minute}`).getTime()
}

generateSells(3000)




export default {
    log,
    users,
    sessions,
    products,
    sells,
    brands,
    categories
}

// const db = storeHubDataBase()

// db.users.add('Gosho', 'gosho3@mail', '123').catch(error => console.error(error))


