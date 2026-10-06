const { Client } = require('pg');

async function test() {
  const client = new Client({
    host: 'aws-0-ap-northeast-1.pooler.supabase.com',
    port: 6543,
    user: 'postgres.rxvnctprxmjssznqyfkp',
    password: 'velorent64710',
    database: 'postgres'
  });
  
  try {
    await client.connect();
    console.log("SUCCESS");
    await client.end();
  } catch(e) {
    console.log("FAIL:", e.message);
  }
}
test();
