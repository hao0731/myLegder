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
    }],
    admins:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userData'
    }]
});

ledgerSchema.statics = {
    findMembers: function(query, condition, callback) {
        return this.findOne(query).populate(condition).exec(callback);
      }
}

module.exports = mongoose.model('ledgerData', ledgerSchema);
