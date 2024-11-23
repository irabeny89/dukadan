import { t } from "elysia";
import { getSettings } from "../config";
import { db } from "../lib/db";
import log from "../lib/logger";
import { Customer } from "./customer.model";
import type { PageQueryT } from "../types";
import {
  convertValuesToNaira,
  createMetadata,
  createSqlForPaging,
  createSqlForPagingWhereId,
  preparePageQuery,
  snakeCaseToCamelCase,
} from "../utils";

type OrderStatusT = "pending" | "processing" | "done";

type OrderT = {
  quantity: number;
  address: string;
  phone: string;
  userId: number;
};

const setting = getSettings();

export const pageQuerySchema = t.Object({
  page: t.Number({
    minimum: 1,
    default: 1,
    description: "Page number",
  }),
  size: t.Number({
    minimum: 1,
    default: 10,
    description: "Page size",
  }),
  sort: t.String({
    description: "Sort by a column/field value.",
    default: "created_at",
  }),
  order: t.UnionEnum(["asc", "desc"], {
    description: "Ordering in ascending or descending.",
    default: "desc",
  }),
});
export const orderStatusSchema = t.UnionEnum(["pending", "processing", "done"]);
export const patchSchema = t.Object({
  status: orderStatusSchema,
});
export const orderSchema = t.Object({
  quantity: t.Number({ minimum: 1 }),
  address: t.String(),
  phone: t.String(),
});

export class Order {
  readonly id?: number;
  readonly createdAt?: Date | string;
  readonly updatedAt?: Date | string;
  paidAt?: Date | string;
  userId: number;
  quantity: number;
  cylinderUnit = "KG";
  address: string;
  phone: string;
  pricePerKg: number;
  price: number;
  deliveryFee: number;
  status: OrderStatusT = "pending";

  // #region constructor
  constructor(data: OrderT) {
    const { deliveryFee, pricePerKg } = setting;
    this.quantity = data.quantity;
    this.address = data.address;
    this.phone = data.phone;
    this.pricePerKg = pricePerKg * 100;
    this.deliveryFee = deliveryFee * 100;
    this.price = pricePerKg * data.quantity * 100;
    this.userId = data.userId;
  }

  // #region getTableName
  /**
   * Returns the name for this model on the database.
   * This can be interpolated in sql queries.
   *
   * @returns table name for this model on the database
   */
  static getTableName() {
    return "orders";
  }

  // #region createTable
  /**
   * Create a table if not on the database.
   */
  static createTable() {
    db.run(`CREATE TABLE IF NOT EXISTS ${Order.getTableName()} (
						id INTEGER PRIMARY KEY AUTOINCREMENT,
						quantity NUMERIC NOT NULL,
						cylinderUnit TEXT NOT NULL,
						address TEXT NOT NULL,
						phone TEXT NOT NULL,
						pricePerKg NUMERIC NOT NULL,
						deliveryFee NUMERIC NOT NULL,
						price NUMERIC NOT NULL,
						status TEXT NOT NULL,
						createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
						updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
						paidAt TIMESTAMP,
						userId INTEGER NOT NULL,
						FOREIGN KEY(userId) REFERENCES ${Customer.getTableName()}(id)
	);`);

    log([
      {
        value: `\u2705 ${Customer.getTableName()}`,
      },
      { value: "table created or exists." },
    ]);
  }

  // #region createUpdatedAtTrigger
  /**
   * Creates a trigger(if not exist) to update the `updatedAt` field whenever a record is edited on the table.
   */
  static createUpdatedAtTrigger() {
    db.run(`CREATE TRIGGER IF NOT EXISTS ${Order.getTableName()}_updatedAt_trigger
						AFTER UPDATE ON ${Order.getTableName()}
						BEGIN
    				  UPDATE ${Order.getTableName()}
    					SET updatedAt = CURRENT_TIMESTAMP;
						END;`);

    log([
      {
        value: `\u2705 ${Customer.getTableName()}`,
      },
      { value: "updatedAt trigger created or exists." },
    ]);
  }

