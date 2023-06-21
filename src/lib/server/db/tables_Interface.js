// SQLight have dynamic data types.
// So I have to make sure the format for entered field is correct.


// There could be another table for  "user_logs" 
//  - when user has been loged in
//  - wehn hase been logout
//  - for how long he have been loged in
//  - how much he  maide from sells | ? for what period to be? between login & logout, days ....
/** @typedef { "Users" | "Products" | "Sells"} Tables_interface */

/**
 * Fields for the 'user' table
 * 
 * @typedef {Object} User_interface
 * @property {string} [email]
 * @property {string} [name]
 * @property {string} [password]
 * @property {string} [role]
 * @property {string} [settings] Could be JSON but for now is optional
 */

/**
 * Fields for the 'products' table.
 * 
 * @typedef {Object} Product_interface
 * @property {number} [id_primary_key]
 * @property {string} [barcode]
 * @property {string} [name]
 * @property {string} [description]
 * @property {number} [price]
 * @property {string} [category]
 */

/**
 * Fields for the 'sells' table.
 * 
 * @typedef {Object} Sell_interface
 * @property {number} [sell_id] - Priamry Key
 * @property {number} [product_id] - Foreign key 
 * @property {number} [seller_id] - Foreign Key (user)
 * @property {number} [sell_price] - The price of the moment of sell
 * @property {number} [sell_date] - It will be in UNIX time number of seconds since 1970-01-01
 */




let Users = /**@type {User_interface} */ ({})

let Sells = /**@type {Sell_interface} */ ({});

/**@type {Tables_interface} */
let Tables;




// Another options is to use enumerator

// const tables = {
//     TABLE_ONE: "user",
//     TABLE_TWO: "sels",
//     TABLE_THREE: "log",
//     TABLE_FOUR: "opaa",
// };
export { Tables, Users, Sells };