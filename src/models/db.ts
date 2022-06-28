import { createConnection } from "mysql2";

export const dbcon = createConnection({
  host: process.env.DBHOSTNAME || "137.184.235.218",
  user: process.env.DBUSERNAME || "backuser",
  password: process.env.DBPASSWORD || "Ax%wLpTYdxX6370",
  database: process.env.DATABASE || "RFDATA",
});
