const { validationResult } = require('express-validator');
// Temporarily comment out bcrypt and jsonwebtoken until they're installed
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
const httpError = require('http-errors');
const db = require('../../models');

const Users = db.users;
const Admin = db.admin;

// Temporarily commented out since we're not using JWT
// const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Login function that works for both users and admin
const httpLogin = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // First, check if it's an admin account
    const admin = await Admin.findOne({ where: { email } });
    
    if (admin) {
      // Temporarily use direct password comparison instead of bcrypt
      // const isMatch = await bcrypt.compare(password, admin.password);
      const isMatch = password === admin.password;
      
      if (!isMatch) {
        throw httpError.Unauthorized('Invalid credentials');
      }

      // Temporarily create a simple token without jwt
      // const token = jwt.sign(
      //   { id: admin.id, email: admin.email, role: 'admin' },
      //   JWT_SECRET,
      //   { expiresIn: '7d' }
      // );
      const token = Buffer.from(JSON.stringify({ id: admin.id, email: admin.email, role: 'admin' })).toString('base64');

      return res.status(200).json({
        token,
        user: {
          id: admin.id,
          email: admin.email,
          full_name: admin.full_name,
          role: 'admin'
        }
      });
    }

    // If not admin, check if it's a regular user
    const user = await Users.findOne({ where: { email } });
    
    if (!user) {
      throw httpError.Unauthorized('Invalid credentials');
    }

    // Temporarily use direct password comparison instead of bcrypt
    // const isMatch = await bcrypt.compare(password, user.password);
    const isMatch = password === user.password;
    
    if (!isMatch) {
      throw httpError.Unauthorized('Invalid credentials');
    }

    // Temporarily create a simple token without jwt
    // const token = jwt.sign(
    //   { id: user.id, email: user.email, role: 'user' },
    //   JWT_SECRET,
    //   { expiresIn: '7d' }
    // );
    const token = Buffer.from(JSON.stringify({ id: user.id, email: user.email, role: 'user' })).toString('base64');

    res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: 'user'
      }
    });
  } catch (err) {
    next(err);
  }
};

// Get current user profile
const httpGetProfile = async (req, res, next) => {
  try {
    // User ID and role are extracted from the token in the auth middleware
    const { id, role } = req.user;

    let user;
    
    if (role === 'admin') {
      user = await Admin.findOne({ where: { id } });
    } else {
      user = await Users.findOne({ where: { id } });
    }

    if (!user) {
      throw httpError.NotFound('User not found');
    }

    // Remove password from response
    const userResponse = user.toJSON();
    delete userResponse.password;

    // Add role to response
    userResponse.role = role;

    res.status(200).json(userResponse);
  } catch (err) {
    next(err);
  }
};

// Create a single admin account if none exists
const createAdminIfNotExists = async () => {
  try {
    const adminCount = await Admin.count();
    
    if (adminCount === 0) {
      // Create a default admin account with plain text password (temporary)
      // const hashedPassword = await bcrypt.hash('admin123', 10);
      const plainPassword = 'admin123';
      
      await Admin.create({
        full_name: 'Administrator',
        email: 'admin@example.com',
        password: plainPassword,
        phone: '1234567890',
        status: 'active'
      });
      
      console.log('Default admin account created');
    }
  } catch (error) {
    console.error('Error creating default admin account:', error);
  }
};

// Call this function when the server starts
// Make it more visible and ensure it runs
console.log('Checking if admin account exists...');
createAdminIfNotExists()
  .then(() => console.log('Admin account check completed'))
  .catch(err => console.error('Error during admin account check:', err));


// User registration function
const httpRegister = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { full_name, email, password, phone, address, city, country, postal_code } = req.body;

    // Check if user already exists
    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser) {
      throw httpError.Conflict('User with this email already exists');
    }

    // TODO: Implement password hashing with bcrypt before production
    // const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await Users.create({
      full_name,
      email,
      password, // Store plain text password (TEMPORARY - VERY INSECURE)
      phone,
      address,
      city,
      country,
      postal_code,
      status: 'active' // Default status
    });

    // Temporarily create a simple token without jwt
    // TODO: Use jwt.sign for proper token generation
    const token = Buffer.from(JSON.stringify({ id: newUser.id, email: newUser.email, role: 'user' })).toString('base64');

    // Remove password from response
    const userResponse = newUser.toJSON();
    delete userResponse.password;

    res.status(201).json({
      token,
      user: { ...userResponse, role: 'user' }
    });

  } catch (err) {
    next(err);
  }
};

module.exports = {
  httpLogin,
  httpGetProfile,
  httpRegister // Export the new function
};
