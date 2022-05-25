const logger  = require('./app-logger');
const conf    = require('dotenv');

module.exports = (req, res, next) => {

    /* Get database env variable from .env */
    conf.config({ path: `${process.cwd()}/.env` });

    let origin = req.headers.origin;
	
	logger.info('[cors-policy] Origin : ' + origin);

    if (    (process.env.NODE_ENV === 'development')
         || (process.env.NODE_ENV === 'test')   
         || (origin && origin !== undefined && origin.indexOf(process.env.ALLOWED_APPLICATION_DOMAIN) !== -1)) {

        res.header('Access-Control-Allow-Origin', origin);
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Browser, Ip-Adress');
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');

        if (req.method === 'OPTIONS')
            res.status(200).send('OK');
        else
            next();
    }
    else {
        logger.info('[cors-policy] Cors policy failed........');

		return res.status(401).json({msg_code : '0005'});
    }

}
