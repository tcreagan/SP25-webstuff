import mysql from 'mysql';
import DBConnector from './dbConnector'; // Assuming this file handles the MySQL connection

const dbConnector = new DBConnector();

// 1. Create a new user and store the hashed password
async function createUser(email: string, passwordHash: string): Promise<number> {
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
async function assignUserRole(userId: number, roleId: number): Promise<void> {
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
async function getUserDetails(userId: number): Promise<any> {
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
async function deleteUser(userId: number): Promise<void> {
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
async function listUsers(): Promise<any[]> {
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
