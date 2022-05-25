const imageToBase64 = require('image-to-base64');
const createReport = require('docx-templates');
const fs = require('fs');
const path = require("path");
const Jimp = require('jimp')
const axios = require("axios");
const {resolve} = require("path");
const dirPath = path.join(__dirname, '../../public/images/imageCircle.png');
const starUrl = path.join(__dirname, '../../public/images/star.png');
const emptyImageUrl = path.join(__dirname, '../../public/images/blank.png');
const starGreyUrl = path.join(__dirname, '../../public/images/grey-star-2.png');
require('dotenv').config()
const uploadHost = process.env.UPLOAD_API_SERVER;
const uploadPort = process.env.UPLOAD_API_PORT;
const uploadUrl =  `${uploadHost}:${uploadPort}`;
function getImageUrl(url) {
    if (url !== null && url !== undefined) {
        let circle = (path.join(__dirname, '../../public/images/circle.png'));
        const borderImageUrl = path.join(__dirname, '../../public/images/circle_border.png');
        return  new Promise(  async (resolve, reject) => {
            axios({
                method: 'get',
                url: url,
                responseType: 'arraybuffer'
            }).then( async ({data: imageBuffer}) => {
                await Promise.all([Jimp.read(imageBuffer), Jimp.read(circle), Jimp.read(borderImageUrl)]).then(function (images) {
                    let image = images[0];
                    let draw = images[1];
                    let borderImage = images[2];
                    borderImage.resize(365, 365)
                    image.resize(325, 325);
                    draw.resize(325, 325);
                    image.mask(draw, 0, 0).clone().resize(325, Jimp.AUTO).writeAsync(dirPath).then(async (data) => {
                        let imageCircular = await Jimp.read(dirPath)
                        borderImage.composite(imageCircular, 20, 20, {
                            mode: Jimp.BLEND_SOURCE_OVER,
                            opacityDest: 1,
                            opacitySource: 1
                        }).resize(325, 325).writeAsync(dirPath).then((dataBorder) => {
                            imageToBase64(dirPath)
                                // Path to the image
                                .then(
                                    (response) => {
                                        const thumbnail = {
                                            data: response,
                                            extension: '.jpg',
                                        };
                                        resolve({width: 4, height: 4, data: thumbnail.data, extension: '.png'});
                                    });
                        })

                    })
                });
            });


                })
    } else {
        return null
    }
}
function getLogoImageUrl(url) {
    if (url !== null && url !== undefined) {
            return new Promise((resolve, reject) => {
                console.log('url=', url);
                axios({
                    method: 'get',
                    url: url,
                    responseType: 'arraybuffer'
                })
                    .then(({data: imageBuffer}) => {
                        Jimp.read(imageBuffer).then((image) => {
                            image.resize(117.54, 64.5).writeAsync(path.join(__dirname, '../../public/images/logo.png')).then((data) => {
                                imageToBase64(path.join(__dirname, '../../public/images/logo.png')).then(
                                    (response) => {
                                        const thumbnail = {
                                            data: response,
                                            extension: '.jpg',
                                        };
                                        resolve({width: 3.5, height: 1.5, data: thumbnail.data, extension: '.png'});
                                    })
                            })
                        });
                    });

                // Path to the image
            })
        }

    }
function getLogoCertifImageUrl(url, length) {

    if (url !== null && url !== undefined) {
        return new Promise((resolve, reject) => {
            axios({
                method: 'get',
                url: url,
                responseType: 'arraybuffer'
            })
                .then(({data: imageBuffer}) => {
                    Jimp.read(imageBuffer).then((image) => {
                        image.resize(117.54, 64.5).writeAsync(path.join(__dirname, '../../public/images/logo.png')).then((data) => {
                            imageToBase64(path.join(__dirname, '../../public/images/logo.png')).then(
                                (response) => {
                                    const thumbnail = {
                                        data: response,
                                        extension: '.jpg',
                                    };
                                    resolve({width: length === 3 ? 2 : length === 2 ? 3 : 5, height: 2.5, data: thumbnail.data, extension: '.png'});
                                })
                        })
                    });                })
            // Path to the image

        })
    } else {
        return null;
    }

}
function getStarUrl(url) {
    return new Promise((resolve, reject) => {
        imageToBase64(url)
            // Path to the image
            .then(
                (response) => {
                    const thumbnail = {
                        data:response,
                        extension: '.jpg',
                    };
                    resolve( {width: 0.4, height: 0.4, data: thumbnail.data, extension: '.png'});
                })
    })

}
function getEmptyImage(url) {
    return new Promise((resolve, reject) => {
        imageToBase64(url)
            // Path to the image
            .then(
                (response) => {
                    const thumbnail = {
                        data:response,
                        extension: '.jpg',
                    };
                    resolve( {width: 0.1, height: 0.1, data: thumbnail.data, extension: '.png'});
                })
    })
}
const templateObject = [
    {
        path: 'public/templates/widigital-cv-template.docx',
        theme: 'DEFAULT',
    },
    {
        path: 'public/templates/widigital-cv-template-emerald.docx',
        theme: 'EMERALD',
    },
    {
        path: 'public/templates/widigital-cv-template-amethyst.docx',
        theme: 'AMETHYST',
    },
    {
        path: 'public/templates/widigital-cv-template-orange.docx',
        theme: 'ORANGE',
    },
    {
        path: 'public/templates/widigital-cv-template-sun-flower.docx',
        theme: 'SUN_FLOWER',
    },
    {
        path: 'public/templates/widigital-cv-template-silver.docx',
        theme: 'SILVER',
    },
    {
        path: 'public/templates/widigital-cv-template-midnight-blue.docx',
        theme: 'MIDNIGHT_BLUE',
    },
    {
        path: 'public/templates/widigital-cv-template-green.docx',
        theme: 'GREEN',
    },
    {
        path: 'public/templates/widigital-cv-template-alizarin.docx',
        theme: 'ALIZARIN',
    },]
