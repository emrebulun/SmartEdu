const express = require("express");
const mongoose = require("mongoose");
const session = require('express-session')
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const pageRoute= require('./routes/pageRoute');
const courseRoute= require('./routes/courseRoute');
const categoryRoute= require('./routes/categoryRoute');
const userRoute= require('./routes/userRoute');

const app = express();

//Connect DB
mongoose.connect('mongodb://localhost/smartedu-db' , {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('DB connected successfully');
});

//Template engine
app.set('view engine',"ejs");

//GLOBAL VARIABLE

global.userIN= null;

//Middlewares
app.use(express.static("public"));
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use(
  session({
  secret: 'my_keyboard_cat', // Buradaki texti değiştireceğiz.
  resave: false, // herhangi bir değişiklik olmasa da session'u kaydetmeyi zorunlu kılar 
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: 'mongodb://localhost/smartedu-db' }),
  })
  );

app.use(flash());
app.use((req,res,next) => {
  res.locals.flashMessages= req.flash();
  next();
})

app.use(methodOverride('_method', {
  methods:['POST','GET'],
})
);

const port = 3000;

//Routes
app.use('*' , (req,res,next)=> {
  userIN = req.session.userID;
  next();
});
app.use('/' , pageRoute);
app.use('/courses' , courseRoute);
app.use('/categories' , categoryRoute);
app.use('/users' ,userRoute);


  
app.listen(port, () => {
  console.log(`App started on port ${port}`);
});