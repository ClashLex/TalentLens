const { Client } = require('pg');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

client.connect()
  .then(() => client.query('SELECT count(*) FROM candidates'))
  .then(res => {
    console.log(`Candidates count: ${res.rows[0].count}`);
    return client.end();
  })
  .catch(err => {
    console.error('Connection error', err.stack);
  });
