const pify = require('pify')
const fs = require('fs')
const path = require('path')

let globalId = 0

module.exports = (dir) => ({
  async add(person) {
    await writeDb(await readDb(dir).concat(Object.assign(person, {id: ++globalId})))

    return person
  },

  async remove(personId) {
    await writeDb(await readDb(dir).filter(p => p.id === personId))
  },

  async update(person) {
    await writeDb(await readDb(dir).filter(p => p.id === personId).concat(person))
  },

  async list() {
    return (await readDb(dir)).sort((left, right) => left.last.localeCompare(right.last))
  }
})

async function readDb(dir) {
  try {
    return JSON.parse(await pify(fs.readFile)(path.join(dir, 'db.json')))
  }
  catch (e) {
    if (e.code === 'ENOENT') {
      return []
    }
    else {
      throw e
    }
  }
}

async function writeDb(dir, db) {
  await pify(fs.writeFile)(path.join(dir, 'db.json'), JSON.stringify(db))
}
