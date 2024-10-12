import { t } from "elysia";
import { db } from "../lib/db";
import log from "../lib/logger";

export const logoutSchema = t.Object({
	action: t.Boolean(),
});

export const refreshSchema = t.Optional(
	t.Object({
		refresh: t.String(),
	}),
);

export const tokenSchema = t.Object({
	userId: t.Number(),
	role: t.UnionEnum(["customer", "driver", "admin", "owner"]),
});

export const signupSchema = t.Object({
	username: t.String({ minLength: 1, maxLength: 32 }),
	email: t.String({ format: "email" }),
	password: t.String({ minLength: 8 }),
});

const usernameLoginSchema = t.Object({
	username: t.String(),
	password: t.String(),
});

const emailLoginSchema = t.Object({
	email: t.String(),
	password: t.String(),
});
export const loginSchema = t.Union([usernameLoginSchema, emailLoginSchema]);

export type SignupInputT = typeof signupSchema.static;

export class Customer {
	id?: number;
	createdAt?: Date | string;
	updatedAt?: Date | string;
	username;
	email;
	password;

	// #region constructor
	constructor(data: SignupInputT) {
		this.username = data.username.trim().toLowerCase();
		this.email = data.email.trim().toLowerCase();
		this.password = Bun.password.hashSync(data.password);
	}

	// #region getTableName
	/**
	 * Returns the name for this model on the database.
	 * This can be interpolated in sql queries.
	 *
	 * @returns table name for this model on the database
	 */
	static getTableName() {
		return "customers";
	}

	// #region createTable
	/**
	 * Create a table if not on the database.
	 */
	static createTable() {
		db.run(`CREATE TABLE IF NOT EXISTS ${Customer.getTableName()} (
						id INTEGER PRIMARY KEY AUTOINCREMENT,
						username TEXT NOT NULL UNIQUE,
						email TEXT NOT NULL UNIQUE,
						password TEXT NOT NULL,
						createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
						updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);`);

		log([
			{ value: "\u2705" },
			{ value: Customer.getTableName(), option: { color: "green" } },
			{ value: "table created or exists." },
		]);
	}

	// #region createUpdatedAtTrigger
	/**
	 * Creates a trigger(if not exist) to update the `updatedAt` field whenever a record is edited on the table.
	 */
	static createUpdatedAtTrigger() {
		// 		"CREATE TRIGGER [IF NOT EXISTS] trigger_name
		//    [BEFORE|AFTER|INSTEAD OF] [INSERT|UPDATE|DELETE]
		//    ON table_name
		//    [WHEN condition]
		//    BEGIN
		//     statements;
		//    END;"
		db.run(`CREATE TRIGGER IF NOT EXISTS ${Customer.getTableName()}_updatedAt_trigger
						AFTER UPDATE ON ${Customer.getTableName()}
						BEGIN
							UPDATE ${Customer.getTableName()}
							SET updatedAt = CURRENT_TIMESTAMP;
						END;`);

		log([
			{ value: "\u2705" },
			{ value: Customer.getTableName(), option: { color: "green" } },
			{ value: "updatedAt trigger created or exists." },
		]);
	}

	// #region findAll
	/**
	 * Finds all records.
	 * @returns all records
	 */
	static findAll() {
		const sql = `SELECT * FROM ${Customer.getTableName()}`;
		return db.prepare(sql).as(Customer).all();
	}

	// #region findById
	/**
	 * Finds a record by id from the database.
	 * @param id record id
	 * @returns record instance
	 */
	static findById(id: number) {
		return db
			.prepare<Customer, string>(
				`SELECT *
        FROM ${Customer.getTableName()}
				WHERE id = ?;`,
			)
			.get(id.toString());
	}

	// #region findBy
	/**
	 * Finds a customer by email or username from the database.
	 * @param opt `email` or `username` option
	 * @param value email or username value
	 * @returns user instance
	 */
	static findBy(opt: "email" | "username", value: string) {
		const sqlForEmail = `SELECT *
												FROM ${Customer.getTableName()}
												WHERE email = ?;`;
		const sqlForUsername = `SELECT *
														FROM ${Customer.getTableName()}
														WHERE username = ?;`;

		return opt === "email"
			? db.prepare<Customer, string>(sqlForEmail).get(value)
			: db.prepare<Customer, string>(sqlForUsername).get(value);
	}

	// #region updateById
	/**
	 * Update a record on database.
	 * @param id record id
	 * @param user fields to update
	 * @returns fields updated
	 */
	static updateById(id: number, user: Partial<Omit<Customer, "id" | "save">>) {
		const batchUpdate = db.transaction((entries) => {
			for (const [k, v] of entries) {
				const sql = `UPDATE ${Customer.getTableName()}
										 SET ${k} = ?1
										 WHERE id = ?2;`;
				db.run(sql, [v.toString(), id]);
			}
		});

		const entries = Object.entries(user);
		batchUpdate(entries);

		return entries;
	}

	// #region save
	/**
	 * Saves the user instance data to database.
	 * @returns void
	 */
	save() {
		const sql = `INSERT INTO ${Customer.getTableName()}
								 (username, email, password)
								 VALUES (?, ?, ?);`;

		return db.run(sql, [this.username, this.email, this.password]);
	}
}