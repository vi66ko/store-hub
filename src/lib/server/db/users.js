import { error } from '@sveltejs/kit';
import { dataBaseConnectTo } from './connectdb.js'


const db_file = './src/lib/server/db/store_hub.db';


export const users = async () => {
    const db = dataBaseConnectTo(db_file)
    let message = ""


    return {
        /**
         * 
         * @param {string} email 
         * @param {string} password
         * @returns 
         */
        async signUp(email, password) {

            const result = await db.insertInto('Users', { email, password })

        },
        /**
         * 
         * @param {string} primaryKey 
         */
        async getUser(primaryKey) {

            const result = await db.generic(`SELECT * FROM Users where id = ${primaryKey}`)
        },


        async delete(primaryKey, column) {

        }

    }
}


