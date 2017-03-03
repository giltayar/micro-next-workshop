import pify from 'pify'
import fs from 'fs'
import path from 'path'

let globalId = 0

export default (dir) => ({
  async add(person) {
    await writeDb(await readDb(dir).concat({...person, ...{id: ++globalId}}))
  },

  async remove(personId) {
    await writeDb(await readDb(dir).filter(p => p.id === personId))
  },

  async update(person) {
    await writeDb(await readDb(dir).filter(p => p.id === personId).concat(person))
  },

  async list(person) {
    return sort(await readDb(dir), (left, right) => left.last.localeCompare(right.last))
  }
})

async function readDb(dir) {
  try {
    return JSON.parse(await pify(fs.readFile)(path.join(dir, 'db.json')))
  }
  catch (e) {
    if (e.code === 'ENOENT') {
      return [];
    }
    else {
      throw e;
    }
  }
}

async function writeDb(dir, db) {
  await pify(fs.writeFile)(path.join(dir, 'db.json'), JSON.stringify(db))
}