const logger = require('./app-logger');

module.exports = (req, res, next) => {
    logger.error('[bad-req_handler] Ressource not found');
    res.status(404).send({ msg_code: '0404' }); 
}
