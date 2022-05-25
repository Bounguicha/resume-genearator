
const bodyParser = require('body-parser');
const generateContractorsDocxHandler = require('../actions/generateDocxTemplateHandler');
const generateCompanyDocxHandler = require('../actions/generateCompanyDocxTemplate');
const generateOneContractorResumesHandler = require('../actions/generateForOneContractorDocxTemplateHandler');
const convertResumeToPdfHandler = require('../actions/convertResumeToPdfHandler');
const generateTestReportHandler = require('../actions/generateTestReportHandler.js');
module.exports = routes = app =>  {

	/* Body parser to Json*/
	app.use(bodyParser.urlencoded({limit: '50mb', extended: true }));
	app.use(bodyParser.json({limit: '50mb'}));

	/* Define the root for the get method */
	app.route('/generate/contractors').post(generateContractorsDocxHandler.generateDocx);
	app.route('/generate/company').post(generateCompanyDocxHandler.generateDocx);
	app.route('/generate/oneContractor').post(generateOneContractorResumesHandler.generateDocx);
	app.route('/generate/convert').post(convertResumeToPdfHandler.convertToPdf);
	app.route('/generate/report').post(generateTestReportHandler.generateTestReport);


}
