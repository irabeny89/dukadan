import { t } from "elysia";
import { db } from "../lib/db";
import log from "../lib/logger";
import { Customer } from "./customer.model";
import type { PageQueryT } from "../types";
import { preparePageQuery, createMetadata } from "../utils";

export const feedbackSchema = t.Object({
  message: t.String(),
});

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
       FOREIGN KEY(userId) REFERENCES ${Customer.getTableName()}(id)
       ON DELETE CASCADE
			 );`,
    );

    log([
      {
        value: `\u2705 ${Feedback.getTableName()}`,
      },
      { value: "table created or exists." },
    ]);
  }

  // #region createUpdatedAtTrigger
  /**
   * Creates a trigger(if not exist) to update the `updatedAt` field whenever a record is edited on the table.
   */
  static createUpdatedAtTrigger() {
    db.run(`CREATE TRIGGER IF NOT EXISTS ${Feedback.getTableName()}_updatedAt_trigger
						AFTER UPDATE ON ${Feedback.getTableName()}
						BEGIN
   						UPDATE ${Feedback.getTableName()}
   						SET updatedAt = CURRENT_TIMESTAMP;
						END;`);

    log([
      {
        value: `\u2705 ${Feedback.getTableName()}`,
      },
      { value: "updatedAt trigger created or exists." },
    ]);
  }

  // #region findAll
  /**
   * Find all records of feedback on the database.
   * @returns list of feedbacks
   */
  static findAll(query?: PageQueryT) {
    const q = preparePageQuery(query);

    const tableName = Feedback.getTableName();
    const countSql = `SELECT COUNT(*) FROM ${tableName}`;
    const pagingSql = `SELECT * FROM ${tableName}
                       ORDER BY ${q.sort} ${q.order}
                       LIMIT ${q.size}
                       OFFSET ${(q.page - 1) * q.size};`;

    //* result: [{"COUNT(*)": 7}]
    //?  N.B it could be `count(*)` in lowercase depending on SQL used
    const [res] = db.prepare<number, string>(countSql).all("");
    const totalItems = Object.values(res)[0];

    const metadata = createMetadata(totalItems, q.page, q.size);
    const data = db.prepare<Feedback, string>(pagingSql).all("");

    return { data, metadata };
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

  // #region findByUserId
  /**
   * Find a feedback by userId
   * @param userId user ID
   * @returns a feedback
   */
  static findByUserId(userId: number) {
    const sql = `SELECT *
			           FROM ${Feedback.getTableName()}
								 WHERE userId = ?;`;
    return db.prepare(sql).get(userId);
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
