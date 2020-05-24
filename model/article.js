const mongoose= require('mongoose');

const articleShemas = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    link : String,
    titre : String,
    message: String,
    lienImage: String,
    mediatype: String,
    date : String

});

module.exports = mongoose.model('article', articleShemas);