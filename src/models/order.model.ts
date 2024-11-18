import { t } from "elysia";
import { getSettings } from "../config";
import { db } from "../lib/db";
import log from "../lib/logger";
import { Customer } from "./customer.model";

type OrderStatusT =
	| "pending"
	| "processing"
	| "retrieving"
	| "delivering"
	| "completed";

type OrderT = {
	quantity: number;
	address: string;
	phone: string;
	userId: number;
};

const setting = getSettings();

export const orderStatusSchema = t.UnionEnum([
	"pending",
	"processing",
	"retrieving",
	"delivering",
	"completed",
]);
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
	price: number;
	deliveryFee: number;
	status: OrderStatusT = "pending";

	// #region constructor
	constructor(data: OrderT) {
		const { deliveryFee, pricePerKg } = setting;
		this.quantity = data.quantity;
		this.address = data.address;
		this.phone = data.phone;
		this.price = pricePerKg * data.quantity;
		this.deliveryFee = deliveryFee * 100;
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
						price NUMERIC NOT NULL,
						deliveryFee NUMERIC NOT NULL,
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
	static findAll() {
		const sql = `SELECT * FROM ${Order.getTableName()};`;
		return db
			.prepare<Order, string>(sql)
			.all("")
			.map((item) => {
				// convert back to main currency (naira)
				item.deliveryFee = item.deliveryFee / 100;
				item.price = item.price / 100;
				return item;
			});
	}

	// #region findAllByUserId
	/**
	 * Finds all orders by user id.
	 * @param userId user id in order.
	 * @returns list of orders by user id.
	 */
	static findAllByUserId(userId: number) {
		return db
			.prepare<Order, number>(
				`SELECT * FROM ${Order.getTableName()}
         WHERE "userId" = ?;`,
			)
			.all(userId)
			.map((item) => {
				// convert money value back to main amount (naira)
				item.deliveryFee = item.deliveryFee / 100;
				item.price = item.price / 100;
				return item;
			});
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
		order.deliveryFee = order.deliveryFee / 100;
		order.price = order.price / 100;
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
                 WHERE id = $id; AND userId = $userId;`;
		const order = db.prepare(sql).as(Order).get({ id, userId });
		if (!order) return order;
		// only process order if it exists
		// convert money values to main amount (naira)
		order.deliveryFee = order.deliveryFee / 100;
		order.price = order.price / 100;
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
      price,
      deliveryFee,
      status,
      userId
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`;

		return db.run(sql, [
			this.quantity,
			this.cylinderUnit,
			this.address,
			this.phone,
			this.price,
			this.deliveryFee,
			this.status,
			this.userId,
		]);
	}
}
