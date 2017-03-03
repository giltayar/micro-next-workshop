const fs = require('fs')
const os = require('os')
const path = require('path')
const db = require('./db')

const dbDir = fs.mkdtempSync(path.join(os.tmpdir(), '/people-db-'))

const peopleDb = db(dbDir)

module.exports = async (req, res) => await peopleDb.list()
