const cassandra = require("cassandra-driver");

const cloud = { secureConnectBundle: "secure-connect-cassandra-db.zip" };
const authProvider = new cassandra.auth.PlainTextAuthProvider(
  "token",
  "AstraCS:gNGtGTIfgqHpnAftbfKiHZZq:21b6a528084078c8933b9fd80288d2bd1e8808755ecbff041b4d40d0e0c8b66f"
);
const client = new cassandra.Client({ cloud, authProvider });

async function run() {
  await client.connect();
  
  // ...

const keyspace = 'default_keyspace';
const v_dimension = 5;

await client.execute(`
  CREATE TABLE IF NOT EXISTS ${keyspace}.vector_test (id INT PRIMARY KEY,
  text TEXT, vector VECTOR<FLOAT,${v_dimension}>);
`);

await client.execute(`
    CREATE CUSTOM INDEX IF NOT EXISTS idx_vector_test
    ON ${keyspace}.vector_test
        (vector) USING 'StorageAttachedIndex' WITH OPTIONS =
        {'similarity_function' : 'cosine'};
`);

// ...

const text_blocks = [
    { id: 1, text: 'Chat bot integrated sneakers that talk to you', vector: [0.1, 0.15, 0.3, 0.12, 0.05] },
    { id: 2, text: 'An AI quilt to help you sleep forever', vector: [0.45, 0.09, 0.01, 0.2, 0.11] },
    { id: 3, text: 'A deep learning display that controls your mood', vector: [0.1, 0.05, 0.08, 0.3, 0.6] },
];

for (let block of text_blocks) {
    const {id, text, vector} = block;
    await client.execute(
        `INSERT INTO ${keyspace}.vector_test (id, text, vector) VALUES (${id}, '${text}', [${vector}])`
    );
}

// ...
// ...

  const ann_query = `
    SELECT id, text, similarity_cosine(vector, [0.15, 0.1, 0.1, 0.35, 0.55]) as sim
    FROM ${keyspace}.vector_test
    ORDER BY vector ANN OF [0.15, 0.1, 0.1, 0.35, 0.55] LIMIT 2
  `;

  const result = await client.execute(ann_query);
  result.rows.forEach(row => {
    console.log(`[${row.id}] "${row.text}" (sim: ${row.sim.toFixed(4)})`);
  });

  await client.shutdown();
}

run();
