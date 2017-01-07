var passport = require('passport');
var localStrategy = require('passport-local');
var mongodb = require('mongodb').MongoClient;

var strategyFunc = function() {
    passport.use(new localStrategy({
                usernameField: 'userName',
                passwordField: 'password'
            },
            function(usernameInput, passwordInput, done) {
                //Sign In
                var url = "mongodb://localhost:27017/booksapi";
                mongodb.connect(url, function(err, db) {
                    var collection = db.collection('users');
                    collection.findOne({ username: usernameInput }, function(err, results) {
                        console.log("password = " + results.password);
                        if (results.password === passwordInput) {
                            var user = results;
                            done(null, user);
                        } else {
                            done(null, false);
                        }
                        db.close();
                    })
                });
            }))
        // return strategyFunc;
}

module.exports = strategyFunc;