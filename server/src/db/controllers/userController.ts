import mysql from 'mysql';
import DBConnector from './dbConnector'; // Assuming this file handles the MySQL connection
import { addTokenToBlacklist } from '../utils/tokenBlacklist';
import redisClient from '../utils/redisClient';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { registerSchema, loginSchema } from '../validators/userValidator';
import { Request, Response } from 'express-serve-static-core';

const dbConnector = new DBConnector();

// 1. Create a new user and store the hashed password
export async function createUser(email: string, passwordHash: string): Promise<number> {
  try {
    const sql = `INSERT INTO User (email, password_hash) VALUES (?, ?)`;
    const result = await dbConnector.runQuery(mysql.format(sql, [email, passwordHash]));
    console.log(`User created with ID: ${result.insertId}`);
    return result.insertId; // Return new user's ID
  } catch (error) {
    console.error(`Error creating user: ${error.message}`);
    throw error; // Let the caller handle the error
  }
}

// 2. Assign a role to a user in a project
export async function assignUserRole(userId: number, roleId: number): Promise<void> {
  try {
    const sql = `INSERT INTO User_Role (user_id, role_id) VALUES (?, ?)`;
    await dbConnector.runQuery(mysql.format(sql, [userId, roleId]));
    console.log(`Assigned role ID ${roleId} to user ID ${userId}`);
  } catch (error) {
    console.error(`Error assigning role: ${error.message}`);
    throw error;
  }
}

// 3. Fetch user details including their roles
export async function getUserDetails(userId: number): Promise<any> {
  try {
    const sql = `
      SELECT u.email, r.name AS role_name, p.project_name
      FROM User u
      LEFT JOIN User_Role ur ON u.id = ur.user_id
      LEFT JOIN Role r ON ur.role_id = r.id
      LEFT JOIN Project p ON r.project_id = p.id
      WHERE u.id = ?;
    `;
    const result = await dbConnector.runQuery(mysql.format(sql, [userId]));

    if (result.length === 0) {
      console.log(`No user found with ID: ${userId}`);
      return null; // No user found
    }

    const userDetails = {
      email: result[0].email,
      roles: result.map((row: any) => ({
        role: row.role_name,
        project: row.project_name,
      })),
    };

    console.log(`Fetched details for user ID ${userId}:`, userDetails);
    return userDetails;
  } catch (error) {
    console.error(`Error fetching user details: ${error.message}`);
    throw error;
  }
}

// 4. Delete a user (optional functionality)
export async function deleteUser(userId: number): Promise<void> {
  try {
    const sql = `DELETE FROM User WHERE id = ?`;
    await dbConnector.runQuery(mysql.format(sql, [userId]));
    console.log(`Deleted user with ID: ${userId}`);
  } catch (error) {
    console.error(`Error deleting user: ${error.message}`);
    throw error;
  }
}

// 5. List all users (optional functionality)
export async function listUsers(): Promise<any[]> {
  try {
    const sql = `SELECT id, email, created_at FROM User`;
    const result = await dbConnector.runQuery(sql);
    console.log(`Fetched ${result.length} users`);
    return result;
  } catch (error) {
    console.error(`Error listing users: ${error.message}`);
    throw error;
  }
}
//gpt generated 
//needs review
// handler functions that respond to API requests by calling user operations above
import { createUser, assignUserRole, getUserDetails, listUsers } from '../dbConnector'; // User operations

// 1. Handler to create a new user
export async function createUserHandler(req: Request, res: Response) {
  const { email, passwordHash } = req.body;

  if (!email || !passwordHash) {
    return res.status(400).json({ error: 'Email and password hash are required' });
  }

  try {
    const newUserId = await createUser(email, passwordHash);
    return res.status(201).json({ message: 'User created', userId: newUserId });
  } catch (error) {
    return res.status(500).json({ error: 'Error creating user' });
  }
}

// 2. Handler to assign a role to a user
export async function assignUserRoleHandler(req: Request, res: Response) {
  const userId = parseInt(req.params.userId);
  const roleId = parseInt(req.params.roleId);

  if (!userId || !roleId) {
    return res.status(400).json({ error: 'User ID and Role ID are required' });
  }

  try {
    await assignUserRole(userId, roleId);
    return res.status(200).json({ message: `Role ${roleId} assigned to user ${userId}` });
  } catch (error) {
    return res.status(500).json({ error: 'Error assigning role' });
  }
}

// 3. Handler to get user details
export async function getUserDetailsHandler(req: Request, res: Response) {
  const userId = parseInt(req.params.userId);

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const userDetails = await getUserDetails(userId);
    if (!userDetails) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json(userDetails);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching user details' });
  }
}

// 4. Handler to list all users (optional)
export async function listUsersHandler(req: Request, res: Response) {
  try {
    const users = await listUsers();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: 'Error listing users' });
  }
}
//gpt generated 
//needs review 
// code for user registration 
// consider creating a separate controller for organization

export async function registerUser(req: Request, res: Response) {
  try {
    // Validate the request body using Joi
    //gpt helped
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const { email, password } = req.body; 
  
    // Check if user already exists
    const existingUser = await User.where({ email });
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }
  
    // Hash the password using bcrypt
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
  
    // Create new user
    const newUser = new User();
    newUser.email = email;
    newUser.password_hash = passwordHash;
  
    await newUser.save(); // user is saved to the database

  // Send success response
    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred during registration' });
  }
}


export async function loginUser(req: Request, res: Response) {
  try {
    // Validate the request body using Joi
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Compare the password with the hashed password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const { refreshToken } = req.cookies.refreshToken; //added refresh token

    if (!refreshToken) {
      return res.status(401).json({ error: 'Unauthorized, no refresh token provided' });
    }//check refresh token

    const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
      if (!JWT_REFRESH_SECRET) {
        throw new Error('JWT_REFRESH_SECRET is not defined in the environment variables');
      }
        // Verify the refresh token
        let decoded;
        decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
        //Ensuring JWT_SECRET is defined
        const JWT_SECRET = process.env.JWT_SECRET;
      if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in the environment variables');
      }

    // Generate JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    //Generate Access Token (short)
    const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    //Generate Access Token (long)
    const refreshToken = jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    // Store the new session in the database
    const session = new Session();
    session.user_id = user.id;
    session.refresh_token = refreshToken;
    session.expires_at = new Date(Date.now() + (7 * 24 * 60 * 60 * 1000));  // 7 days expiration
    await session.save();
    
    // Store both tokens in HTTP-only cookies
    res.cookie('token', accessToken, { httpOnly: true, secure: true, sameSite: 'Strict' });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'Strict' });


    // Return success message and token
    return res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred during login' });
  }
}

//gpt generated 
// needs review
// user logout code
export async function logoutUser(req: Request, res: Response) {
  try {
    const token = req.cookies.token;

    // Add the token to the blacklist
    if (token) {
      addTokenToBlacklist(token);
    }

    const refreshToken = req.cookies.refreshToken;
    // Blacklist the refresh token
    if (refreshToken) {
      const decoded: any = jwt.decode(refreshToken);
      const expiry = decoded.exp;  // Expiration time of the refresh token
      await redisClient.set(refreshToken, 'blacklisted', {
        EX: expiry - Math.floor(Date.now() / 1000),  // Set expiration to match token expiry
      });
    }
    //need to figure out what the difference is between the two functions above
    
    // Clear the JWT token from the cookie
     // Clear the access token and refresh token from the cookies
    res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'Strict' });
    res.clearCookie('refreshToken', { httpOnly: true, secure: true, sameSite: 'Strict' });

    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred during logout' });
  }
}
