var mongoose = require( 'mongoose' )
  , _ = require('lodash')
  , CONFIG = require('config')
  , async = require('async')
  , Payment = mongoose.model( 'Payment' )
  , paypal = require('paypal-rest-sdk')
  ;

// set paypal config
paypal.configure( CONFIG.PayPal );

// ### Get Payment by ID
exports.findOne = function( req, res, next ) {
  Payment.findById( req.params.id )
    .exec( function( err, note ) {
      next.ifError( err );
      res.send( note );
      return next();
    });
};

// ### Handle Payment Request
exports.request = function( req, res, next ){

  var userId = genUserId()
    , serviceId = genServiceId();

  // merging fake values
  Payment.create(
    _.merge( req.params, {
      userId: userId
      , serviceId: serviceId
      , cardLastFour: getLastFour( req.params.cardNumber )
      , amount: getAmount()
    }), function( err, payment ){
      next.ifError( err );

      // fake our payments
      if(_.isString( req.query.status )){
        payment.set( 'transactionNumber', 'faketrans:' + _.random( 5000, 7000 ));
        payment.set( 'status', req.query.status );
        payment.set( 'response', 'Fake Payment!' );
        res.send( payment );
        return next();
      }

      // this will not work until sandbox creds are updated!!
      paypal.payment.create( payment, function( err, res ){
        if( err ){
          payment.set('status', 'failed' );
          payment.set('response', err.toString() );
        }else{
          payment.set('status', 'valid');
        }

        payment.set('transactionNumber', res.data.paymentId );

        payment.save( function( err, payment ){
          res.send( payment );
          next();
        })

      });
    });
};

// ### Query Payments
exports.search = function( req, res, next ) {
  var paymentPipe = Payment.aggregate()
    ;

  // handle pagination
  req.query.skip = parseInt( req.query.skip );
  if( _.isNaN( req.query.skip ) || req.query.skip <= 1 ){
    req.query.skip = 0;
  }
  req.query.limit = parseInt( req.query.limit );
  if( _.isNaN( req.query.limit ) || req.query.limit > 100 ){
    req.query.limit = 100;
  }

  // handle filters and matching
  if( req.query.filter ){
    req.query.filter = JSON.parse( req.query.filter );
    paymentPipe.match( req.query.filter );
  }

  // handle group by
  if( req.query.group ){
    paymentPipe.group( { _id : "$" + req.query.group, users: { $push: "$$ROOT" }} );
  }

  // finish and pipe response
  paymentPipe
    .skip( req.query.skip )
    .limit( req.query.limit )
    .exec( function( err, users ){
      next.ifError( err );
      res.send( users );
      next();
    });
};

var genServiceId = function(){
  return _.random( 1000, 1005 );
};

var genUserId = function(){
  return _.random( 10, 20 );
};

var getLastFour = function( number ){
  if(_.isString( number )){
    return number.substring( 12, 4 );
  }
  return null;
};

/*
 paymentStatus(givenProductId, givenAmount) {
 var success = Math.random() < 0.5 ? true : false;
 var productId = Math.random() < 0.5 ? givenProductId : Math.random() * 100;
 var amount = Math.random() < 0.5 ? givenAmount : Math.random();

 return {success: success, productId:productId, amount: amount};
 }
 */

var getAmount = function(){
  return _.random( 1.0, 10 );
};
