const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    userNames: String,
    roleNames: String,
    color: String,
    status: String,
    description: String
});

module.exports = mongoose.model('User', UserSchema);


