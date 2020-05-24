const mongoose= require('mongoose');

const admin = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    nomAdmin : String,
    pseudo : String,
    password: String,
});

module.exports = mongoose.model('admin', admin);