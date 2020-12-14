const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
    id: {
        type: Number,
    },
    name: {
        type: String,
    },
    room: {
        type: Number,
    },
    status: {
        type: String,
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Device', sensorSchema);