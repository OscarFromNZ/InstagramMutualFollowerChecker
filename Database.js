let mysql = require('mysql');
const { URL } = require('url');


class Database {
    constructor() {
        this.con = null;
    }

    async init(password) {
        /*
        // heroku stuff - createPool
        const dbUrl = process.env.CLEARDB_DATABASE_URL;
        const dbUrlParts = new URL(dbUrl);
        
        this.con = mysql.createPool({
            host: dbUrlParts.hostname,
            user: dbUrlParts.username,
            password: dbUrlParts.password,
            database: dbUrlParts.pathname.substring(1)
        });
        */

        this.con = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: password,
            database: 'tikiwok'
        }); 

        // Connect to SQL database and log "Connected!" on success as well as the result
        this.con.connect(function (err, result) {
            if (err) throw err;
            console.log('Connected to SQL database succssfully!', result);
        })
    }

    executeQuery(query, callback) {
        this.con.query(query, function (err, result, fields) {
            console.log('executed query ' + query);
            if (err) return console.log(err);
            console.log("checked for error, calling back, results " + result);
            return callback(result);
        });
    }
    
    // I know it's dumb having it here but I couldn't be bothered putting it anywhere else, maybe I'll make a utils thing later
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    async getDatabaseStructure() {
        let tables = await new Promise((resolve, reject) => {
            this.con.query('SHOW TABLES', (e, results) => {
                if (e) console.error(e);
                resolve(results);
            });
        });

        const databaseStructure = [];

        for (let table of tables) {
            let tableName = Object.values(table)[0];
            let fields = await new Promise((resolve, reject) => {
                this.con.query(`DESCRIBE ${tableName}`, (error, results) => {
                    if (error) reject(error);
                    resolve(results);
                });
            });

            databaseStructure.push({
                name: tableName,
                fields: fields.map(field => ({
                    name: field.Field,
                    dataType: field.Type,
                }))
            });
        }

        return databaseStructure;
    }
}

module.exports = Database;