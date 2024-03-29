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

    req.flash("success" , `${course.name} has been created successfully!`);
    res.status(201).redirect('/courses');
  } catch (error) {
    req.flash("error" , "Something went wrong...");
    res.status(400).redirect('/courses');
  }
};

exports.getAllCourses = async (req, res) => {
  try {

    const categorySlug = req.query.categories;
    const query = req.query.search;

    const category = await Category.findOne({slug:categorySlug})

    let filter = {};

    if(categorySlug) {
      filter = {category:category._id}
    }
    
    if(query) { // search alanı için düzenlemeler bu satırdan sonra yapıldı.
      filter = {name:query};
    }

    if(!query && !categorySlug) {
      filter.name = "",
      filter.category= null
    }

    const courses = await Course.find({
      $or: [
        {name: { $regex: '.*' + filter.name + '.*', $options:'i'}} , //  options : i ile case insensitive özelliği eklendi(BÜYÜK KÜÇÜK HARFA DUYARLILIK KALDIRILMIŞ OLDU)
        {category:filter.category}
      ]
    }).sort('-createdAt').populate('user');

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
    const user = await User.findById(req.session.userID);
    const course = await Course.findOne({slug: req.params.slug}).populate('user');

    const categorySlug = req.query.categories;

    const category = await Category.findOne({slug: categorySlug});

    let filter={};

    if(categorySlug) {
      filter= {category: category._id};
    }

    const categories = await Category.find();

    res.status(200).render('course', {
      course,
      categories,
      page_name: 'courses',
      user,
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

exports.releaseCourse = async(req,res) => {
  try {
    const user = await User.findById(req.session.userID);
    await user.courses.pull({_id: req.body.course_id});
    await user.save();

    res.status(200).redirect('/users/dashboard');

  } catch(error) {
     res.status(400).json({
      status: 'fail',
      error,
     })
  };

}

exports.deleteCourse = async(req,res) => {
  try{

    const course = await Course.findOneAndDelete({slug:req.params.slug});

    req.flash('error' , `${course.name} has been removed successfully`);

    res.status(200).redirect('/users/dashboard');

  } catch(error){
    res.status(400).json({
      status: 'fail',
      error,
    })
  }
}

exports.updateCourse = async(req,res) => {

  try{

    const course = await Course.findOne({slug:req.params.slug});

    course.name = req.body.name;
    course.description = req.body.description;
    course.category = req.body.category;

    course.save();

    res.status(200).redirect('/users/dashboard');

  } catch(error){
    res.status(400).json({
      status: 'fail',
      error,
    })
  }

}