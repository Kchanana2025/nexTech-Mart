
const path = require('path');

const express = require('express');

const expressSession = require('express-session');
const createSessionConfig = require('./config/session');
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/products.routes');
const baseRoutes = require('./routes/base.routes');

const addCsrfTokenMiddleware = require('./middlewares/csrf-token');

const errorHandlerMiddleware = require('./middlewares/error-handler');

const app = express();

const db = require('./data/database');

const csurf = require('csurf');//all posts requests will have a token attached
const checkAuthStatusMiddleware = require('./middlewares/check-auth');
const checkAuthStatus = require('./middlewares/check-auth');


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

const sessionConfig = createSessionConfig();
app.use(expressSession(sessionConfig));

app.use(csurf());
//any request which is not a get request i.e it is a post request will have a csrf token attached.(hmara ye middle ware uss token ko check karega)

app.use(addCsrfTokenMiddleware);
// It is a custom middleware function that you likely created to add the CSRF (Cross-Site Request Forgery) token to your views and route handlers

app.use(checkAuthStatusMiddleware);

app.use(baseRoutes);
app.use(authRoutes);
app.use(productRoutes);

app.use(errorHandlerMiddleware);

db.connectToDatabase()
    .then(function () {
        app.listen(3000);
        console.log("connected to db. server listening at port 3000")
    })
    .catch(function (error) {
        console.log('Failed to connect to the database');
        console.log('error');
    });

