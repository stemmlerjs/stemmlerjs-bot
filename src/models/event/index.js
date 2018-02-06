var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EventSchema = Schema({
    name: { type: String, required: true, index: { unique: false }},
    success: { type: Boolean, required: true },
    meta: Object,
    created_at    : { type: Date, required: true, default: Date.now }
})

module.exports = mongoose.model('Event', EventSchema)