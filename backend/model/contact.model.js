const mongoose = require('mongoose');

// Do not generate _id, since this is a sub-schema
const contactEntrySchema = mongoose.Schema({
    kind: String,
    value: String,
    label: String
}, { _id: false });

const contactSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true
  },
  entries: [contactEntrySchema],
  created: Date,
  lastUpdated: Date
});

module.exports = mongoose.model("Contact", contactSchema);