const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    userNames: String,
    roleNames: String,
    color: String
});

module.exports = mongoose.model('User', UserSchema);


