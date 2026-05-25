const express = require('express');
const session = require('express-session');
const path = require('path');

const homeRoutes = require('./routes/homeRoutes');
const apiRoutes = require('./routes/apiRoutes');

class Website {
    constructor(port) {
        this.app = null;
        this.port = port;
    }

    async init(secret, database) {
        let app = express();

        app.database = database;

        // Set 'views' directory for any views 
        // being rendered res.render()
        app.set('views', path.join(__dirname, 'views'));
        // Set template html thingy to EJS
        app.set('view engine', 'ejs');

        // Set /public to being the JS and CSS source
        app.use(express.static(path.join(__dirname, 'public')));

        app.use(express.urlencoded());
        app.use(express.json());

        // Setting up session
        app.use(session({
            secret: secret,
            resave: false,
            saveUninitialized: false,
            cookie: { secure: 'auto' }
        }));

        // Routes to be used
        app.use(homeRoutes);
        app.use(apiRoutes);

        // process.env.PORT is some weird cleardb thing, yeah
        // Listen on given port
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}, http://localhost:${process.env.PORT}`);
        });

        // I didn't want to define it earlier so that I didn't have to add this. to everything, I hope this is good practice
        this.app = app;
        return this.app;
    }
}

module.exports = Website;