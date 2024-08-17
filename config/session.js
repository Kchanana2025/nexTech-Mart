const expressSession = require('express-session');//It is a session middleware for Express.js, used to manage user sessions
const mongoDbStore = require('connect-mongodb-session');//It is a MongoDB session store library that works with express-session to store session data in a MongoDB database

function createSessionStore() {
    const MongoDBStore = mongoDbStore(expressSession);

    const store = new MongoDBStore({
        uri: 'mongodb://localhost:27017',
        databaseName: 'online-shop',
        collection: 'sessions'
    });

    return store;
}

function createSessionConfig() {
    return {
        secret: 'super-secret',
        resave: false,
        saveUninitialized: false,
        store: createSessionStore(),
        cookie: {
            maxAge: 2 * 24 * 60 * 60 * 1000//session will be logged out after 2 days
        }
    };
}

module.exports = createSessionConfig;