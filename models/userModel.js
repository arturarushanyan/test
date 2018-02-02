const mongoose = require('mongoose');

//mongoose.connect('mongodb://localhost/riotatest');

mongoose.connect('mongodb://127.0.0.1:27017/riota', (err) => {
    if (err){
        console.log('Error connecting to db', err);
    } else {
        console.log("connected to riota database");
    }
});


let db = mongoose.connection;

//User Schema
let UserSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    purchasePlan: {
        type: String
    },
    description: {
        type: String
    },
    joinedToTelegram: {
      type: Boolean
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
