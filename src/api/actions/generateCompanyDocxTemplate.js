const path = require('path')
const service = require("../services/docxTemplateService")
const fs = require('fs');
const form_data = require('form-data')
const axios = require("axios");
const convertWordFiles = require('convert-multiple-files');

module.exports.generateDocx = async (req, res) =>  {
    let dirPath =  path.join(__dirname, '../../');
    try {
        await service.generateCompanyDocx(req.body).then().then( async (doc) => {
            const path = require('path');
            const pdfPath = 'public/PDF/';
            const docPath = 'public/CVs/'
            const enterPath = path.join(dirPath + docPath +  doc + '.docx');
            const outputPath = path.join(dirPath + pdfPath);
// Read file²
            let formDataPdf = new form_data({maxDataSize: 20971520})

// Convert it to pdf format with undefined filter (see Libreoffice doc about filter)
            new Promise(async (resolve, reject) => {
                resolve(await convertWordFiles.convertWordFiles(path.resolve(enterPath), 'pdf', path.resolve(outputPath)));

            }).then( (done) => {
                if (req.query.type === 'preview') {
                    res.status(200).sendFile(
                        outputPath + doc + '.pdf')
                } else {
                    res.status(200).sendFile(
                        enterPath)
                }
            })
        });

    } catch (e) {
        console.log(e);
    }
}
