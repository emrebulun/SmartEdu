const nodemailer = require('nodemailer');
const Course = require('../models/Course');

const User = require('../models/User');


exports.getIndexPage = async (req, res) => {

  // console.log(req.session.userID);

  const courses = await Course.find().sort('-createdAt').limit(2); // limit 2 sayesinde en son oluşturulmuş 2 kursu çağırmış olduk
  const totalCourses = await Course.find().countDocuments();
  const totalStudents = await User.countDocuments({role:'student'});
  const totalTeachers = await User.countDocuments({role:'teacher'});

  res.status(200).render('index', {
    page_name: 'index',
    courses,
    totalCourses,
    totalStudents,
    totalTeachers,
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
  const { name , email , message } = req.body;

  if(!name || !email || !message) {
    req.flash('error', "All fields are required to fill");
    return res.status(400).redirect('contact');
  }
  const outputMessage = `
  
  <h1>Mail Details</h1>
  <ul>
  <li>Name: ${name}</li>
  <li>Email: ${email}</li>
  </ul>
  <h1>Message</h1>
  <p> ${message}</p>  `

  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'noname2person@gmail.com', // gmail account
      pass: 'xivy xogj cbby foyy', // gmail pass
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Smart Edu Contact Form" <noname2person@gmail.com>', // sender address
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