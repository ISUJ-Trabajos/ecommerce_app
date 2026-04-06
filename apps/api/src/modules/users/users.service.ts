import db from '../../config/db';

export class UsersService {
  static async getAddresses(userId: string) {
    const [rows]: any = await db.execute(
      `SELECT * FROM user_addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC`,
      [userId]
    );
    return rows;
  }

  static async addAddress(userId: string, data: any) {
    if (data.is_default) {
      await db.execute(`UPDATE user_addresses SET is_default = 0 WHERE user_id = ?`, [userId]);
    }

    const { label, street, city, province, postal_code } = data;
    await db.execute(
      `INSERT INTO user_addresses (user_id, label, street, city, province, postal_code, is_default)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, label, street, city, province, postal_code || null, data.is_default ? 1 : 0]
    );

    return this.getAddresses(userId);
  }
}
