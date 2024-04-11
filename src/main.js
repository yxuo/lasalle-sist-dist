// ESM
const Fastify = require('fastify');
const fs = require('fs')
// import Fastify from 'fastify'
// import fs from 'fs'
// import fastifyStatic from 'fastify-static';

const fastify = Fastify({
  logger: true
})
const views='./src/views/'
const controllers='./src/controllers/'
const context='./src/context/'
const css='./src/css/'

/** create-db */
fastify.get('/', (request, reply) => {
  const file = fs.readFileSync(views+'create-db.html')
  reply
    .code(200)
    .header('Content-Type', 'text/html; charset=utf-8')
    .send(file)
})
fastify.get('/controllers/create-db.js', (request, reply) => {
  const file = fs.readFileSync(controllers +'create-db.js')
  reply
    .code(200)
    .header('Content-Type', 'text/javascript; charset=utf-8')
    .send(file)
})

/** Arquivos principais js */
fastify.get('/context/db.js', (request, reply) => {
  const file = fs.readFileSync(context+'db.js')
  reply
    .code(200)
    .header('Content-Type', 'text/javascript; charset=utf-8')
    .send(file)
})
/** arquivos estáticos principais */
fastify.get('/css/style.css', (request, reply) => {
  const file = fs.readFileSync(css+'style.css')
  reply
    .code(200)
    .header('Content-Type', 'text/css; charset=utf-8')
    .send(file)
})

const start = async () => {
  try {
    await fastify.listen({ port: 3000 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()