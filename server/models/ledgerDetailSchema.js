const mongoose = require('mongoose');
const ledgerDetailSchema = mongoose.Schema({
    name: String,
    class: String,
    price: String,
    timeStamp: String,
    recorder:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'userData'
    },
    ledger: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'ledgerData'
    }
});

module.exports = mongoose.model('ledgerDetailData',ledgerDetailSchema);