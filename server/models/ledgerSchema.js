const mongoose = require('mongoose');
const ledgerSchema = mongoose.Schema({
    name: String,
    authorId:String,
    authority: String,
    type: String
});

module.exports = mongoose.model('ledgerData', ledgerSchema);
