import { Request, Response } from "express";
import pool from "../config/postgres";
import { AuthRequest } from "../middlewares/auth.middleware";

export async function createOrder(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { items, totalAmount } = req.body;

    if (!items || items.length === 0) {
      res.status(400).json({ message: "Mahsulotlar majburiy" });
      return;
    }

    const orderId = `#TRX-${Date.now().toString().slice(-6)}`;

    await pool.query(
      "INSERT INTO orders (id, user_id, total_amount, status) VALUES ($1, $2, $3, $4)",
      [orderId, userId, totalAmount, "PENDING"]
    );

    for (const item of items) {
      await pool.query(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)",
        [orderId, item.productId, item.quantity, item.price]
      );
      await pool.query(
        "UPDATE products SET stock = stock - $1 WHERE id = $2",
        [item.quantity, item.productId]
      );
    }

    res.status(201).json({ message: "Buyurtma yaratildi", orderId });
  } catch (err) {
    res.status(500).json({ message: "Server xatosi" });
  }
}

export async function getOrders(req: AuthRequest, res: Response) {
  try {
    const result = await pool.query(`
      SELECT o.*, u.email as customer_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Server xatosi" });
  }
}

export async function getOrderById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const orderResult = await pool.query(`
      SELECT o.*, u.email as customer_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.id = $1
    `, [id]);

    if (orderResult.rows.length === 0) {
      res.status(404).json({ message: "Buyurtma topilmadi" });
      return;
    }

    const itemsResult = await pool.query(`
      SELECT oi.*, p.name, p.image
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1
    `, [id]);

    res.json({
      ...orderResult.rows[0],
      items: itemsResult.rows,
    });
  } catch (err) {
    res.status(500).json({ message: "Server xatosi" });
  }
}

export async function updateOrderStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const result = await pool.query(
      "UPDATE orders SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ message: "Buyurtma topilmadi" });
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server xatosi" });
  }
}

export async function getAnalytics(req: Request, res: Response) {
  try {
    const totalUsers = await pool.query("SELECT COUNT(*) FROM users");
    const totalOrders = await pool.query("SELECT COUNT(*) FROM orders");
    const revenue = await pool.query("SELECT SUM(total_amount) FROM orders WHERE status = 'DELIVERED'");
    const inStock = await pool.query("SELECT SUM(stock) FROM products");

    const monthlyRevenue = await pool.query(`
      SELECT TO_CHAR(created_at, 'YYYY-MM') as month, SUM(total_amount) as revenue
      FROM orders
      GROUP BY month
      ORDER BY month
    `);

    res.json({
      totalUsers: Number(totalUsers.rows[0].count),
      totalOrders: Number(totalOrders.rows[0].count),
      revenue: Number(revenue.rows[0].sum) || 0,
      inStock: Number(inStock.rows[0].sum) || 0,
      monthlyRevenue: monthlyRevenue.rows,
    });
  } catch (err) {
    res.status(500).json({ message: "Server xatosi" });
  }
}