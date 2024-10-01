import { t } from "elysia";
import { db } from "../lib";

export const tokenSchema = t.Object({
	userId: t.Number(),
	role: t.UnionEnum(["customer", "driver", "admin", "owner"]),
});

export const cookieSchema = t.Cookie({
	refresh: t.Optional(t.String()),
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

type SignupInputT = typeof signupSchema.static;

export class User {
	id?: number
	createdAt?: Date | string
	updatedAt?: Date | string
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
	 * ? This reduces errors.
	 * @returns table name for this model on the database
	 */
	static getTableName() {
		return "users"
	}

	// #region createTable
	/**
	 * Create a table if not on the database.
	 */
	static createTable() {
		db.run(`CREATE TABLE IF NOT EXISTS ${User.getTableName()} (
						id INTEGER PRIMARY KEY AUTOINCREMENT,
						username TEXT NOT NULL UNIQUE,
						email TEXT NOT NULL UNIQUE,
						password TEXT NOT NULL,
						createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
						updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);`);
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
		db.run(`CREATE TRIGGER IF NOT EXISTS updateAt_trigger	
						AFTER UPDATE ON ${User.getTableName()}
						BEGIN
							UPDATE ${User.getTableName()} 
							SET updatedAt = CURRENT_TIMESTAMP;
						END;`)
	}

	// #region findById
	/**
	 * Finds a record by id from the database.
	 * @param id record id
	 * @returns record instance
	 */
	static findById(id: string) {
		return db
			.prepare<User, string>(`SELECT * 
															FROM ${User.getTableName()} 
															WHERE id = ?;`)
			.get(id);
	}

	// #region findBy
	/**
	 * Finds a user by email or username from the database.
	 * @param opt `email` or `username` option
	 * @param value email or username value
	 * @returns user instance
	 */
	static findBy(opt: "email" | "username", value: string) {
		const sqlForEmail = `SELECT * 
												FROM ${User.getTableName()} 
												WHERE email = ?;`;
		const sqlForUsername = `SELECT * 
														FROM ${User.getTableName()} 
														WHERE username = ?;`

		return opt === "email"
			? db
				.prepare<User, string>(sqlForEmail)
				.get(value)
			: db
				.prepare<User, string>(sqlForUsername)
				.get(value);
	}

	// #region updateById
	/**
	 * Update a record on database.
	 * @param id record id
	 * @param user fields to update
	 * @returns fields updated
	 */
	static updateById(id: number, user: Partial<Omit<User, "id" | "save">>) {
		const batchUpdate = db.transaction((entries) => {
			for (const [k, v] of entries) {
				const sql = `UPDATE ${User.getTableName()} 
										 SET ${k} = ?1
										 WHERE id = ?2;`
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
		const sql = `INSERT INTO ${User.getTableName()} 
								 (username, email, password) 
								 VALUES (?, ?, ?);`

		return db.run(sql, [this.username, this.email, this.password]);
	}
}
