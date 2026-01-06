import { pool } from '../config/database';
import { Client, CreateClientDTO } from '../types';

export class ClientModel {
  static async create(userId: string, data: CreateClientDTO): Promise<Client> {
    const query = `
      INSERT INTO clients (user_id, name, email, phone, address, city, state, zip, country)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    const values = [
      userId,
      data.name,
      data.email,
      data.phone || null,
      data.address || null,
      data.city || null,
      data.state || null,
      data.zip || null,
      data.country || null,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByUserId(userId: string): Promise<Client[]> {
    const query = 'SELECT * FROM clients WHERE user_id = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  static async findById(id: string, userId: string): Promise<Client | null> {
    const query = 'SELECT * FROM clients WHERE id = $1 AND user_id = $2';
    const result = await pool.query(query, [id, userId]);
    return result.rows[0] || null;
  }

  static async update(
    id: string,
    userId: string,
    data: Partial<CreateClientDTO>
  ): Promise<Client | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      return this.findById(id, userId);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id, userId);

    const query = `
      UPDATE clients
      SET ${fields.join(', ')}
      WHERE id = $${paramCount} AND user_id = $${paramCount + 1}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  static async delete(id: string, userId: string): Promise<boolean> {
    const query = 'DELETE FROM clients WHERE id = $1 AND user_id = $2';
    const result = await pool.query(query, [id, userId]);
    return (result.rowCount ?? 0) > 0;
  }
}

