const {convertWordFiles} = require("convert-multiple-files");
const path = require("path");
const fs = require("fs");
const http = require("http");
const service = require("../services/createResumeFileService");
let dirPath = path.join(__dirname, '../../');
const pdfPath = 'public/PDF/';

module.exports.convertToPdf = async (req, res) =>  {
await service.createFile(req.body).then( (result) => {
     new Promise( async (resolve) => {
             resolve(await convertWordFiles(result, 'pdf', path.resolve(path.join(dirPath + pdfPath))))
    }).then( (resultPdf) => {
         res.status(200).sendFile(resultPdf, () => {
             fs.unlinkSync(result);
             fs.unlinkSync(resultPdf);
         });
    })
})
}
