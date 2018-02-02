const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const indexRouter = require('./routes/indexRouter');
const userRouter = require('./routes/userRouter');
const expressValidator = require('express-validator');
const session = require('express-session');
const flash = require('connect-flash');
const messages = require('express-messages');
const passport = require('passport');

const app = express();
const port = process.env.port | 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//Handle Sessions
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

//express messages
app.use(flash());
app.use(function (req,res,next) {
    res.locals.messages = messages(req, res);
    next();
});

//Validator
app.use(expressValidator({
    errorFormatter: function (param,msg,value) {
        let namespace = param.split("."),
            root = namespace.shift(),
            formParam = root;
        while (namespace.length){
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        }
    }
}));

app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/users', userRouter);

app.listen(port, (err) => {
    if(err) {
        throw err;
    } else {
        console.log('Riota app is running on port', port)
    }
});