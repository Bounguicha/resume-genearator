const fs = require("fs");
const createReport = require("docx-templates");
const path = require("path");
const http = require("http");
const { DownloaderHelper } = require('node-downloader-helper');

let dirPath = path.join(__dirname, '../../');
const docPath = 'public/CVs/';
module.exports.createFile = async (body,contractor) => {
   return  new Promise( (resolve) => {
const filePath = path.join(dirPath + docPath);
const dl = new DownloaderHelper(body.url, filePath);
dl.start();
dl.on('end', () => {
    console.log('Download Completed', dl.getDownloadPath());
    resolve(dl.getDownloadPath())
})
   }).then( (res) => {
       return (res);
   })

}