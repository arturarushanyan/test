const mongoose = require('mongoose');

//mongoose.connect('mongodb://localhost/riotatest');
// mongoose.connect('mongodb://riota:Riot$123@ds251737.mlab.com:51737/riotadb');

mongoose.connect('mongodb://127.0.0.1:27017/riota', (err,db) => {
    if (err){
        console.log('something went wrong', err);
    } else {
        console.log("connected to riota database", db);
    }
});


let db = mongoose.connection;

//User Schema
let UserSchema = mongoose.Schema({
    email: {
        type: String
    },
    secretToken: {
        type: String
    },
    isVerified: {
        type: Boolean
    }
});

let UserModel = module.exports = mongoose.model('UserModel', UserSchema);

module.exports.getUserById = function (id, callback) {
    UserModel.findById(id, callback);
};

module.exports.getUserBySecretToken = function (secretToken, callback) {
    let query = {secretToken : secretToken};
    UserModel.findOne(query, callback);
};

module.exports.createUser = function (newUser, callback) {
    newUser.save(callback);
};
