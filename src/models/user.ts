import { t } from "elysia";
import { db } from "../lib";
import { IdAndTimestamp } from "./common";

export const tokenSchema = t.Object({
	userId: t.Number(),
	role: t.UnionEnum(["customer", "driver", "admin", "owner"]),
});

export const cookieSchema = t.Cookie({
	token: t.Optional(tokenSchema),
});

export const signupInputSchema = t.Object({
	username: t.String({ minLength: 1, maxLength: 32 }),
	email: t.String({ format: "email" }),
	password: t.String({ minLength: 8 }),
});

type SignupInputT = typeof signupInputSchema.static;
type UserT = {
	id: number;
	username: string;
	email: string;
	createdAt: Date;
	updatedAt: Date;
};

export class User extends IdAndTimestamp {
	username;
	email;
	password;

	constructor(data: SignupInputT) {
		super();
		this.username = data.username.trim().toLowerCase();
		this.email = data.email.trim().toLowerCase();
		this.password = Bun.password.hashSync(data.password);
	}

	static createTable() {
		db.run(
			"CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL, email TEXT NOT NULL UNIQUE, password TEXT NOT NULL, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP);",
		);
	}

	static create(data: SignupInputT) {
		return new User(data);
	}

	static findById(id: string) {
		return db.prepare("SELECT * FROM users WHERE id = $id;").get({ id });
	}

	static findBy(opt: "email" | "username", value: string): UserT | null {
		return opt === "email"
			? (db
					.prepare("SELECT * FROM users WHERE email = ?1;")
					.get(value) as UserT | null)
			: (db
					.prepare("SELECT * FROM users WHERE username = ?1;")
					.get(value) as UserT | null);
	}

	save() {
		// TODO: save to db
		db.prepare(
			"INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
		).get(this.username, this.email, this.password);

		return this;
	}
}
