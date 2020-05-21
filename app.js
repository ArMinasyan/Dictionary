const express = require('express');
const crypto = require('crypto');
const session = require('express-session');
const path = require('path');
const passport = require('passport');
const secret = require('uid');
const body = require('body-parser');

const app = express();
const mongoose = require('mongoose');
const port = 3000;


app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(body.urlencoded({
    extended: true
}));
app.use(body.json());
app.set('view engine', 'hbs');
app.use(
    session({
        secret: secret(10),
        resave: true,
        saveUninitialized: true,
    })
);


var User = require('./passport.js');
app.use(passport.initialize());
app.use(passport.session());
app.get('/', function (req, res) {
    res.render('index');
    if (req.isAuthenticated()) res.redirect('/login');
    if (req.isAuthenticated() && req.user.name == 'admin') res.render('admin');
});

var dictionary = mongoose.model('dictionary', {
    armenian: String,
    russian: String,
    english: String,
    explanation_am: String,
    explanation_ru: String,
    explanation_en: String,
    name: String,
    sector: String
}, 'dictionary');

var admin = mongoose.model('admin', {
    username: String,
    password: String,
    name: String,
    sector: String
}, 'user');

mongoose.connect('mongodb://localhost:27017/user2', {
        useNewUrlParser: true
    });
app.post('/login', passport.authenticate('login', { failureRedirect: '/' }), function (req, res) {

    if (req.isAuthenticated() && req.user.name != 'admin') {
        res.redirect('/login');
    } else res.redirect('/admin');
    
});


app.get('/login', function (req, res) {
    if (req.isAuthenticated()) res.redirect('/login/' + req.user.id);
    else res.redirect('/');
});

app.get('/user_error', function (req, res) {
    res.json('error');
})

app.get('/login/:id', function (req, res) {
    if (req.isAuthenticated()) {
        res.render('Login');
    } else res.redirect('/');
});
///////////////////////////////////
app.get('/admin', function (req, res) {
    if (req.isAuthenticated()) res.redirect('/admin/' + req.user._id);
    else res.redirect('/');
});

app.get('/user_error', function (req, res) {
    res.json('error');
})

app.get('/admin/:id', function (req, res) {
    if (req.isAuthenticated()) {
        res.render('admin');
    } else res.redirect('/');
});
////////////////////////////
app.post('/logout', function (req, res) {
    mongoose.connection.close();
    req.logOut();
    res.redirect('/');
});

////////////////
app.post('/get_question', function (req, res) {
    dictionary.find({ name: req.user.name }, function (err, result) {
        res.json({
            result: result
        });
    })
});

app.post('/admin_data', function (req, res) {
    admin.find(function (err, result) {
        res.json({ result: result });
    })
});

app.post('/example', function (req, res) {
    var data = req.body.d1;
    //console.log(data[0].id);


    for (var index = 0; index < req.body.len; index++) {

        if (data[index].type == 1) {
            dictionary.findByIdAndUpdate(data[index].id, {
                armenian: data[index].armenian,
                russian: data[index].russian,
                english: data[index].english,
                explanation_am: data[index].explanation_am,
                explanation_ru: data[index].explanation_ru,
                explanation_en: data[index].explanation_en,
                name: req.user.name,
                sector: req.user.sector,
            }, {
                    upsert: true,
                    new: true,
                    overwrite: true
                }, function (err, res) { console.log('updated') });
        }
        else if (data[index].type == 2) dictionary.findByIdAndDelete(data[index].id, function (err) { console.log('removed') })
        else if (data[index].type == 3) {
            dictionary.insertMany({
                armenian: data[index].armenian,
                russian: data[index].russian,
                english: data[index].english,
                explanation_am: data[index].explanation_am,
                explanation_ru: data[index].explanation_ru,
                explanation_en: data[index].explanation_en,
                name: req.user.name,
                sector: req.user.sector,
            }, function (err, doc) { console.log('inserted') });
        }
    }
});
//////////////////////////////
app.post('/add_user', function (req, res) {
    var data = req.body.d1;

    for (var index = 0; index < req.body.len; index++) {
        if (data[index].type == 1) {

            const hash = crypto.createHash('sha256').update(data[index].pass).digest('hex');
            admin.findByIdAndUpdate(data[index].id, {
                username: data[index].uname,
                password: hash,
                name: data[index].name,
                sector: data[index].sector,
            }, {
                    upsert: true,
                    new: true,
                    overwrite: true
                }, function (err, res) { console.log('updated') });
        }
        else if (data[index].type == 2) admin.findByIdAndDelete(data[index].id, function (err, doc) { console.log('removed') })
        else if (data[index].type == 3) {
            admin.insertMany({
                username: data[index].uname,
                password: hash,
                name: data[index].name,
                sector: data[index].sector,
            }, function (err, doc) { console.log('inserted') });
        }
    }

});
/////////////////////
app.post('/search', function (req, res) {
    if (!req.body.sector) {
        if (req.body.type == 'arm' && req.body.name != '') dictionary.find({ armenian: new RegExp('^' + req.body.name) }, function (err, result) { res.json({ data: result }) });
        if (req.body.type == 'rus' && req.body.name != '') dictionary.find({ russian: new RegExp('^' + req.body.name) }, function (err, result) { res.json({ data: result }) });
        if (req.body.type == 'eng' && req.body.name != '') dictionary.find({ english: new RegExp('^' + req.body.name) }, function (err, result) { res.json({ data: result }) });
    } else {
        dictionary.find({ sector: req.body.sector }, function (err, result) { res.json({ data: result }) });
    }
}).post('/search2', function (req, res) {
    if (!req.body.sector) {
        if (req.body.type == 'arm' && req.body.name != '') dictionary.find({ armenian: req.body.name }, function (err, result) { res.json({ data: result }) });
        if (req.body.type == 'rus' && req.body.name != '') dictionary.find({ russian: req.body.name }, function (err, result) { res.json({ data: result }) });
        if (req.body.type == 'eng' && req.body.name != '') dictionary.find({ english: req.body.name }, function (err, result) { res.json({ data: result }) });
    }
});

app.listen(port, () => console.log(`http://localhost:${port}`));
