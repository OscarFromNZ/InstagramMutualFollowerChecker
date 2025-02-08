// Import packages
require('dotenv').config();

// Initialize database
let Database = require('./Database');
let database = new Database();
database.init(process.env.MYSQL_PASSWORD); // only for localhost stuff, for some reason it works when I run it on server lol so won't remove it

// Initialize website
let Website = require('./Website');
let website = new Website(3000)
website.init(process.env.SECRET, database);