let pathTemp = 'public/templates/widigital-cv-template.docx'
const translateObject = [
    {
        certifDiploma: "Certifications and diplomas",
        email: "Email",
        funcSkill: "Functional skills",
        intervention: "Level of intervention",
        language: "Language",
        phone: "Phone",
        proExp: "Professional experiences",
        technicalSkill: "Technical Skills",
        yearsOfExperience: "Years of experience",
        until: 'until'
    },
    {
        certifDiploma: "Certifications et diplomes",
        email: "Email",
        funcSkill: "Compétences fonctionnels",
        intervention: "Niveaux d'ntervention",
        language: "Langues",
        phone: "Tel",
        proExp: "Experiences professionels",
        technicalSkill: "Compétences technique",
        yearsOfExperience: "Ans d'experiences",
        until: 'à'
    }
]
require('dotenv').config()
module.exports.generateContractorsDocx = async (body,contractor) => {
    contractor.phone2_nbr = contractor.phone2_nbr === undefined ? '' :contractor.phone2_nbr;
    templateObject.forEach( (template) => {
        if (template.theme === contractor.template_resume) {
            pathTemp = template.path
        }
    })
    const template = fs.readFileSync(pathTemp);
    return new Promise( async(resolve, reject) => {
    resolve( createReport({
      template,
      output: 'buffer',
      data: {
          resumeData: body,
          translate: contractor.language === 'EN' ? translateObject[0] : translateObject[1],
          contractorData: contractor,
          currentYear: new Date().getFullYear().toString()
      },
      additionalJsContext: {
          qrCode: async () => {
                  const data = await getImageUrl(body['image_url'])
                  return data
          },
          qrCodeLogo: async () => {
            const dataLogo = await getLogoImageUrl(`${uploadUrl}/show/${contractor.photo}`)
            return dataLogo
          },
          qrCodeStar: async () => {
              const dataStar = await getStarUrl(starUrl)
              return dataStar
          },
          qrCodeStarGrey: async () => {
              const dataStarGrey = await getStarUrl(starGreyUrl)
              return dataStarGrey
          },
          qrCodeEmpty: async () => {
              const dataBlank = await getEmptyImage(emptyImageUrl)
              return dataBlank                    },
          qrCodeCertifLogo: async (url, length) => {
              const dataLogo = await getLogoCertifImageUrl(`${uploadUrl}/show/${url}`, length)
          },
      }
    })

    )
    }).then((data) => {
      fs.writeFileSync(`public/CVs/auto-generated-${contractor.template_resume}.docx`, data)
      return (`auto-generated-${contractor.template_resume}`);
  })

}
module.exports.generateCompanyDocx = async (body) => {
    const template = fs.readFileSync('public/templates/widigital-cv-template-company.docx');
    return new Promise( async(resolve, reject) => {
        resolve( createReport({
                template,
                output: 'buffer',
                data: body.data,
                additionalJsContext: {
                    qrCode: async () => {
                        const data = await getImageUrl(body.data.person.imageUrl)
                        return data
                    },
                    qrCodeLogo: async () => {
                        if (body.data.person.company_logo) {
                            return await getLogoImageUrl(body.data.person.company_logo)
                        } else {
                            return null;
                        }
                    },
                    qrCodeCertifLogo: async (url, length) => {
                        const dataLogo = await getLogoCertifImageUrl(`${uploadUrl}/show/${url}`, length)
                        return dataLogo
                    },
                    qrCodeStar: async () => {
                        const dataStar = await getStarUrl(starUrl)
                        return dataStar
                    },
                    qrCodeStarGrey: async () => {
                        const dataStarGrey = await getStarUrl(starGreyUrl)
                        return dataStarGrey
                    },
                    qrCodeEmpty: async () => {
                        const dataBlank = await getEmptyImage(emptyImageUrl)
                        return dataBlank                    }
                }
            })

        )
    }).then((data) => {
        fs.writeFileSync(`public/CVs/auto-generated-company.docx`, data)
        return (`auto-generated-company`);
    }).catch( err => console.log('error=', err))

}
