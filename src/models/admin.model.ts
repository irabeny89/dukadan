import { t } from "elysia";
import { db } from "../lib/db";
import log from "../lib/logger";
import type { SignupInputT } from "./customer.model";

export class Admin {
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
		return "admins";
	}

	// #region createTable
	/**
	 * Create a table if not on the database.
	 */
	static createTable() {
		db.run(`CREATE TABLE IF NOT EXISTS ${Admin.getTableName()} (
						id INTEGER PRIMARY KEY AUTOINCREMENT,
						username TEXT NOT NULL UNIQUE,
						email TEXT NOT NULL UNIQUE,
						password TEXT NOT NULL,
						createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
						updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);`);

		log([
			{ value: "\u2705" },
			{ value: Admin.getTableName(), option: { color: "green" } },
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
		db.run(`CREATE TRIGGER IF NOT EXISTS ${Admin.getTableName()}_updatedAt_trigger
						AFTER UPDATE ON ${Admin.getTableName()}
						BEGIN
							UPDATE ${Admin.getTableName()}
							SET updatedAt = CURRENT_TIMESTAMP;
						END;`);

		log([
			{ value: "\u2705" },
			{ value: Admin.getTableName(), option: { color: "green" } },
			{ value: "updatedAt trigger created or exists." },
		]);
	}

	// #region findAll
	/**
	 * Finds all records.
	 * @returns all records
	 */
	static findAll() {
		const sql = `SELECT * FROM ${Admin.getTableName()}`;
		return db.prepare(sql).as(Admin).all();
	}

	// #region findById
	/**
	 * Finds a record by id from the database.
	 * @param id record id
	 * @returns record instance
	 */
	static findById(id: number) {
		return db
			.prepare<Admin, string>(
				`SELECT *
        FROM ${Admin.getTableName()}
				WHERE id = ?;`,
			)
			.get(id.toString());
	}

	// #region findBy
	/**
	 * Finds a owner by email or username from the database.
	 * @param opt `email` or `username` option
	 * @param value email or username value
	 * @returns user instance
	 */
	static findBy(opt: "email" | "username", value: string) {
		const sqlForEmail = `SELECT *
												FROM ${Admin.getTableName()}
												WHERE email = ?;`;
		const sqlForUsername = `SELECT *
														FROM ${Admin.getTableName()}
														WHERE username = ?;`;

		return opt === "email"
			? db.prepare<Admin, string>(sqlForEmail).get(value)
			: db.prepare<Admin, string>(sqlForUsername).get(value);
	}

	// #region updateById
	/**
	 * Update a record on database.
	 * @param id record id
	 * @param user fields to update
	 * @returns fields updated
	 */
	static updateById(id: number, user: Partial<Omit<Admin, "id" | "save">>) {
		const batchUpdate = db.transaction((entries) => {
			for (const [k, v] of entries) {
				const sql = `UPDATE ${Admin.getTableName()}
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
		const sql = `INSERT INTO ${Admin.getTableName()}
								 (username, email, password)
								 VALUES (?, ?, ?);`;

		return db.run(sql, [this.username, this.email, this.password]);
	}
}
