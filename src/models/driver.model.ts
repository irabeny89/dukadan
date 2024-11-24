import { db } from "../lib/db";
import log from "../lib/logger";
import type { SignupInputT } from "./customer.model";
import type { PageQueryT } from "../types";
import {
  preparePageQuery,
  createMetadata,
  convertValuesToNaira,
} from "../utils";

export class Driver {
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
    return "drivers";
  }

  // #region createTable
  /**
   * Create a table if not on the database.
   */
  static createTable() {
    db.run(`CREATE TABLE IF NOT EXISTS ${Driver.getTableName()} (
						id INTEGER PRIMARY KEY AUTOINCREMENT,
						username TEXT NOT NULL UNIQUE,
						email TEXT NOT NULL UNIQUE,
						password TEXT NOT NULL,
						createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
						updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);`);

    log([
      { value: `\u2705 ${Driver.getTableName()}` },
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
    db.run(`CREATE TRIGGER IF NOT EXISTS ${Driver.getTableName()}_updatedAt_trigger
						AFTER UPDATE ON ${Driver.getTableName()}
						BEGIN
							UPDATE ${Driver.getTableName()}
							SET updatedAt = CURRENT_TIMESTAMP;
						END;`);

    log([
      { value: `\u2705 ${Driver.getTableName()}` },
      { value: "updatedAt trigger created or exists." },
    ]);
  }

  // #region findAll
  /**
   * Finds all records.
   * @returns all records
   */
  static findAll(query?: PageQueryT) {
    const q = preparePageQuery(query);

    const tableName = Driver.getTableName();
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
    const data = db.prepare<Driver, string>(pagingSql).all("");

    return { data, metadata };
  }

  // #region findById
  /**
   * Finds a record by id from the database.
   * @param id record id
   * @returns record instance
   */
  static findById(id: number) {
    return db
      .prepare<Driver, string>(
        `SELECT *
        FROM ${Driver.getTableName()}
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
												FROM ${Driver.getTableName()}
												WHERE email = ?;`;
    const sqlForUsername = `SELECT *
														FROM ${Driver.getTableName()}
														WHERE username = ?;`;

    return opt === "email"
      ? db.prepare<Driver, string>(sqlForEmail).get(value)
      : db.prepare<Driver, string>(sqlForUsername).get(value);
  }

  // #region updateById
  /**
   * Update a record on database.
   * @param id record id
   * @param user fields to update
   * @returns fields updated
   */
  static updateById(id: number, user: Partial<Omit<Driver, "id" | "save">>) {
    const batchUpdate = db.transaction((entries) => {
      for (const [k, v] of entries) {
        const sql = `UPDATE ${Driver.getTableName()}
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
    const sql = `INSERT INTO ${Driver.getTableName()}
								 (username, email, password)
								 VALUES (?, ?, ?);`;

    return db.run(sql, [this.username, this.email, this.password]);
  }
}
