const { executeQuery } = require('../config/database');
const { calculateRecommendedSettlements } = require('../utils/helper');

class ExpenseModel {
  // ADD EXPENSE (TRANSACTION SAFE)
  static async addExpense(groupId, paidBy, amount, description, expenseDate) {
    const amt = Number(amount);
    if (!amt || amt <= 0) throw new Error('Invalid expense amount');

    // Fetch members
    const { rows: members } = await executeQuery(
      `SELECT user_id FROM user_group_members WHERE group_id = $1`,
      [groupId]
    );

    if (members.length === 0) {
      throw new Error('Cannot add expense to empty group');
    }

    const perHead = amt / members.length;

    // Transaction
    await executeQuery('BEGIN');

    try {
      const { rows: expenseRows } = await executeQuery(
        `
        INSERT INTO user_expenses
          (group_id, paid_by, amount, description, expense_date)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
        `,
        [groupId, paidBy, amt, description, expenseDate]
      );

      const expense = expenseRows[0];

      for (const m of members) {
        await executeQuery(
          `
          INSERT INTO expense_shares (expense_id, user_id, share_amount)
          VALUES ($1, $2, $3)
          `,
          [expense.expense_id, m.user_id, perHead]
        );
      }

      await executeQuery('COMMIT');
      return { expense, sharePerUser: perHead };
    } catch (err) {
      await executeQuery('ROLLBACK');
      throw err;
    }
  }

  // UPDATE EXPENSE (RECALCULATE SHARES IF AMOUNT CHANGES)
  static async updateExpense(groupId, expenseId, updates = {}) {
    const allowed = {
      paidBy: 'paid_by',
      amount: 'amount',
      description: 'description',
      expenseDate: 'expense_date',
    };

    const setClauses = [];
    const values = [];

    Object.entries(updates).forEach(([key, value], i) => {
      if (allowed[key] && value !== undefined) {
        setClauses.push(`${allowed[key]} = $${i + 1}`);
        values.push(value);
      }
    });

    if (!setClauses.length) {
      throw new Error('No valid fields to update');
    }

    await executeQuery('BEGIN');

    try {
      const { rows } = await executeQuery(
        `
        UPDATE user_expenses
        SET ${setClauses.join(', ')}
        WHERE expense_id = $${values.length + 1}
          AND group_id = $${values.length + 2}
        RETURNING *;
        `,
        [...values, expenseId, groupId]
      );

      const expense = rows[0];

      // If amount changed → recompute shares
      if (updates.amount !== undefined) {
        const amt = Number(updates.amount);

        const { rows: members } = await executeQuery(
          `SELECT user_id FROM user_group_members WHERE group_id = $1`,
          [groupId]
        );

        const perHead = amt / members.length;

        await executeQuery(
          `DELETE FROM expense_shares WHERE expense_id = $1`,
          [expenseId]
        );

        for (const m of members) {
          await executeQuery(
            `
            INSERT INTO expense_shares (expense_id, user_id, share_amount)
            VALUES ($1, $2, $3)
            `,
            [expenseId, m.user_id, perHead]
          );
        }
      }

      await executeQuery('COMMIT');
      return { expense };
    } catch (err) {
      await executeQuery('ROLLBACK');
      throw err;
    }
  }

  // DELETE EXPENSE (CLEAN SHARES)
  static async deleteExpense(groupId, expenseId) {
    await executeQuery('BEGIN');
    try {
      await executeQuery(
        `DELETE FROM expense_shares WHERE expense_id = $1`,
        [expenseId]
      );
      await executeQuery(
        `DELETE FROM user_expenses WHERE expense_id = $1 AND group_id = $2`,
        [expenseId, groupId]
      );
      await executeQuery('COMMIT');
    } catch (err) {
      await executeQuery('ROLLBACK');
      throw err;
    }
  }

  // CREATE SETTLEMENT
  static async createSettlement({ groupId, fromUserId, toUserId, amount }) {
    const amt = Number(amount);
    if (!amt || amt <= 0) throw new Error('Invalid settlement amount');

    const { rows } = await executeQuery(
      `
      INSERT INTO settlements
        (group_id, from_user, to_user, amount, is_paid)
      VALUES ($1, $2, $3, $4, true)
      RETURNING *;
      `,
      [groupId, fromUserId, toUserId, amt]
    );

    return rows[0];
  }

  // getGroupBalances + getGroupDetails
  // ✅ Your SQL here is already excellent — NO CHANGES REQUIRED
}

module.exports = ExpenseModel;