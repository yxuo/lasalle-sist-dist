// ESM
const fs = require("fs")
const Fastify = require('fastify');

const fastify = Fastify({
  logger: true
});
const mysql = require('mysql2/promise')

/*
[
{key:true,nome:"id",type:"INT",size:-1},
{key:false,nome:"nome",type:"VARCHAR",size:50}
]
*/

/** @type {mysql.Connection} */
let connection;
mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  // database: process.env.DB_NAME || 'your_database',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}).then((conn) => {
  connection = conn;
}).catch(err => {
  console.error('ERRO AO CONECTAR NO BANCO:', err)
});

const src = __dirname;

fastify.register(require('@fastify/static'), {
  root: src + '/public/',
  prefix: '/',
});

// #region API

fastify.post('/api/table/insert/:database/:table', async (request, reply) => {
  const database = request.params.database;
  const table = request.params.table;
  /**
   * @type {Record<string, (string | number | boolean | Date)>}
   */
  const body = typeof request.body === 'string' ? JSON.parse(request.body) : request.body;
  const fields = body;
  if (fields === undefined || Object.keys(fields).length === 0) {
    reply.status(200).send({
      statusCode: 500,
      status: "Internal Server Error",
      message: "Os campos devem ser preenchidos",
    });
  }

  
  const columns = Object.keys(fields);
  const values = Object.values(fields).map(i => typeof i === 'string' ? `'${i}'` : `${i}`);
  
  const query = `INSERT INTO ${database}.${table} (${columns}) VALUES (${values})`;
  console.log('query: ', query)
  
  const [queryResult,] = await connection.query(query);
  reply.status(200).send({
    statusCode: 200,
    database,
    table,
    result: queryResult
  });
});

fastify.get('/api/table/list/:database', async (request, reply) => {
  const database = request.params.database;
  const [queryResult,] = (await connection.query(`SHOW TABLES IN ${database}`))
  const queryResultFiltered = queryResult.map(i => Object.values(i)[0]);
  reply.status(200).send({
    statusCode: 200,
    result: queryResultFiltered,
  });
});

fastify.get('/api/table/list/:database/:table', async (request, reply) => {
  const database = request.params.database;
  const table = request.params.table;
  const [queryResult,] = await connection.query(`SELECT * FROM ${database}.${table}`);
  reply.status(200).send({
    statusCode: 200,
    table,
    result: queryResult
  });
});

fastify.get('/api/db/list', async (request, reply) => {
  const query = "SHOW DATABASES WHERE `Database` NOT IN " +
    "('mysql', 'performance_schema', 'sys', 'information_schema')";
  console.log("query: ", query);
  const [queryResult,] = await connection.query(query);
  const lista = queryResult.reduce((l, i) => [...l, i.Database], []);
  reply.code(200).send({
    databases: lista,
    columnTypes: ['INT', 'VARCHAR']
  })
});

fastify.get('/api/db/create/:database', async (request, reply) => {
  const nomeBanco = request.params.database;
  console.log(`Nome do banco: ${nomeBanco}`)
  const query = `CREATE DATABASE ${nomeBanco}`;
  console.log("query: ", query);
  await connection.query(query);
});

fastify.get('/api/table/structure/:database/:table', async (request, reply) => {
  const database = request.params.database;
  const table = request.params.table;
  const query = `DESCRIBE ${database}.${table}`;
  console.log("query: ", query);
  const [queryResult,] = await connection.query(query);
  reply.status(200).send({
    statusCode: 200,
    table,
    fields: queryResult
  });
});

fastify.post('/api/table/create/:database/:table', async (request, reply) => {
  /**
   * @type {{
   * fields: {
   *  isPrimaryKey: boolean,
   *  nome: string,
   *  type: string,
   *  size: number,
   * }[]
   * }}
  */
  const body = typeof request.body === 'string' ? JSON.parse(request.body) : request.body;
  const tableName = request.params.table;
  const database = request.params.database;
  const fields = body.fields;
  console.log('\n\n BODY', typeof body, body)
  console.log('\n\n FIELDS', typeof fields, fields)
  /** @type string */
  const queryFields = fields.reduce((l, i) => {
    let fieldStr = `${i.nome} ${i.type}`;
    if (i.size > 0) {
      fieldStr += `(${i.size})`;
    }
    if (i.isPrimaryKey === true) {
      fieldStr += ' PRIMARY KEY'
    }
    return [...l, fieldStr];
  }, []).join(", ");
  const query = `CREATE TABLE ${database}.${tableName} (${queryFields})`;
  console.log("query: ", query);
  const [queryResult,] = await connection.query(query);
  reply.status(200).send({
    statusCode: 200,
    queryResult,
  });
});

// #endregion

// #region App

fastify.get('/', (req, reply) => {
  reply.sendFile('views/create-db.html')
});

fastify.get('/create-table', (request, reply) => {
  reply.sendFile('views/create-table.html')
});

fastify.get('/insert-table', (request, reply) => {
  reply.sendFile('views/insert-table.html')
});

fastify.get('/list-table', (request, reply) => {
  reply.sendFile('views/list-table.html')
});

const start = () => {
  try {
    fastify.listen({ port: 3002 })
  } catch (err) {
    fastify.log.error(err)
  }
}

// #endregion

start()