var  mongoose = require( 'mongoose')
  , timestamps = require('mongoose-timestamp')
  ;

var PaymentSchema = new mongoose.Schema( {
  userId: { type: String, required: true }
  , serviceId: { type: String, required: true }
  , firstName: { type: String, required: true }
  , lastName: { type: String, required: true }
  , billingAddress: {
      address: { type: String }
    , city: { type: String }
    , postalCode: { type: Number }
    , countryCode: { type: String, default: "US" }
  }
  , status: { type: String, required: true, default: 'failed'}
  , amount: { type: String, required: true }
  , cardType: { type: String, required: true, default: "Visa" }
  , cardLastFour: { type: Number }
  , transactionNumber: { type: String }
  , response: { type: String }
});

// Plugins
PaymentSchema.plugin(timestamps);

module.exports = mongoose.model( 'Payment', PaymentSchema );