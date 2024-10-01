import { t } from "elysia";
import { db } from "../lib";
import { IdAndTimestamp } from "./common";

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

export class User extends IdAndTimestamp {
	username;
	email;
	password;

	// #region constructor
	constructor(data: SignupInputT) {
		super();
		this.username = data.username.trim().toLowerCase();
		this.email = data.email.trim().toLowerCase();
		this.password = Bun.password.hashSync(data.password);
	}

	// #region createTable
	/**
	 * Creates a table for users if not already existing on the database.
	 */
	static createTable() {
		db.run(
			"CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE, email TEXT NOT NULL UNIQUE, password TEXT NOT NULL, createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP);",
		);
	}

	// #region findById
	/**
	 * Finds a user by id from the database.
	 * @param id user id
	 * @returns user instance
	 */
	static findById(id: string) {
		return db
			.prepare<User, string>("SELECT * FROM users WHERE id = ?;")
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
		return opt === "email"
			? db
					.prepare<User, string>("SELECT * FROM users WHERE email = ?;")
					.get(value)
			: db
					.prepare<User, string>("SELECT * FROM users WHERE username = ?;")
					.get(value);
	}

	// #region update
	static update(id: number, user: Partial<Omit<User, "id" | "save">>) {
		const batchUpdate = db.transaction((entries) => {
			for (const [k, v] of entries) {
				db.run(`UPDATE users SET ${k} = ?1 WHERE id = ?2;`, [v.toString(), id]);
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
		return db.run(
			"INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
			[this.username, this.email, this.password],
		);
	}
}
