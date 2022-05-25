const path = require("path");
const service = require("../services/createTestReportService");
const form_data = require("form-data");
const convertWordFiles = require("convert-multiple-files");
module.exports.generateTestReport = async (req, res) =>  {
    let dirPath =  path.join(__dirname, '../../');
    try {
        await service.createReport(req.body).then().then( async (pdf) => {
                if (pdf) {
                    console.log('path=', dirPath + pdf)
                    res.status(200).sendFile(dirPath + pdf);
                } else {
                    res.status(200).send( { msg: 'pdf cannot be generated'})
                }
            })
    } catch (e) {
        console.log(e);
    }
}