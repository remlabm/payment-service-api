var CONFIG = require('config')
  , os = require('os')
  , restify = require('restify')
  ;

// HTTP Server
// ----------------------------------------------------------------------------
var server = restify.createServer( {
  name: 'payment-service',
  version: '0.1.0'
  /* https cert/key */
} );

server.use( [
    restify.queryParser()
    , restify.bodyParser()
    , restify.CORS({
      origins: ['*'],
      headers: ['Authorization'],
      credentials: true
    })
  ]
);

// Routes
// ----------------------------------------------------------------------------
// Echo
server.get('/echo', function( req, res, next ){
  res.send( req.params );
  next();
});

// ** Everything below here will require Auth Token **
//server.use( restifyOAuth2.mustBeAuthorized() );

// Payments CRUD
server.get( '/payments', function( req, res, next ){

});

server.post( '/payments', function( req, res, next ){

});

server.get( '/payments/:id', function( req, res, next ){

});

module.exports = server;
