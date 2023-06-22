import sqlite3 from 'sqlite3';

// @ts-ignore
import { Tables, Users, Sells } from './tables_interface.js';


sqlite3.verbose()


// atob("dsfsd")
// btoa('2fasdfa')

const db_store_hub = './src/lib/server/db/store_hub.db';
const tablesSchema = `
        PRAGMA foreign_keys = on;
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
            email TEXT NOT NULL CHECK(LENGTH(email) > 0),
            session_id TEXT NOT NULL CHECK(LENGTH(session_id) > 0),
            initialization_vector BLOB,
            date INTEGER NOT NULL CHECK(LENGTH(email) > 0),
            expire_date INTEGER NOT NULL CHECK(LENGTH(email) > 0),
            FOREIGN KEY (email) REFERENCES Users(email)
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
                console.log('If tables: Users, Products, Sells did not exist now they DO!');
                console.log('------------------------------------------------------------');
            }

        }
    );
    db.close()
})(db_store_hub)



/**
 * Connecting with the db and return RUD like (CRUD - C) methods to communicate
 * with the selected database
 * @param {string} filePath

 */
export function dataBaseConnectTo(filePath) {
    function connect() {
        const db = new sqlite3.Database(filePath, err => {
            if (err) console.error(err.message)
        })
        console.log(`//=> Connection with SQLIte: ${filePath} has been established`)
        console.log('------------------------------------------------------------');

        return db
    }



    return {
        /**
         * @param {Tables} table
         * @returns
         */
        getAllRecords(table) {
            const db = connect()
            return new Promise((resolve, reject) => {
                db.all(`select * FROM ${table}`, (err, rows) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows)

                    }
                    db.close()
                })
            })



        },
        /**
         *
         * @param {Tables} table
         * @param {object} columns
         * 
         */
        insertInto(table, columns = {}) {
            return new Promise((resolve, reject) => {

                if (Object.keys(columns).length === 0) {
                    console.error('At least one column is required')
                    return reject({ isSuccessful: false });
                }

                const columnsNames = Object.keys(columns)
                const columnsValue = Object.values(columns)
                const placeholders = columnsNames.map(() => '?').join(', ')
                const query = `INSERT INTO ${table} (${columnsNames.join(', ')}) VALUES (${placeholders});`;

                const db = connect()


                db.run(query, columnsValue, function (err) {
                    if (err) {
                        console.error(err)

                        reject({
                            isSuccessful: false,
                            error: {
                                message: err.message,
                                code: err.code,
                                err: err.errno
                            }
                        })

                    }

                    resolve({ isSuccessful: true })


                })
                db.close()
            });
        },


        /**
         *
         * @param {Tables} table The name of the table in the db
         * @param {[field: string, value: string]} primaryKey [ field name, field value ]
         * @param {object} columns { field: string, value: string }
         */
        update(table, [pk_name, pk_value], columns) {
            const db = connect();
            let data = "";

            for (const propertyName in columns) {
                data += `${propertyName} = '${columns[propertyName]}', `
            }

            data = data.slice(0, -2) // remove last comma from string.

            const query = `UPDATE ${table} SET ${data} WHERE ${pk_name} = ?;`;



            return new Promise((resolve, reject) => {

                db.run(query, [pk_value], function (error) {
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
                        if (this.changes > 0) {
                            resolve({ isSuccessful: true })
                        } else {
                            reject({
                                isSuccessful: false,
                                message: 'No changes has been made. Make sure the condition check is correct'
                            })
                        }
                    }
                    console.log(this)
                    db.close()
                })
            })
        },
        // del() {

        // },
        /**
         * 
         * @param {string} query 
         */
        generic(query) {
            const db = connect();
            // db.get(`SELECT * FROM User WHERE email = ''`)

            db.get(query, [], function (error, row) {
                console.log(row)
            })


            db.close()
        },
        checkTables() {
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
    }
}


export const db = dataBaseConnectTo(db_store_hub)




