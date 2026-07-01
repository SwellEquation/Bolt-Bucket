import { pool } from './database.js'
import dotenv from 'dotenv'

dotenv.config()

const createTable = async () => {
  const client = await pool.connect()
  try {
    await client.query(`
      DROP TABLE IF EXISTS custom_cars;

      CREATE TABLE custom_cars (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        exterior_color VARCHAR(50) NOT NULL,
        wheel_type VARCHAR(50) NOT NULL,
        interior VARCHAR(50) NOT NULL,
        engine VARCHAR(50) NOT NULL,
        performance_package VARCHAR(50) NOT NULL DEFAULT 'none',
        price INTEGER NOT NULL
      );

      INSERT INTO custom_cars (name, exterior_color, wheel_type, interior, engine, performance_package, price)
      VALUES
        ('Midnight Racer', 'black', 'sport', 'leather', 'v8', 'sport_exhaust', 61500),
        ('Solar Cruiser', 'yellow', 'luxury', 'premium_leather', 'electric', 'none', 65500),
        ('Trail Blazer', 'red', 'offroad', 'cloth', 'v6', 'nitrous', 34000);
    `)
    console.log('✅ Table created and seeded successfully.')
  } catch (err) {
    console.error('❌ Error creating table:', err.message)
  } finally {
    client.release()
    pool.end()
  }
}

createTable()
