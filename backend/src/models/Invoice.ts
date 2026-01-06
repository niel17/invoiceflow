import { pool } from '../config/database';
import {
  Invoice,
  InvoiceWithRelations,
  CreateInvoiceDTO,
  UpdateInvoiceDTO,
  InvoiceLineItem,
} from '../types';
import { calculateInvoiceTotals } from '../utils/invoiceCalculator';

export class InvoiceModel {
  static async create(
    userId: string,
    data: CreateInvoiceDTO
  ): Promise<InvoiceWithRelations> {
    const totals = calculateInvoiceTotals(data);

    // Generate invoice number
    const invoiceNumber = await this.generateInvoiceNumber(userId);

    const client = await pool.query('SELECT * FROM clients WHERE id = $1 AND user_id = $2', [
      data.client_id,
      userId,
    ]);

    if (!client.rows[0]) {
      throw new Error('Client not found');
    }

    // Create invoice
    const invoiceQuery = `
      INSERT INTO invoices (
        user_id, client_id, invoice_number, issue_date, due_date,
        payment_terms, subtotal, tax_rate, tax_amount, discount_type,
        discount_value, discount_amount, total, notes, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *
    `;

    const invoiceValues = [
      userId,
      data.client_id,
      invoiceNumber,
      data.issue_date,
      data.due_date,
      data.payment_terms,
      totals.subtotal,
      data.tax_rate,
      totals.taxAmount,
      data.discount_type || null,
      data.discount_value || null,
      totals.discountAmount,
      totals.total,
      data.notes || null,
      'draft',
    ];

    const invoiceResult = await pool.query(invoiceQuery, invoiceValues);
    const invoice = invoiceResult.rows[0];

    // Create line items
    const lineItems: InvoiceLineItem[] = [];
    for (const item of data.line_items) {
      const lineItemQuery = `
        INSERT INTO invoice_line_items (invoice_id, description, quantity, rate, amount)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      const lineItemValues = [
        invoice.id,
        item.description,
        item.quantity,
        item.rate,
        item.quantity * item.rate,
      ];
      const lineItemResult = await pool.query(lineItemQuery, lineItemValues);
      lineItems.push(lineItemResult.rows[0]);
    }

    return {
      ...invoice,
      line_items: lineItems,
      client: client.rows[0],
    };
  }

  static async findByUserId(
    userId: string,
    filters?: {
      status?: string;
      clientId?: string;
      startDate?: string;
      endDate?: string;
    }
  ): Promise<InvoiceWithRelations[]> {
    let query = `
      SELECT i.*, 
        json_agg(
          json_build_object(
            'id', li.id,
            'description', li.description,
            'quantity', li.quantity,
            'rate', li.rate,
            'amount', li.amount,
            'created_at', li.created_at
          )
        ) as line_items,
        json_build_object(
          'id', c.id,
          'name', c.name,
          'email', c.email,
          'phone', c.phone,
          'address', c.address,
          'city', c.city,
          'state', c.state,
          'zip', c.zip,
          'country', c.country
        ) as client
      FROM invoices i
      LEFT JOIN invoice_line_items li ON i.id = li.invoice_id
      LEFT JOIN clients c ON i.client_id = c.id
      WHERE i.user_id = $1
    `;

    const values: any[] = [userId];
    let paramCount = 2;

    if (filters?.status) {
      query += ` AND i.status = $${paramCount}`;
      values.push(filters.status);
      paramCount++;
    }

    if (filters?.clientId) {
      query += ` AND i.client_id = $${paramCount}`;
      values.push(filters.clientId);
      paramCount++;
    }

    if (filters?.startDate) {
      query += ` AND i.issue_date >= $${paramCount}`;
      values.push(filters.startDate);
      paramCount++;
    }

    if (filters?.endDate) {
      query += ` AND i.issue_date <= $${paramCount}`;
      values.push(filters.endDate);
      paramCount++;
    }

    query += ` GROUP BY i.id, c.id ORDER BY i.created_at DESC`;

    const result = await pool.query(query, values);
    return result.rows.map((row) => ({
      ...row,
      line_items: row.line_items[0]?.id ? row.line_items : [],
    }));
  }

  static async findById(id: string, userId: string): Promise<InvoiceWithRelations | null> {
    const query = `
      SELECT i.*,
        json_agg(
          json_build_object(
            'id', li.id,
            'description', li.description,
            'quantity', li.quantity,
            'rate', li.rate,
            'amount', li.amount,
            'created_at', li.created_at
          )
        ) as line_items,
        json_build_object(
          'id', c.id,
          'name', c.name,
          'email', c.email,
          'phone', c.phone,
          'address', c.address,
          'city', c.city,
          'state', c.state,
          'zip', c.zip,
          'country', c.country
        ) as client
      FROM invoices i
      LEFT JOIN invoice_line_items li ON i.id = li.invoice_id
      LEFT JOIN clients c ON i.client_id = c.id
      WHERE i.id = $1 AND i.user_id = $2
      GROUP BY i.id, c.id
    `;

    const result = await pool.query(query, [id, userId]);
    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      ...row,
      line_items: row.line_items[0]?.id ? row.line_items : [],
    };
  }

  static async update(
    id: string,
    userId: string,
    data: UpdateInvoiceDTO
  ): Promise<InvoiceWithRelations | null> {
    const invoice = await this.findById(id, userId);
    if (!invoice) {
      return null;
    }

    // If line items are being updated, recalculate totals
    let totals;
    if (data.line_items) {
      const invoiceData: CreateInvoiceDTO = {
        client_id: data.client_id || invoice.client_id,
        issue_date: data.issue_date || invoice.issue_date.toISOString().split('T')[0],
        due_date: data.due_date || invoice.due_date.toISOString().split('T')[0],
        payment_terms: data.payment_terms || invoice.payment_terms,
        tax_rate: data.tax_rate ?? invoice.tax_rate,
        discount_type: data.discount_type || invoice.discount_type,
        discount_value: data.discount_value ?? invoice.discount_value,
        line_items: data.line_items,
      };
      totals = calculateInvoiceTotals(invoiceData);
    }

    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.status) {
      fields.push(`status = $${paramCount}`);
      values.push(data.status);
      paramCount++;
    }

    if (data.issue_date) {
      fields.push(`issue_date = $${paramCount}`);
      values.push(data.issue_date);
      paramCount++;
    }

    if (data.due_date) {
      fields.push(`due_date = $${paramCount}`);
      values.push(data.due_date);
      paramCount++;
    }

    if (data.payment_terms) {
      fields.push(`payment_terms = $${paramCount}`);
      values.push(data.payment_terms);
      paramCount++;
    }

    if (totals) {
      fields.push(`subtotal = $${paramCount}`);
      values.push(totals.subtotal);
      paramCount++;

      fields.push(`tax_rate = $${paramCount}`);
      values.push(totals.taxAmount / (totals.subtotal - totals.discountAmount) * 100);
      paramCount++;

      fields.push(`tax_amount = $${paramCount}`);
      values.push(totals.taxAmount);
      paramCount++;

      fields.push(`discount_amount = $${paramCount}`);
      values.push(totals.discountAmount);
      paramCount++;

      fields.push(`total = $${paramCount}`);
      values.push(totals.total);
      paramCount++;
    }

    if (data.notes !== undefined) {
      fields.push(`notes = $${paramCount}`);
      values.push(data.notes);
      paramCount++;
    }

    if (fields.length === 0) {
      return invoice;
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id, userId);

    const query = `
      UPDATE invoices
      SET ${fields.join(', ')}
      WHERE id = $${paramCount} AND user_id = $${paramCount + 1}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return null;
    }

    // Update line items if provided
    if (data.line_items) {
      await pool.query('DELETE FROM invoice_line_items WHERE invoice_id = $1', [id]);
      for (const item of data.line_items) {
        await pool.query(
          `INSERT INTO invoice_line_items (invoice_id, description, quantity, rate, amount)
           VALUES ($1, $2, $3, $4, $5)`,
          [id, item.description, item.quantity, item.rate, item.quantity * item.rate]
        );
      }
    }

    return this.findById(id, userId);
  }

  static async delete(id: string, userId: string): Promise<boolean> {
    const query = 'DELETE FROM invoices WHERE id = $1 AND user_id = $2';
    const result = await pool.query(query, [id, userId]);
    return (result.rowCount ?? 0) > 0;
  }

  private static async generateInvoiceNumber(userId: string): Promise<string> {
    const year = new Date().getFullYear();
    const result = await pool.query(
      `SELECT COUNT(*) as count FROM invoices 
       WHERE user_id = $1 AND EXTRACT(YEAR FROM created_at) = $2`,
      [userId, year]
    );
    const count = parseInt(result.rows[0].count) + 1;
    return `INV-${year}-${String(count).padStart(4, '0')}`;
  }
}

