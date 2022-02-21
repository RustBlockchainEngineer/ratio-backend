
import { createConnection } from 'mysql2';



export const dbcon = createConnection({
    host: process.env.DBHOSTNAME || "157.245.81.121",
    user: process.env.DBUSERNAME || "serviceone",
    password: process.env.DBPASSWORD || "Aa%%Bb34",
    database: process.env.DATABASE || "RFDATA",
});

