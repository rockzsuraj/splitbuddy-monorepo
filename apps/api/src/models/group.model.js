const { executeQuery } = require('../config/database');

class Group {
  // CREATE GROUP
  static async createGroup(group_name, description, created_by, group_icon = null) {
    const { rows } = await executeQuery(
      `
      INSERT INTO user_groups
        (group_name, description, created_by, group_icon, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING *
      `,
      [group_name, description, created_by, group_icon]
    );

    return rows[0];
  }

  // FETCH GROUPS WHERE USER IS MEMBER
  static async fetchGroupsForUserMember(user_id) {
    const { rows } = await executeQuery(
      `
      SELECT ug.*
      FROM user_groups ug
      JOIN user_group_members ugm
        ON ug.group_id = ugm.group_id
      WHERE ugm.user_id = $1
      ORDER BY ug.created_at DESC
      `,
      [user_id]
    );

    return rows;
  }

  // FIND GROUP BY ID
  static async findById(group_id) {
    const { rows } = await executeQuery(
      `SELECT * FROM user_groups WHERE group_id = $1`,
      [group_id]
    );
    return rows?.[0] || null;
  }

  // ADD MEMBER (SAFE AGAINST DUPLICATES)
  static async addMember(groupId, user_id) {
    const { rows } = await executeQuery(
      `
      INSERT INTO user_group_members (group_id, user_id, joined_at)
      VALUES ($1, $2, NOW())
      ON CONFLICT (group_id, user_id) DO NOTHING
      RETURNING *
      `,
      [groupId, user_id]
    );

    return rows?.[0] || null;
  }

  // CHECK MEMBER EXISTS
  static async findMember(groupID, userID) {
    const { rows } = await executeQuery(
      `
      SELECT ugm.*
      FROM user_group_members ugm
      WHERE ugm.group_id = $1 AND ugm.user_id = $2
      `,
      [groupID, userID]
    );

    return rows?.[0] || null;
  }

  // REMOVE MEMBER
  static async removeMember(groupID, userID) {
    await executeQuery(
      `
      DELETE FROM user_group_members
      WHERE group_id = $1 AND user_id = $2
      `,
      [groupID, userID]
    );
  }

  // DELETE GROUP (MEMBERS FIRST)
  static async deleteGroup(groupID) {
    await executeQuery(
      `DELETE FROM user_group_members WHERE group_id = $1`,
      [groupID]
    );

    await executeQuery(
      `DELETE FROM user_groups WHERE group_id = $1`,
      [groupID]
    );
  }

  // UPDATE GROUP
  static async updateGroup(group_id, updates = {}) {
    const ALLOWED = ['group_name', 'description', 'split_mode', 'group_icon'];

    if (!group_id || Number.isNaN(Number(group_id))) {
      throw new Error('group_id must be a valid number');
    }

    const entries = Object.entries(updates).filter(
      ([key, value]) => ALLOWED.includes(key) && value !== undefined
    );

    if (entries.length === 0) {
      throw new Error('No valid fields provided to update');
    }

    const setClauses = entries.map(
      ([key], idx) => `${key} = $${idx + 1}`
    );
    const values = entries.map(([, value]) => value);

    const { rows } = await executeQuery(
      `
      UPDATE user_groups
      SET ${setClauses.join(', ')}
      WHERE group_id = $${values.length + 1}
      RETURNING *
      `,
      [...values, Number(group_id)]
    );

    return rows[0];
  }
}

module.exports = Group;