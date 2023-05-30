import sqlite3 from 'sqlite3';

const dbPath = './src/lib/server/db/test.db'


sqlite3.verbose()

function createDbConnection() {
     // the default SQLite db flag is sqlite.OPEN_READWRITE & sqlite.OPEN_CREATE
     const db = new sqlite3.Database(dbPath, (err) => {
          if (err) console.error(err.message); // log the error if any and exit gracefully

     })

     console.log(`Connetionc with SQLIte: ${dbPath}`)
     console.log('has been established');

     return db;
}



/**
 * 
 * @param {sqlite3.Database} db 
 */
function createTable(db) {
     db.exec(`
          CREATE TABLE databaseName (
               customer_id INTEGER PRIMARY KEY NOT NULL,
               customer_name VARCHAR(20) NOT null

          );

          INSERT INTO databaseName (customer_id,customer_name) 
               VALUES 
                    (1,'Jonah'), 
                    (2, 'Seleen');   
     `, () => {
          runQuery(db);
     });


}

function runQuery(db) {
     db.all(
          `SELECT * FROM databaseName`,
          /**          
           * @param {*} err 
           * @param { Array<any> } rows 
           */
          (err, rows) => {
               rows.forEach(row => console.log(row))
          });
}



// db.run("INSERT INTO address (name,age) VALUES ('Spas', 31)");
// db.run("INSERT INTO address (name,age) VALUES ('Vlad', 33)");
// db.run("INSERT INTO address (name,age) VALUES ('Ross', 34)");


// const allTableQuery = "SELECT name FROM sqlite_master WHERE type='table';"
const allTableQuery = "SELECT name FROM sqlite_master"

// db.all(allTableQuery, [], (err, row) => {
//      if (err) {
//           console.error('Error retrievign table names:', err);
//           return;
//      }

//      const tableNames = row.map(row => row.name)
//      console.log({ tableNames });

//      db.close()
// })

// // db.each("SELECT * FROM sqlite_master", (e, d) => console.log(d))

// const db = createDbConnection()

// /**
//  * 
//  * @param {sqlite3.Database} db
//  * @param {string} name
//  * 
//  **/
function insertRow(db, name) {
     // ? is a placeholder to avoid SQL injections attacks
     db.run(
          `INSERT INTO databaseName (customer_name) VALUES (?);`,
          [name],
          function (error) {
               if (error) console.error(error.message)
               console.log(`Inserted a row with the ID: ${this.lastID}`);
          }
     )
}


function selectRow(tableName) {
     let data;
     db.all(
          `SELECT * FROM ${tableName}`, (error, row) => {
               if (error) console.error(error.message)

               data = (row)
               // console.log(row);
          }

     )
}



/**
 * 
 * @param {string} primaryKey 
 */
function updateRow(primaryKey) {
     db.run(`UPDATE databaseName SET customer_name = "Ivan" WHERE customer_id =?;`,
          [primaryKey],
          function (error) {
               if (error) console.error(error.message)

               console.log(`Row ${primaryKey} has been updated`)
          })

}
// updateRow('4')

function deleteRow(primaryKey) {
     db.run(`DELETE FROM databaseName WHERE customer_id = ?`, [primaryKey], (error) => {
          if (error) console.error(error.message)

          console.log(`row with the ID: ${primaryKey} has been deleted`)
     })
}
// deleteRow(5)


const model = {
     databsePath: './src/lib/server/db/test.db',
     dbConnect() {
          const db = new sqlite3.Database(this.databsePath, err => {
               if (err) console.error(err.message)
          })
          console.log(`Connetionc with SQLIte: ${this.databsePath} has been established`)

          return db
     },

     get(table) {
          const db = this.dbConnect()
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
      * @param {string} table 
      * @param {object} columns 
      * @returns 
      */
     insert(table, columns = {}) {
          if (Object.keys(columns).length === 0) {
               console.error('At least one row is required')
               return;
          }

          const columnsNames = Object.keys(columns)
          const columnsValue = Object.values(columns)
          const placeholders = columnsNames.map(() => '?').join(', ')
          const query = `INSERT INTO ${table} (${columnsNames.join(', ')}) VALUES (${placeholders});`



          const db = this.dbConnect()
          db.run(query, columnsValue, (err) => console.log(err))
          db.close()
     },



     /**
      * 
      * @param {string} table The name of the table in the db
      * @param {[field: string, value: string]} primaryKey [ field name, field value ]
      * @param {object} columns { field: string, value: string }
      */
     update(table, primaryKey, columns) {
          let data = "";
          for (const properyName in columns) {
               data += `${properyName} = "${columns[properyName]}",`
          }
          data = data.slice(0, -1) // remove last comma from string.


          const query = `UPDATE ${table} SET ${data} WHERE ${primaryKey[0]} = ?;`;

          const db = this.dbConnect();
          db.run(query, [primaryKey[1]], (err) => {
               if (err) console.log(err)

               db.close()
          })
     },
     del() {

     }
}

// model.insert('databaseName', [{ name: "Spas" }, { age: 2 }, { address: "Flat 22" }])
// model.insert('databaseName', { name: "Spas", age: 2, address: "Flat 22" })

async function test() {
     const data = await model.get('databaseName')
     console.log("data")
     console.log(data)
}

model.update('databaseName', ["customer_id", "4"], { customer_name: "back to Ivan" })

test()

