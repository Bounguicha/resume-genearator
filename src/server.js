
const express = require('express');
var path = require('path');
const conf          = require('dotenv');
var usersRouter = require('./api/routes/appRoutes');
const corspolicy    = require('./api/middleware/cors-policy');
const badReqHandler = require('./api/middleware/bad-req-handler');
var app = express();
const logger  = require('../src/api/middleware/app-logger');

/* Define CORS policy */
app.use(corspolicy);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));
conf.config({path: `${process.cwd()}/.env`});
const port = process.env.PORT   ? process.env.PORT : 8094;
process.env.PORT_TEST ? process.env.PORT_TEST : 8081
usersRouter(app)

/* Handler for 404 */
app.use(badReqHandler);

 /**
  * Get port from environment and store in Express.
  */
 
 app.set('port', port);
 
 /**
  * Listen on provided port, on all network interfaces.
  */
 
  app.listen(port, () => {
   logger.info(`User Rest API listening on port ${port}`);
});