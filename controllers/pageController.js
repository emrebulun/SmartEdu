const nodemailer = require('nodemailer');

exports.getIndexPage = (req, res) => {
  console.log(req.session.userID);
  res.status(200).render('index', {
    page_name: 'index',
  });
};
exports.getAboutPage = (req, res) => {
  res.status(200).render('about', {
    page_name: 'about',
  });
};
exports.getRegisterPage = (req, res) => {
  res.status(200).render('register', {
    page_name: 'register',
  });
};

exports.getLoginPage = (req, res) => {
  res.status(200).render('login', {
    page_name: 'login',
  });
};

exports.getContactPage = (req,res)=> {
  res.status(200).render('contact', {
    page_name: 'contact',
  })
}

exports.sendEmail = async (req,res) => {
try {
  const outputMessage = `
  
  <h1>Mail Details</h1>
  <ul>
  
    <li>Name: ${req.body.name}</li>
    <li>Email: ${req.body.email}</li>
  </ul>
  <h1>Message</h1>
  <p> ${req.body.message}</p>
  `

  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'noname1person@gmail.com', // gmail account
      pass: 'gbgm sevm ynhg nnvo664545', // gmail pass
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Smart Edu Contact Form" <noname1person@gmail.com>', // sender address
    to: '<bulunemre@gmail.com>', // list of receivers
    subject: 'Smart Edu Contact Form New Message', // Subject line
    html: outputMessage, // html body
  });

  console.log('Message sent: %s', info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...


   req.flash('success',"Successfully sent")

  res.status(200).redirect('contact');

} catch (err) {
  req.flash('error',`Something went wrong`)
  res.status(200).redirect('contact');

}
};