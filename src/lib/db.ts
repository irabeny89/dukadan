import { Database } from "bun:sqlite";

const setupDb = () => {
	const file = "db/dukadan.sqlite";
	const db = new Database(file, { create: true, strict: true });
	// enable write ahead log for concurrent writes - performance
	db.exec("PRAGMA journal_mode = WAL;");
	console.log("\u{1F4DA} Database:", file);
	console.log("\u26A1 WAL enabled for concurrent writes on database");

	return db;
};

export const db = setupDb();
