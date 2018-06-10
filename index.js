const express = require('express');
const path = require('path');
const passport = require('passport');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');

const dbConfig = require('./config/databaseConfig');

// import routes
const users = require('./routes/usersRoutes')

// db conection
mongoose.connect(dbConfig.database);
mongoose.connection.on('connected', () => {
    console.log('Successful connection to', dbConfig.database);
});
mongoose.connection.on('error', (err) => {
    console.log('Fail to connect to', dbConfig.database);
    console.log(err);
});

// settings
const app = express();
const port = 3000;
app.set('port', process.env.PORT || port);

// middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));

// passport middlewares
app.use(passport.initialize());
app.use(passport.session());
require('./config/passportConfig')(passport);

//routes
app.use('/users', users);

//server
app.listen(port, () => {
    console.log('server on port ', port);
});