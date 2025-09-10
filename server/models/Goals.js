const mongoose = require('mongoose');

const goalsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    shortTerm: [{
        type: String,
        trim: true
    }],
    longTerm: [{
        type: String,
        trim: true
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Goals', goalsSchema);
