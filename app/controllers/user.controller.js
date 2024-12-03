const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
exports.registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, password } = req.body;

    if (!firstName || !lastName || !email || !phoneNumber || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    let user = await User.findOne({ email }, { createdAt: false });
    if (user) {
      return res.status(400).json({ message: 'User already exists.' });
    }
    console.log(user);
    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({
      firstName,
      lastName,
      email,
      phoneNumber,
      password: hashedPassword,
    });

    await user.save();

    return res.status(201).json({
      message: 'User created successfully.',
    });
  } catch (error) {
    console.log('🚀 ~ exports.registerUser= ~ error:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const UserData = await User.findOne({ email: email }, { createdAt: false });
    if (!UserData) {
      return res
        .status(404)
        .json({ statusCode: 404, message: "Account doesn't exist" });
    }

    // Compare the password
    let isMatch = await UserData.comparePassword(password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ statusCode: 401, message: 'Password is incorrect' });
    }
    const accessToken = jwt.sign({ _id: UserData._id }, config.secret, {
      algorithm: 'HS256',
      expiresIn: '1d',
    });
    const sanitizedUser = UserData.toObject();
    delete sanitizedUser.password;
    return res.status(200).json({
      statusCode: 200,
      message: 'Login successful!',
      token: accessToken,
      user: sanitizedUser,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ statusCode: 500, message: 'something went wrong' });
  }
};
