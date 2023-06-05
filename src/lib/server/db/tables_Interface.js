/** @typedef { "users" | "sels" | "log"} Tables */

/**
 * Fields for the 'user' table
 * 
 * @typedef {Object} User
 * @property {string} [email_primary_key]
 * @property {string} [username]
 * @property {string} [password]
 * @property {string} [settings] Could be JSON but for now is optional
 */

/**
 * Fields for the 'products' table.
 * 
 * @typedef {Object} Products
 * @property {string} [id_primary_key]
 * @property {string} [barcode]
 * @property {string} [name]
 * @property {number} [price]
 * @property {string} [category]
 * @property {number} [quantity]
 */

/**
 * Fields for the 'sells' table.
 * 
 * @typedef {Object} Sells
 * @property {string} [product_foreign_key] 
 * @property {string} [seller_foreign_key] 
 * @property {string} [price] - The price of the moment of sell
 * @property {Date} [date]
 */




let User = /**@type {User} */ ({})

/**@type {Sells} */
let Sells;

/**@type {Tables} */
let Table;



export { Table, User, Sells };


// Another options is to use enumerator

// const tables = {
//     TABLE_ONE: "user",
//     TABLE_TWO: "sels",
//     TABLE_THREE: "log",
//     TABLE_FOUR: "opaa",
// };