const { Client } = require("pg");

async function setupDB() {
    const dbClient = new Client({
        connectionString: process.env.POSTGRES_URL
    });   

    await dbClient.connect();
    try {
        await dbClient.query("BEGIN");
        await dbClient.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                userid VARCHAR(255)  UNIQUE NOT NULL,
                nickname VARCHAR(255),
                points FLOAT8 DEFAULT 0,
                created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
        dbClient.query(`
            CREATE TABLE IF NOT EXISTS events (
            id SERIAL PRIMARY KEY,
            userid INT REFERENCES users(id) ON DELETE CASCADE,
            name VARCHAR(100),
            message VARCHAR(255),
            timestamp TIMESTAMPTZ,
            timezone VARCHAR(50)
            );
        `);
        await dbClient.query("COMMIT");
    }
    finally {
        await dbClient.end();
    }
}

setupDB();