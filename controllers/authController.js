const User = require('../models/User');

const bcrypt = require('bcrypt');

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({
      status: 'success',
      user,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};


exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found',
      });
    }

    const passwordMatch = bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect password',
      });
    }

    // USER SESSION
    res.status(200).send('YOU ARE LOGGED IN');
    
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};