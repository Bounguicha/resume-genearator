const path = require('path')
const service = require("../services/docxTemplateService")
const fs = require('fs');
const {convertWordFiles} = require("convert-multiple-files");
const axios = require('axios');
require('dotenv').config()
const form_data = require('form-data')
const jwt 		= require('jsonwebtoken');
module.exports.generateDocx = async (req, res) => {
    const resumeDataHost = process.env.RESUME_DATA_API_SERVER;
    const resumeDataPort = process.env.RESUME_DATA_API_PORT;
    const resumeDataCrud = process.env.RESUME_DATA_API_CRUD;
    const resumeDataUrl  = `${resumeDataHost}:${resumeDataPort}${resumeDataCrud}`;
    const resumeListHost = process.env.RESUME_LIST_API_SERVER;
    const resumeListPort = process.env.RESUME_LIST_API_PORT;
    const resumeListCrud = process.env.RESUME_LIST_API_CRUD;
    const resumeListUrl =  `${resumeListHost}:${resumeListPort}${resumeListCrud}`;
    let index = 0;
    const email_json = {name: "auhorization module"};
    const temporary_token = jwt.sign(email_json, process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: process.env.TOKEN_VALIDITY});
    let dirPath = path.join(__dirname, '../../');
    try {
        axios.get(`${resumeDataUrl}/?company_email=${req.body.contractorKey.email_address}&user_type=COLLABORATOR`, {
            headers: {
                'Content-Type' : 'application/json',
                'Accept' : 'application/json',
                'Authorization' : 'Bearer ' + temporary_token
            }}).then( async (resumeList) => {
            for (const resume of resumeList.data) {
                await service.generateContractorsDocx(resume, req.body).then().then(async (doc) => {
                    const path = require('path');
                    const pdfPath = 'public/PDF/';
                    const docPath = 'public/CVs/'
                    const enterPath = path.join(dirPath + docPath + doc + '.docx');
                    const outputPath = path.join(dirPath + pdfPath + doc + '.pdf');
                    new Promise(async (resolve, reject) => {
                        resolve(await convertWordFiles(path.resolve(enterPath), 'pdf', path.resolve(path.join(dirPath + pdfPath))));

                    }).then((done) => {
                        let formDataPdf = new form_data({maxDataSize: 20971520})
                        formDataPdf.append('file', fs.readFileSync(outputPath), `${resume.name}.pdf`)
                        formDataPdf.append('file_type', 'pdf');
                        formDataPdf.append('caption', `${resume.name}.pdf`);
                        formDataPdf.append('application_id', req.body.contractorKey.application_id);
                        formDataPdf.append('contractor_code', req.body.contractorKey.contractor_code);
                        formDataPdf.append('company_email', req.body.contractorKey.email_address);
                        formDataPdf.append('collaborator_email', resume.ResumeDataKey.collaborator_email);
                        let formDataDocx = new form_data({maxDataSize: 20971520})
                        formDataDocx.append('file', fs.readFileSync(enterPath), `${resume.name}.docx`)
                        formDataDocx.append('file_type', 'docx');
                        formDataDocx.append('caption', `${resume.name}.docx`);
                        formDataDocx.append('application_id', req.body.contractorKey.application_id);
                        formDataDocx.append('contractor_code', req.body.contractorKey.contractor_code);
                        formDataDocx.append('company_email', req.body.contractorKey.email_address);
                        formDataDocx.append('collaborator_email', resume.ResumeDataKey.collaborator_email);
                        axios.get(`${resumeListUrl}/?contractor_code=${req.body.contractorKey.contractor_code}&collaborator_email=${resume.ResumeDataKey.collaborator_email}`)
                            .then((response) => {
                                if (response.data['msg_code'] === '0004') {
                                    axios({
                                        method: "post",
                                        url: `${resumeListUrl}`,
                                        data: formDataDocx,
                                        headers: {
                                            'Content-Type': `multipart/form-data; boundary=${formDataDocx._boundary}`,
                                        },
                                    })
                                        .then(function (result) {
                                            axios({
                                                method: "post",
                                                url: `${resumeListUrl}`,
                                                data: formDataPdf,
                                                headers: {
                                                    'Content-Type': `multipart/form-data; boundary=${formDataPdf._boundary}`,
                                                },
                                            })
                                                .then(function (result) {
                                                    console.log('upload docx')
                                                })
                                            console.log('upload pdf')
                                        })

                                } else {
                                    axios({
                                        method: "put",
                                        url: `${resumeListUrl}`,
                                        data: formDataDocx,
                                        headers: {
                                            'Content-Type': `multipart/form-data; boundary=${formDataDocx._boundary}`,
                                        },
                                    })
                                        .then(function (result) {
                                            axios({
                                                method: "put",
                                                url: `${resumeListUrl}`,
                                                data: formDataPdf,
                                                headers: {
                                                    'Content-Type': `multipart/form-data; boundary=${formDataPdf._boundary}`,
                                                },
                                            })
                                                .then(function (result) {
                                                    console.log('upload docx')
                                                })
                                            console.log('upload pdf')
                                        })

                                }
                            })
                        index++;
                    })
                });
            }
            if (index === resumeList.data.length) {
                res.status(200).send('0007');
            }

        }).catch( (err) => {
            console.log('err=', err)})

    } catch (e) {
        console.log(e);
    }

}
