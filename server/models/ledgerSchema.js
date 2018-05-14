const mongoose = require('mongoose');
const ledgerSchema = mongoose.Schema({
    name: String,
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'userData'
    },
    authority: String,
    type: String,
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userData'
    }]
});

ledgerSchema.statics = {
    findMembers: function(query, callback) {
        return this.find(query).populate('members').exec(callback);
    }
}

module.exports = mongoose.model('ledgerData', ledgerSchema);
