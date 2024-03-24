const bcrypt = require('bcrypt');
const User = require('../models/User');
const Category = require('../models/Category');
const Course = require('../models/Course');

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);

    res.status(201).redirect('/login');
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

exports.loginUser = async (req, res) => {
  
    const { email, password } = req.body; 
    //Assuming you're sending email and password in the request body 
      try { 
      const user = await User.findOne({ email }); // Find the user by email 

      if (user) {
      const same = await bcrypt.compare(password, user.password); // Compare passwords 
      if (same) { // Create a user session or send a token 
      // res.status(200).send("You are logged in");
      req.session.userID=user._id;
      res.status(200).redirect('/users/dashboard'); 
      } else {
      res.status(401).send("Invalid password"); 
      } } else { 
        res.status(404).send("User not found");
      }
      
      } catch (error) {
      res.status(500).json({
        status: "error",
        error 
      }); 
      } 
  };

exports.logoutUser = (req, res) => {
  req.session.destroy(()=> {
    res.redirect('/');
  })
}


exports.getDashboardPage = async (req, res) => {
  const user = await User.findOne({_id:req.session.userID})
  const categories = await Category.find();
  const courses = await Course.find({user:req.session.userID});
  res.status(200).render('dashboard', {
    page_name: 'dashboard',
    user,
    categories,
    courses
  });
};
