import { Client } from "pg";
const DB_URL: any = "postgresql://postgres:1234@localhost:5000/w-10?schema=public";
const db: Client = new Client(DB_URL);
export default db;