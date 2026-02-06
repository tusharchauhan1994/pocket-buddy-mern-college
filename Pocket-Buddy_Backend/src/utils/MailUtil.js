const mailer = require('nodemailer');

const sendingMail = async(to,subject,text)=>{
  const transporter = mailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'pocketbuddy.food.offers@gmail.com',
      pass: 'nieb lfyx vijj broj'
    }
  })

  const mailOptions = {
    from: 'pocketbuddy.food.offers@gmail.com',
    to: to,
    subject: subject,
    //text: text,
    html: text,
  }

  const  mailResponse = await transporter.sendMail(mailOptions);
  console.log(mailResponse);
  return mailResponse;
}

//sendingMail("imcatushar1994@gmail.com","Welcome to Pocket-Buddy","this is test mail")

module.exports ={ sendingMail };









// const mailer = require('nodemailer');

// const sendingMail = async(to,subject,text)=>{
//   const transporter = mailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: 'imcatushar1994@gmail.com',
//       pass: 'sdcl hqle sywb aglx'
//     }
//   })

//   const mailOptions = {
//     from: 'imcatushar1994@gmail.com',
//     to: to,
//     subject: subject,
//     //text: text,
//     html: text,
//   }

//   const  mailResponse = await transporter.sendMail(mailOptions);
//   console.log(mailResponse);
//   return mailResponse;
// }

// //sendingMail("imcatushar1994@gmail.com","Welcome to Pocket-Buddy","this is test mail")

// module.exports ={ sendingMail };






