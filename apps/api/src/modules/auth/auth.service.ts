import db from '../../config/db';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export class AuthService {
  static async getUserByEmail(email: string) {
    const [rows]: any = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  }

  static async getUserById(id: string) {
    const [rows]: any = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  }

  static async registerUser(data: any) {
    const id = uuidv4();
    const hash = await bcrypt.hash(data.password, 12);
    
    await db.execute(
      `INSERT INTO users (id, email, password_hash, full_name, birth_date, phone) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, data.email, hash, data.full_name, data.birth_date, data.phone]
    );

    return this.getUserByEmail(data.email);
  }

  static async incrementLoginAttempt(email: string) {
    const [rows]: any = await db.execute('SELECT * FROM login_attempts WHERE email = ?', [email]);
    if (!rows.length) {
      await db.execute('INSERT INTO login_attempts (email, attempts_today) VALUES (?, 1)', [email]);
    } else {
      let attempts = rows[0].attempts_today + 1;
      let blocked_until = null;
      if (attempts >= 4) {
        blocked_until = new Date(Date.now() + 10 * 60000); // 10 mins block
      }
      await db.execute(
        'UPDATE login_attempts SET attempts_today = ?, blocked_until = ? WHERE email = ?',
        [attempts, blocked_until, email]
      );
      return { attempts, blocked_until };
    }
  }

  static async resetLoginAttempts(email: string) {
    await db.execute('DELETE FROM login_attempts WHERE email = ?', [email]);
  }

  static async getLoginAttempt(email: string) {
    const [rows]: any = await db.execute('SELECT * FROM login_attempts WHERE email = ?', [email]);
    return rows[0];
  }

  static async saveSession(userId: string, refreshToken: string, ip: string = '') {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await db.execute(
      `INSERT INTO sessions (user_id, refresh_token, ip_address, expires_at) VALUES (?, ?, ?, ?)`,
      [userId, refreshToken, ip, expiresAt]
    );
  }

  static async revokeSession(refreshToken: string) {
    await db.execute('DELETE FROM sessions WHERE refresh_token = ?', [refreshToken]);
  }

  static async getSession(refreshToken: string) {
    const [rows]: any = await db.execute('SELECT * FROM sessions WHERE refresh_token = ? AND is_active = 1', [refreshToken]);
    return rows[0];
  }
}
