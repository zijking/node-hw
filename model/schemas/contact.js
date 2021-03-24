const mongoose = require('mongoose');

const { Schema, model, SchemaTypes } = mongoose;

const contactSchema = new Schema(
  {
    name: {
      type: String,
      require: [true, 'Set name'],
    },
    email: {
      type: String,
      require: [true, 'Set email'],
    },
    phone: {
      type: String,
    },
    subscription: { type: String },
    password: { type: String },
    token: { type: String },

    owner: {
      type: SchemaTypes.ObjectId,
      ref: 'user',
    },
  },
  { versionKey: false, timestamps: true },
);

const Contact = model('contact', contactSchema);

module.exports = Contact;
