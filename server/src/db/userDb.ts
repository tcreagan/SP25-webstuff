import mysql from 'mysql';
import dotenv from 'dotenv';

dotenv.config();

export interface User {
  id: number;
  email: string;
  password_hash: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

class UserDb {
  private pool: mysql.Pool;

  constructor() {
    this.pool = mysql.createPool({
      connectionLimit: 10,
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'webstuff_user',
      password: process.env.DB_PASSWORD || 'Webstuff@123456',
      database: process.env.DB_NAME || 'webstuff_db'
    });
  }

  private query<T>(sql: string, params?: any[]): Promise<T> {
    return new Promise((resolve, reject) => {
      this.pool.query(sql, params, (error, results) => {
        if (error) {
          console.error('Database query error:', error);
          reject(error);
          return;
        }
        resolve(results);
      });
    });
  }

  async createUser(user: { email: string; password_hash: string; name: string }): Promise<User> {
    const result = await this.query<mysql.OkPacket>(
      'INSERT INTO User (email, password_hash, name) VALUES (?, ?, ?)',
      [user.email, user.password_hash, user.name]
    );
    
    const [newUser] = await this.query<User[]>(
      'SELECT * FROM User WHERE id = ?',
      [result.insertId]
    );
    
    return newUser;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const users = await this.query<User[]>(
      'SELECT * FROM User WHERE email = ?',
      [email]
    );
    return users[0] || null;
  }

  async findUserById(id: number): Promise<User | null> {
    const users = await this.query<User[]>(
      'SELECT * FROM User WHERE id = ?',
      [id]
    );
    return users[0] || null;
  }

  async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.pool.end(err => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

export default new UserDb(); 
