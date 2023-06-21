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


// UPDATE databaseName SET customer_name = "Ivan" WHERE customer_id =?;`,
update('user').set({ name: 'newName', password: 'newPasss' }).where("email = email@mail.co")
update('user')
    .set({
        name: 'newName',
        password: 'newPasss'
    })
    .where("email")
    .equalTo()



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


function storeHubDataBase() {
    const filePath = './src/lib/server/db/store_hub.db';

    function connect() {
        const db = new sqlite3.Database(filePath, error => {
            if (error) console.error(error);
        })

        return db;
    }

    return {
        user: {
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

let db = storeHubDataBase();


let test = await db.user.add('email@mail.co', 'password');
console.log(test);
/**
 * what to return  
 * {isSuccessful: true| false}
 *
 */





