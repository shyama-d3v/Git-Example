const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
exports.registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, password } = req.body;

    if (!firstName || !lastName || !email || !phoneNumber || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    let user = await User.findOne({
      $or: [{ email: email }, { phoneNumber: phoneNumber }],
    });

    if (user) {
      return res.status(400).json({ message: 'User already exists.' });
    }

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
    console.error('Error in registerUser:', error.message);
    return res.status(500).json({ message: 'Server Error' });
  }
};
