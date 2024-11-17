import { t } from "elysia";
import { db } from "../lib/db";
import log from "../lib/logger";
import { IdAndTimestamp } from "../types";

export type SettingT = {
  pricePerKg: number;
  deliveryFee: number;
  maxOwner: number;
  maxAdmin: number;
  maxDriver: number;
};

export const settingSchema = t.Object({
  pricePerKg: t.Optional(t.Number({ minimum: 1 })),
  deliveryFee: t.Optional(t.Number({ minimum: 1 })),
  maxOwner: t.Optional(t.Number({ minimum: 1 })),
  maxAdmin: t.Optional(t.Number({ minimum: 1 })),
  maxDriver: t.Optional(t.Number({ minimum: 1 })),
});

export class Setting {
  readonly id?: number;
  readonly createdAt?: Date | string;
  readonly updatedAt?: Date | string;
  pricePerKg = 1_000_00; // kobo
  deliveryFee = 1_000_00; // kobo
  maxOwner = 1;
  maxAdmin = 2;
  maxDriver = 2;

  /**
   * Returns the name for this model on the database.
   * This can be interpolated in sql queries.
   *
   * @returns table name for this model on the database
   */
  static getTableName() {
    return "settings";
  }

  // #region createTable
  /**
   * Create a table if not on the database.
   */
  static createTable() {
    db.run(`CREATE TABLE IF NOT EXISTS ${Setting.getTableName()} (
						id INTEGER PRIMARY KEY AUTOINCREMENT,
						pricePerKg INTEGER DEFAULT 100000,
						deliveryFee INTEGER DEFAULT 100000,
						maxOwner INTEGER DEFAULT 1,
						maxAdmin INTEGER DEFAULT 2,
						maxDriver INTEGER DEFAULT 2,
						createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
						updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
         	);`);

    log([
      { value: `\u2705 ${Setting.getTableName()}` },
      { value: "table created or exists." },
    ]);

    // insert settings values if not exist
    if (!Setting.findAll().length)
      db.run(
        `INSERT INTO ${Setting.getTableName()}
        (maxOwner) VALUES (1);`,
      );

    log({
      value: `\u2705 default values inserted into ${Setting.getTableName()} table`,
    });
  }

  // #region createUpdatedAtTrigger
  /**
   * Creates a trigger(if not exist) to update the `updatedAt` field whenever a record is edited on the table.
   */
  static createUpdatedAtTrigger() {
    db.run(`CREATE TRIGGER IF NOT EXISTS ${Setting.getTableName()}_updatedAt_trigger
						AFTER UPDATE ON ${Setting.getTableName()}
						BEGIN
    				  UPDATE ${Setting.getTableName()}
    					SET updatedAt = CURRENT_TIMESTAMP;
						END;`);

    log([
      { value: `\u2705 ${Setting.getTableName()}` },
      { value: "updatedAt trigger created or exists." },
    ]);
  }

  // #region findAll
  /**
   * Find all records of settings on the database.
   * @returns list of settings
   */
  static findAll() {
    const sql = `SELECT * FROM ${Setting.getTableName()};`;
    return db
      .prepare<Setting, string>(sql)
      .all("")
      .map((item) => {
        // convert back to main currency (naira)
        item.deliveryFee = item.deliveryFee / 100;
        item.pricePerKg = item.pricePerKg / 100;
        return item;
      });
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
    settings: Partial<Omit<SettingT, keyof IdAndTimestamp>>,
  ) {
    // convert price and fee values to sub unit
    if (settings.pricePerKg) settings.pricePerKg = settings.pricePerKg * 100;
    if (settings.deliveryFee) settings.deliveryFee = settings.deliveryFee * 100;
    const batchUpdate = db.transaction((entries) => {
      for (const [k, v] of entries) {
        const sql = `UPDATE ${Setting.getTableName()}
                     SET ${k} = ?1
                     WHERE id = ?2;`;
        db.run(sql, [v.toString(), id]);
      }
    });

    const entries = Object.entries(settings);
    batchUpdate(entries);

    return entries;
  }
}
