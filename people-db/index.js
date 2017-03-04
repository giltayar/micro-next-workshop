const fs = require('fs')
const os = require('os')
const path = require('path')
const {json, send} = require('micro')
const dispatch = require('micro-route/dispatch')
const db = require('./db')

const dbDir = fs.mkdtempSync(path.join(os.tmpdir(), '/people-db-'))

const peopleDb = db(dbDir)

module.exports = dispatch()
  .dispatch('/people', 'GET', async (req, res) => await peopleDb.list())
  .dispatch('/people/:id', 'GET', async (req, res, {params}) => (await peopleDb.list())
    .find(p => p.id === params.id))
  .dispatch('/people', 'POST', async (req, res) => await peopleDb.add(await json(req)))
  .dispatch('/people', 'PUT', async (req, res) => await peopleDb.update(await json(req)))
  .dispatch('/people/:id', 'DELETE', async (req, res, {params}) => {
    await peopleDb.remove(params.id)

    return {}
  })
