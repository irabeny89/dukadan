import { t } from "elysia";
import { db } from "../lib/db";
import log from "../lib/logger";
import type { IdAndTimestamp, PageQueryT } from "../types";
import {
  preparePageQuery,
  createMetadata,
  convertValuesToNaira,
} from "../utils";

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
  pricePerKg = +(Bun.env.PRICE_PER_KG ?? 1500);
  deliveryFee = +(Bun.env.DELIVERY_FEE ?? 1000);
  maxOwner = +(Bun.env.MAX_OWNER ?? 1);
  maxAdmin = +(Bun.env.MAX_ADMIN ?? 2);
  maxDriver = +(Bun.env.MAX_DRIVER ?? 2);

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
    if (!Setting.findAll().data.length)
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
  static findAll(query?: PageQueryT) {
    const q = preparePageQuery(query);

    const tableName = Setting.getTableName();
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
    const data = db
      .prepare<Setting, string>(pagingSql)
      .all("")
      // convert back to main currency (naira)
      .map(convertValuesToNaira(["pricePerKg", "deliveryFee"]));

    return { data, metadata };
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
