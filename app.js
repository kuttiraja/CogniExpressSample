var express = require('express');
var app = express();

var port = process.env.port || 3000;

app.use(express.static('public'));
app.set('views', 'src/views');
app.set('view engine', 'ejs')


var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/booksapi');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var bookModel = require('./src/models/bookModel')

//Book Router for browsing the books
var bookRouter = require('./src/Routes/bookRoutes')(bookModel);
app.use('/api', bookRouter); //middleware - last practical of today session

//AdminRouter for addition of Books
var adminRouter = require('./src/routes/adminRoutes')();
app.use('/admin', adminRouter);



//authentication pre-requisites
var cookieParser = require('cookie-parser');
var session = require('express-session');
app.use(cookieParser());
app.use(session({
    secret: 'library',
    resave: false,
    saveUninitialized: true
}));
var passport = require('./src/config/passport')(app);


//Authentication Router for signin and Signup
var authRouter = require('./src/routes/authRoutes')();
app.use('/auth', authRouter);


app.get('/', function(req, res) {
    res.render('index', {
        nav: [{
                Link: '/api/books',
                Text: 'Books'
            },
            {
                Link: '/admin/addbooks',
                Text: 'Admin'
            }
        ]
    })
})



app.listen(port, function(err) {
    console.log('Running on port ' + port);
})