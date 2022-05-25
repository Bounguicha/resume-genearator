const path = require('path')
const service = require("../services/docxTemplateService")
const fs = require('fs');
const {convertWordFiles} = require("convert-multiple-files");
const axios = require('axios');
const form_data = require('form-data')
const jwt 		= require('jsonwebtoken');
require('dotenv').config()
module.exports.generateDocx = async (req, res) => {
    const email_json = { name : req.body.ResumeDataKey.collaborator_email };
// Generate a new token using conf information
    const account_activation_token = jwt.sign(email_json, process.env.ACCOUNT_ACTIVATION_TOKEN,
        {expiresIn : process.env.ACCOUNT_ACTIVATION_TOKEN_VALIDITY});
    let dirPath = path.join(__dirname, '../../');
    const contractorHost = process.env.CONTRACTORS_API_SERVER;
    const ContractorPort = process.env.CONTRACTORS_API_PORT;
    const ContractorCrud = process.env.CONTRACTORS_API_CRUD;
    let index = 0;
    const contractorUrl  = `${contractorHost}:${ContractorPort}${ContractorCrud}`;
    const resumeListHost = process.env.RESUME_LIST_API_SERVER;
    const resumeListPort = process.env.RESUME_LIST_API_PORT;
    const resumeListCrud = process.env.RESUME_LIST_API_CRUD;
    const resumeListUrl =  `${resumeListHost}:${resumeListPort}${resumeListCrud}`;

    try {
        axios.get(`${contractorUrl}/?email_address=${req.body.ResumeDataKey.company_email}&application=AUTH-MODULE`, {
            headers: {
                'Content-Type' : 'application/json',
                'Accept' : 'application/json',
                'Authorization' : 'Bearer ' + account_activation_token
            }}).then( async (contractors) => {
            for (const contractor of contractors.data.results) {
                await service.generateContractorsDocx(req.body, contractor).then().then(async (doc) => {
                    const path = require('path');
                    const pdfPath = 'public/PDF/';
                    const docPath = 'public/CVs/'
                    const enterPath = path.join(dirPath + docPath + doc + '.docx');
                    const outputPath = path.join(dirPath + pdfPath + doc + '.pdf');
                    new Promise(async (resolve, reject) => {
                        resolve(await convertWordFiles(path.resolve(enterPath), 'pdf', path.resolve(path.join(dirPath + pdfPath))));

                    }).then((done) => {
                        let formDataPdf = new form_data({maxDataSize: 20971520})
                        formDataPdf.append('file', fs.readFileSync(outputPath), `${req.body.name}.pdf`)
                        formDataPdf.append('file_type', 'pdf');
                        formDataPdf.append('caption', `${req.body.name}.pdf`);
                        formDataPdf.append('application_id', req.body.ResumeDataKey.application_id);
                        formDataPdf.append('contractor_code', contractor.contractorKey.contractor_code);
                        formDataPdf.append('company_email', req.body.ResumeDataKey.company_email);
                        formDataPdf.append('collaborator_email', req.body.ResumeDataKey.collaborator_email);
                        let formDataDocx = new form_data({maxDataSize: 20971520})
                        formDataDocx.append('file', fs.readFileSync(enterPath), `${req.body.name}.docx`)
                        formDataDocx.append('file_type', 'docx');
                        formDataDocx.append('caption', `${req.body.name}.docx`);
                        formDataDocx.append('application_id', req.body.ResumeDataKey.application_id);
                        formDataDocx.append('contractor_code', contractor.contractorKey.contractor_code);
                        formDataDocx.append('company_email', req.body.ResumeDataKey.company_email);
                        formDataDocx.append('collaborator_email', req.body.ResumeDataKey.collaborator_email);
                        axios.get(`${resumeListUrl}/?contractor_code=${contractor.contractorKey.contractor_code}&collaborator_email=${req.body.ResumeDataKey.collaborator_email}`, {
                            headers: {
                                'Content-Type' : 'application/json',
                                'Accept' : 'application/json',
                                'Authorization' : 'Bearer ' + account_activation_token
                            }}).then((response) => {
                                if (response.data['msg_code'] === '0004') {
                                    axios({
                                        method: "post",
                                        url: `${resumeListUrl}`,
                                        data: formDataDocx,
                                        headers: {
                                            'Content-Type': `multipart/form-data; boundary=${formDataDocx._boundary}; charset=UTF-8`,
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
                        });
                        index++
                    })
                });
            }
            if (index === contractors.data.results.length) {
                res.status(200).send('0007');
            }
        }).catch( (err) => {
            console.log('err=', err)})
    } catch (e) {
        console.log(e);
    }
}