  // #region findAll
  /**
   * Find all records of order on the database.
   * @returns list of orders
   */
  static findAll(query?: PageQueryT) {
    const q = preparePageQuery(query);

    const tableName = Order.getTableName();
    const countSql = `SELECT COUNT(*) FROM ${tableName}`;
    const pagingSql = `SELECT * FROM ${tableName}
                       ORDER BY ${q.sort} ${q.order}
                       LIMIT ${q.size}
                       OFFSET ${(q.page - 1) * q.size};`;

    //* result: [{"COUNT(*)": 7}]
    //?  N.B it could be `count(*)` depending on SQL used
    const [res] = db.prepare<number, string>(countSql).all("");
    const totalItems = Object.values(res)[0];

    const metadata = createMetadata(totalItems, q.page, q.size);
    const data = db
      .prepare<Order, string>(pagingSql)
      .all("")
      // convert back to main currency (naira)
      .map(convertValuesToNaira(["pricePerKg", "deliveryFee", "price"]));

    return { data, metadata };
  }

  // #region findAllByUserId
  /**
   * Finds all orders by user id.
   * @param userId user id in order.
   * @returns list of orders by user id.
   */
  static findAllByUserId(userId: number, query?: PageQueryT) {
    const q = preparePageQuery(query);

    const tableName = Order.getTableName();
    const countSql = `SELECT COUNT(*) FROM ${tableName}`;
    const pagingSql = `SELECT * FROM ${tableName}
                       WHERE "userId" = ?
                       ORDER BY ${q.sort} ${q.order}
                       LIMIT ${q.size}
                       OFFSET ${(q.page - 1) * q.size};`;

    //* result: [{"COUNT(*)": 7}]
    //?  N.B it could be `count(*)` depending on SQL used
    const [res] = db.prepare<number, string>(countSql).all("");
    const totalItems = Object.values(res)[0];

    const metadata = createMetadata(totalItems, q.page, q.size);
    const data = db
      .prepare<Order, number>(pagingSql)
      .all(userId)
      // convert back to main currency (naira)
      .map(convertValuesToNaira(["pricePerKg", "deliveryFee", "price"]));

    return { data, metadata };
  }

  // #region findById
  /**
   * Finds a record by id from the database.
   * @param id record id
   * @returns record instance
   */
  static findById(id: number) {
    const sql = `SELECT * FROM ${Order.getTableName()}
                 WHERE id = ?;`;
    const order = db.prepare<Order, number>(sql).get(id);
    if (!order) return order;
    // only process order if it exists
    // convert money values to main amount (naira)
    order.pricePerKg /= 100;
    order.deliveryFee /= 100;
    order.price /= 100;
    return order;
  }

  // #region findByIdForUser
  /**
   * Finds all orders by user and order id.
   * @param id order id
   * @param userId user id on order
   * @returns list of orders.
   */
  static findByIdForUser(id: number, userId: number) {
    const sql = `SELECT * FROM ${Order.getTableName()}
                 WHERE id = $id AND userId = $userId;`;
    const order = db.prepare(sql).as(Order).get({ id, userId });
    if (!order) return order;
    // only process order if it exists
    // convert money values to main amount (naira)
    order.pricePerKg /= 100;
    order.deliveryFee /= 100;
    order.price /= 100;
    return order;
  }

  // #region updateById
  /**
   * Update a record on database.
   * @param id record id
   * @param order fields to update
   * @returns fields updated
   */
  static updateById(
    id: number,
    order: Partial<Pick<Order, "status" | "paidAt">>,
  ) {
    // ! REMEMBER TO CONVERT MONEY VALUES TO MAIN UNIT

    const batchUpdate = db.transaction((entries) => {
      for (const [k, v] of entries) {
        const sql = `UPDATE ${Order.getTableName()}
                     SET ${k} = ?1
                     WHERE id = ?2;`;
        db.run(sql, [v.toString(), id]);
      }
    });

    const entries = Object.entries(order);
    batchUpdate(entries);

    return entries;
  }

  // #region save
  /**
   * Saves the user instance data to database.
   * @returns void
   */
  save() {
    const sql = `INSERT INTO ${Order.getTableName()} (
      quantity,
      cylinderUnit,
      address,
      phone,
      pricePerKg,
      deliveryFee,
      price,
      status,
      userId
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`;

    return db.run(sql, [
      this.quantity,
      this.cylinderUnit,
      this.address,
      this.phone,
      this.pricePerKg,
      this.deliveryFee,
      this.price,
      this.status,
      this.userId,
    ]);
  }
}
