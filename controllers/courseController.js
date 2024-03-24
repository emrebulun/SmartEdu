const Course = require('../models/Course');
const Category = require('../models/Category');
const User = require('../models/User');

exports.createCourse = async (req, res) => {
  try {
    const course = await Course.create({
      name : req.body.name,
      description: req.body.description,
      category: req.body.category,
      user: req.session.userID // hangi kursu hangi öğretmenin oluşturduğunu userID sayesinde belirlemiş oluyoruz
    });

    res.status(201).redirect('/courses');
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

exports.getAllCourses = async (req, res) => {
  try {

    const categorySlug = req.query.categories;

    const category = await Category.findOne({slug:categorySlug})

    let filter = {};

    if(categorySlug) {
      filter = {category:category._id}
    }

    const courses = await Course.find(filter).sort('-createdAt');
    const categories = await Category.find();

    res.status(200).render('courses', {
      courses,
      categories,
      page_name: 'courses',
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findOne({slug: req.params.slug}).populate('user');

    res.status(200).render('course', {
      course,
      page_name: 'courses',
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

exports.enrollCourse = async (req,res) => {
  try{

    const user = await User.findById(req.session.userID);
    await user.courses.addToSet({_id:req.body.course_id}); // push yerine addToSet kullanmamız sayesinde öğrenci aynı kursa kaydolamıyor ve push fonksiyonundaki mantık hatası ortadan kalkıyor yani courses array'e aynı kurs eklenemiyor 
    await user.save();

    res.redirect('/users/dashboard');

  } catch(error) {
    res.status(400).json({
      status: 'fail',
      error
    })
  }
}