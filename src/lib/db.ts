import { Database } from "bun:sqlite";
import log from "./logger";

const setupDb = () => {
	const file = "db/dukadan.sqlite";
	const db = new Database(file, { create: true, strict: true });

	log({ value: `\u{1F4DA} Database file: ${file}` });

	// enable write ahead log for concurrent writes - performance
	db.exec("PRAGMA journal_mode = WAL;");

	log({ value: "\u26A1 WAL enabled for concurrent writes on database" });

	return db;
};

export const db = setupDb();
