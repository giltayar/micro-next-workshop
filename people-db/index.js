const fs = require('fs')
const os = require('os')
const path = require('path')
const {json, send} = require('micro')
const { router, get, put, post, delete: DELETE } = require('microrouter')
const db = require('./db')

const dbDir = fs.mkdtempSync(path.join(os.tmpdir(), '/people-db-'))

const peopleDb = db(dbDir)

module.exports = router(
  get('/people', async (req, res) => await peopleDb.list()),
  get('/people/:id', async (req, res) => await peopleDb.list().find(p => p.id === parseInt(req.param.id))),
  post('/people', async (req, res) => await peopleDb.add(await json(req))),
  put('/people', async (req, res) => await peopleDb.update(await json(req))),
  DELETE('/people/:id', async (req, res) => await peopleDb.remove(req.param.id))
)