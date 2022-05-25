const fs = require("fs");
const path = require("path");
const { jsPDF } = require("jspdf");
const {svg2png} = require('svg-png-converter');
module.exports.createReport = async (body,contractor) => {
        console.log('body =', body);
    return new Promise( async(resolve, reject) => {
            const doc = new jsPDF();
            let imgLogoData = fs.readFileSync(path.join(__dirname,'../../assets/img/Servicima-hor.png'));
            let imgAvatarData = fs.readFileSync(path.join(__dirname,'../../assets/img/avatar.png'));
            let imgData = fs.readFileSync(path.join(__dirname,'../../assets/img/Test-Success.png'));
            doc.setFillColor(0,103,224);
            doc.setDrawColor(0,103,224);
            doc.rect(0, 0, 1000, 15, 'FD');
            doc.setFontSize(20);
            doc.setFont('Poppins', 'medium')
            doc.setTextColor('white')
            doc.text('Test Report', 10, 10);
            doc.setFontSize(10);
            doc.addImage(imgLogoData, "PNG", 185, 5, 15, 5);
            doc.setFillColor(243,246,249);
            doc.setDrawColor(243,246,249);
            doc.rect(0, 15, 1000, 10, 'FD');
            doc.setFontSize(12);
            doc.setTextColor(35,35,35);
            doc.setFont('Poppins', 'bold')
            doc.addImage(imgAvatarData, 'PNG', 7, 18, 5, 5);
            doc.text('Candidate name:', 13, 22)
            doc.setFont('Poppins', 'normal')
            doc.text(body['fullName'], 46, 22)
            doc.addImage(imgData, "PNG", 70, 42, 60, 35);
            doc.setFont('Poppins', 'medium')
            doc.setFontSize(20);
            doc.setTextColor(27, 197, 189)
            doc.text('Great work', 86, 85);
            doc.setFont('Poppins', 'extra-light')
            doc.setFontSize(10);
            doc.setTextColor(35,35,35)
            doc.text('You passed the test with success', 80, 90);
            doc.setFillColor(243, 246, 249);
            doc.setDrawColor(243, 246, 249);
            doc.rect(0, 110, 80, 30, 'FD');
            doc.setFillColor(0,103,224);
            doc.setDrawColor(0,103,224);
            doc.rect(80, 110, 150, 30, 'FD');
            doc.setFont('Poppins', 'medium')
            doc.setFontSize(10);
            doc.setTextColor(35,35,35)
            doc.text(`Session name: ${body['sessionName']}`, 10, 120);
            doc.text(`Society: ${body['companyName']}`, 10, 125);
            doc.text(`Experience required : ${body['experienceRequired']}`, 10, 130);
            doc.text(`Duration : ${body['duration']}`, 10, 135);
            doc.setDrawColor(27, 197, 189);
            doc.setFillColor(27, 197, 189);
            doc.circle(133, 125, 12, 'FD');
            doc.setDrawColor(0,103,224);
            doc.setFillColor(0,103,224);
            doc.circle(133, 125, 6, 'FD');
            doc.setFont('Poppins', 'medium')
            doc.setFontSize(50);
            doc.setTextColor(255,255,255)
            doc.text(`${body['correctAnswerPercentage']}%`, 148, 130);
            doc.setDrawColor(27, 197, 189);
            doc.setFillColor(27, 197, 189);
            doc.circle(84, 131, 1, 'FD');
            doc.setFillColor(0,103,224);
            doc.setDrawColor(0,103,224);
            doc.circle(84, 131, 0.3, 'FD');
            doc.setDrawColor(252, 15, 59)
            doc.setFillColor(252, 15, 59)
            doc.circle(84, 134, 1, 'FD');
            doc.setFillColor(0,103,224);
            doc.setDrawColor(0,103,224);
            doc.circle(84, 134, 0.3, 'FD');
            doc.setDrawColor(255, 255, 255);
            doc.setFillColor(255, 255, 255);
            doc.circle(84, 137, 1, 'FD');
            doc.setFillColor(0,103,224);
            doc.setDrawColor(0,103,224);
            doc.circle(84, 137, 0.3, 'FD');
            doc.setFont('Poppins', 'extra-light')
            doc.setFontSize(4);
            doc.setTextColor(255,255,255)
            doc.text(`Correct answer: ${body['correctAnswerPercentage']}%`, 86, 131);
            doc.text(`Wrong answer: ${body['wrongAnswerPercentage']}%`, 86, 134);
            doc.text(`Skipped answer: ${body['skippedAnswerPercentage']}%`, 86, 137);
            doc.setFont('Poppins', 'normal')
            doc.setFontSize(15);
            doc.setTextColor(35,35,35)
/*
            doc.text('Test Details', 5, 150);
*/
            let bigRect = 135
            let techTitle = 139;
            let techBigStats = 142
            let techSmallStats = 138
            let answerLabels = 140;
            for (let i = 0; i < body['questionsStats'].length; ++i) {
                    doc.setDrawColor(175, 177, 184);
                    doc.setFillColor(255,255,255);
                    doc.roundedRect(3, bigRect + 20, 202, 15,1,1, 'FD');
                    bigRect += 20;
                    doc.setFontSize(8);
                    doc.text(body['questionsStats'][i]['technologyTitle'], 7, techTitle +20);
                    techTitle += 20;
                    const correctAnswer = body['questionsStats'][i]['questionsStats']['correctPercentage'];
                    const wrongAnswer =body['questionsStats'][i]['questionsStats']['wrongPercentage'];
                    console.log('correct answer =', correctAnswer, 'wrongAnswer=', wrongAnswer);
                    let answersX = 7
                    doc.setDrawColor(232, 241, 249)
                    doc.setFillColor(232, 241, 249)
                    doc.roundedRect(7, techBigStats + 20, 150, 3, 2,2, 'FD');
                    doc.setDrawColor(27, 197, 189)
                    doc.setFillColor(27, 197, 189)
                    doc.roundedRect(answersX, techBigStats + 20, correctAnswer+ 50, 3, 2,2, 'FD');
                    answersX += correctAnswer - 2
                    doc.setDrawColor(252, 15, 59)
                    doc.setFillColor(252, 15, 59)
                    doc.roundedRect(answersX, techBigStats + 20, wrongAnswer + 50 , 3, 0,0, 'FD');
                    doc.roundedRect(answersX + wrongAnswer + 48, techBigStats + 20, 4 , 3, 2,2, 'FD');

                    techBigStats += 20
                    doc.setDrawColor(27, 197, 189)
                    doc.setFillColor(27, 197, 189)
                    doc.roundedRect(175, techSmallStats + 20, 4, 2, 1, 1, 'FD');
                    doc.setDrawColor(252, 15, 59)
                    doc.setFillColor(252, 15, 59)
                    doc.roundedRect(175, techSmallStats + 23.5, 4, 2, 1, 1, 'FD');
                    doc.setDrawColor(232, 241, 249)
                    doc.setFillColor(232, 241, 249)
                    doc.roundedRect(175, techSmallStats + 27.5, 4, 2, 1, 1, 'FD');
                    techSmallStats += 20
                    doc.setFont('Poppins', 'normal')
                    doc.setFontSize(7);
                    doc.setTextColor(35,35,35)
                    doc.text('Correct answer', 180, answerLabels + 20);
                    doc.text('Wrong answer', 180, answerLabels + 23.5);
                    doc.text('No answer', 180, answerLabels + 27.5);
                    answerLabels += 20;
            }
         /*   doc.setDrawColor(175, 177, 184)
            doc.roundedRect(105, bigRect + 20, 100, 10 + (8 * body['questionsStats'].length), 1,1);
            doc.setFillColor(232, 241, 249)
            doc.roundedRect(105, bigRect + 20, 100, 8, 1,1, 'FD');
            doc.setFillColor(175, 177, 184)
            bigRect  += 20
            doc.setFillColor(255, 255, 255)
            doc.line(175, bigRect, 175, bigRect + 15 + (body['questionsStats'].length * 9.5), 'FD');
            doc.line(185, bigRect, 185, bigRect + 15 + (body['questionsStats'].length * 9.5), 'FD');
            doc.line(195, bigRect, 195, bigRect + 15 + (body['questionsStats'].length * 9.5), 'FD');
            doc.setFontSize(8);
            doc.setTextColor(35,35,35)
            doc.text('Technologies', 110, bigRect + 5);
            doc.setFontSize(5);
            doc.text('Achieved', 176, bigRect + 5);
            doc.text('Total', 187, bigRect + 5);
            doc.text('Percentage', 196, bigRect + 5);
            bigRect += 10;
            let sumAchieved = 0;
            let sumTotalPts = 0;
            let sumPercentage = 0;
            for (let i = 0; i < body['questionsStats'].length; ++i) {
                    doc.setFontSize(8);
                    doc.setFont('Poppins', 'medium')
                    doc.text(body['questionsStats'][i]['technologyTitle'], 110, bigRect + 5);
                    doc.setFontSize(7);
                    doc.setFont('Poppins', 'normal')
                    sumAchieved += body['questionsStats'][i]['questionMark']['achievedPts'];
                    sumTotalPts += body['questionsStats'][i]['questionMark']['totalPts'];
                    sumPercentage += body['questionsStats'][i]['questionMark']['percentagePts']
                    doc.text(body['questionsStats'][i]['questionMark']['achievedPts'].toString(), 177, bigRect + 5);
                    doc.text(body['questionsStats'][i]['questionMark']['totalPts'].toString(), 187, bigRect + 5);
                    doc.text(body['questionsStats'][i]['questionMark']['percentagePts'].toString()  +'%', 197, bigRect + 5);
                    bigRect += 5
            }
            doc.setFillColor(255, 255, 255 )
            doc.roundedRect(175,bigRect + 6, 30, 8, 0, 0)
            doc.text(sumAchieved.toString(), 177, bigRect + 11);

            doc.text(sumTotalPts.toString(), 187, bigRect + 11);

            doc.text((sumPercentage / (body['questionsStats'].length)).toString() + '%', 197, bigRect + 11);*/
            doc.save('example.pdf')
            resolve('example.pdf');
        }).catch( (err) => {
            console.log('error in pdf generation =', err);
        });
}