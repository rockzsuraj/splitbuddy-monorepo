const { executeQuery, pool } = require('../config/database');
const crypto = require('crypto');
const { ApiError } = require('../utils/apiError');
const bcrypt = require('bcryptjs');
const { sanitizeUser } = require('../utils/helper');

class User {
  static async hashPassword(password) {
    return bcrypt.hash(password, 10);
  }

  static async create({ username, first_name, last_name, email, password, image_url = '' }) {
    const { rows } = await executeQuery(
      `INSERT INTO users (username, first_name, last_name, email, password, image_url)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [username, first_name, last_name, email, password, image_url]
    );

    return sanitizeUser(rows[0]);
  }

  static async findUserByRefreshToken(refreshToken) {
    const { rows } = await executeQuery(
      `SELECT * FROM users 
       WHERE refresh_token = $1 
       AND refresh_token_expires_at > NOW()`,
      [refreshToken]
    );
    return rows?.[0] || null;
  }

  static async findByEmail(email) {
    const { rows } = await executeQuery(
      `SELECT * FROM users WHERE email = $1 LIMIT 1`,
      [email]
    );
    return rows?.[0] || null;
  }

  static async findByUsername(username) {
    const { rows } = await executeQuery(
      `SELECT * FROM users WHERE username = $1 LIMIT 1`,
      [username]
    );
    return rows?.[0] || null;
  }

  static async findById(id) {
    const { rows } = await executeQuery(
      `SELECT * FROM users WHERE id = $1 LIMIT 1`,
      [id]
    );
    return rows?.[0] || null;
  }

  static async findAll() {
    const { rows } = await executeQuery(`SELECT * FROM users`);
    return rows;
  }

  static async updateWithHashedToken(id, refresh_token, tokenSignature) {
    await executeQuery(
      `UPDATE users 
       SET last_login = NOW(),
           refresh_token = $1,
           token_signature = $2,
           refresh_token_expires_at = NOW() + INTERVAL '7 days'
       WHERE id = $3`,
      [refresh_token, tokenSignature, id]
    );
  }

  static async saveResetToken(userId, hashedToken, rawToken) {
    await executeQuery(
      `INSERT INTO password_resets (user_id, token, token_hash, created_at, expires_at, is_used)
       VALUES ($1, $2, $3, NOW(), NOW() + INTERVAL '30 minutes', FALSE)
       ON CONFLICT (user_id)
       DO UPDATE SET
         token = EXCLUDED.token,
         token_hash = EXCLUDED.token_hash,
         created_at = EXCLUDED.created_at,
         expires_at = EXCLUDED.expires_at,
         is_used = FALSE`,
      [userId, rawToken, hashedToken]
    );
  }

  // ✅ FIXED TRANSACTION
  static async passwordReset(userId, token, newPassword) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const { rows } = await client.query(
        `SELECT * FROM password_resets
         WHERE user_id = $1 AND is_used = FALSE AND expires_at > NOW()`,
        [userId]
      );

      if (!rows.length) {
        throw new ApiError(400, 'Invalid or expired token');
      }

      const record = rows[0];
      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

      if (
        !crypto.timingSafeEqual(
          Buffer.from(record.token_hash, 'hex'),
          Buffer.from(hashedToken, 'hex')
        )
      ) {
        throw new ApiError(400, 'Invalid reset token');
      }

      const newHashedPassword = await User.hashPassword(newPassword);

      await client.query(
        `UPDATE users
         SET password = $1, password_changed_at = NOW()
         WHERE id = $2`,
        [newHashedPassword, userId]
      );

      await client.query(
        `UPDATE password_resets SET is_used = TRUE WHERE id = $1`,
        [record.id]
      );

      await client.query('COMMIT');
      return { success: true, message: 'Password updated successfully' };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  // ✅ FIXED TRANSACTION
  static async passwordChange(userId, newPassword) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const hashed = await User.hashPassword(newPassword);

      await client.query(
        `UPDATE users
         SET password = $1, password_changed_at = NOW()
         WHERE id = $2`,
        [hashed, userId]
      );

      await client.query('COMMIT');
      return { success: true, message: 'Password changed. Please login again.' };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  static async logOutUser(id) {
    await executeQuery(
      `UPDATE users
       SET refresh_token = NULL,
           refresh_token_expires_at = NULL,
           token_signature = NULL
       WHERE id = $1`,
      [id]
    );
  }

  static async storeRefreshToken(userId, refreshTokenHash, tokenSignature) {
    await executeQuery(
      `UPDATE users
       SET refresh_token = $1,
           token_signature = $2,
           refresh_token_expires_at = NOW() + INTERVAL '7 days'
       WHERE id = $3`,
      [refreshTokenHash, tokenSignature, userId]
    );
  }

  static async findUserByGoogleId(googleId) {
    const { rows } = await executeQuery(
      `SELECT * FROM users WHERE google_id = $1 LIMIT 1`,
      [googleId]
    );
    return rows?.[0] || null;
  }

  static async saveUserGoogle(sub, email, first_name, last_name, picture, email_verified) {
    const username = email.split('@')[0];

    await executeQuery(
      `INSERT INTO users
       (google_id, username, email, first_name, last_name, image_url, verified, password)
       VALUES ($1, $2, $3, $4, $5, $6, $7, '[google-auth]')`,
      [sub, username, email, first_name, last_name, picture, email_verified]
    );

    return User.findUserByGoogleId(sub);
  }

  static async deleteUserInDB(id) {
    await executeQuery(`DELETE FROM users WHERE id = $1`, [id]);
  }

  static async dynamicQueryUpdate(updateParams, setClause) {
    const { rows } = await executeQuery(
      `UPDATE users SET ${setClause} WHERE id = $${updateParams.length} RETURNING *`,
      updateParams
    );
    return sanitizeUser(rows[0]);
  }
}

module.exports = User;