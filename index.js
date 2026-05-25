// Import packages
require('dotenv').config();

// Initialize website
let Website = require('./Website');
let website = new Website(3000)
website.init(process.env.SECRET);