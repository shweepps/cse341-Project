const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

let db;

const initDb = async (callback) => {
  if (db) return callback(null, db);
  try {
    const client = new MongoClient(process.env.MONGODB_URL);
    await client.connect();
    db = client.db(); // Defaults to the database in the URI
    callback(null, db);
  } catch (err) {
    callback(err);
  }
};

const getDb = () => {
  if (!db) throw Error('Database not initialized');
  return db;
};

module.exports = { initDb, getDb };
