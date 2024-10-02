import { db } from "../lib/db";
import { User } from "./user";

export class Feedback {
	id?: number;
	createdAt?: Date | string;
	updatedAt?: Date | string;
	userId: number;
	message: string;

	// #region constructor
	constructor(userId: number, message: string) {
		this.userId = userId;
		this.message = message;
	}

	/**
	 * Returns the name for this model on the database.
	 * This can be interpolated in sql queries.
	 *
	 * ? This reduces errors.
	 * @returns table name for this model on the database
	 */
	static getTableName() {
		return "feedbacks";
	}

	// #region createTable
	/**
	 * Create a table if not on the database.
	 */
	static createTable() {
		db.run(
			`CREATE TABLE IF NOT EXISTS ${Feedback.getTableName()} (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       userId INTEGER NOT NULL,
       message TEXT NOT NULL,
       createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       FOREIGN KEY(userId) REFERENCES ${User.getTableName()}(id) 
       ON DELETE CASCADE
			 );`,
		);
	}

	// #region createUpdatedAtTrigger
	/**
	 * Creates a trigger(if not exist) to update the `updatedAt` field whenever a record is edited on the table.
	 */
	static createUpdatedAtTrigger() {
		db.run(`CREATE TRIGGER ${Feedback.getTableName()}_updateAt_trigger
						AFTER UPDATE ON ${Feedback.getTableName()}
						BEGIN
   						UPDATE ${Feedback.getTableName()}
   						SET updatedAt = CURRENT_TIMESTAMP
						END;`);
	}

	// #region findById
	/**
	 * Finds a record by id from the database.
	 * @param id record id
	 * @returns record instance
	 */
	static findById(id: string) {
		const sql = `SELECT * 
                 FROM ${Feedback.getTableName()}
                 WHERE id = ?;`;
		return db.prepare<Feedback, string>(sql).get(id);
	}

	// #region updateById
	/**
	 * Update a record on database.
	 * @param id record id
	 * @param feedback fields to update
	 * @returns fields updated
	 */
	static updateById(id: number, feedback: Feedback) {
		const batchUpdate = db.transaction((entries) => {
			for (const [k, v] of entries) {
				const sql = `UPDATE ${Feedback.getTableName()} 
                     SET ${k} = ?1 
                     WHERE id = ?2;`;
				db.run(sql, [v.toString(), id]);
			}
		});

		const entries = Object.entries(feedback);
		batchUpdate(entries);

		return entries;
	}

	// #region save
	/**
	 * Saves the user instance data to database.
	 * @returns void
	 */
	save() {
		const sql = `INSERT INTO ${Feedback.getTableName()} 
								 (userId, message) 
                 VALUES (?, ?);`;

		return db.run(sql, [this.userId, this.message]);
	}
}
