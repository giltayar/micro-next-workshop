const fs = require('fs')
const os = require('os')
const path = require('path')
const micro = require('micro')
const {json} = require('micro')
const dispatch = require('micro-route/dispatch')
const cors = require('micro-cors')
const db = require('./db')
const io = require('socket.io')

const dbDir = fs.mkdtempSync(path.join(os.tmpdir(), '/people-db-'))
const peopleDb = db(dbDir)
const myCors = cors()

module.exports = micro(myCors(dispatch()
  .dispatch('/people', 'GET', async () => await peopleDb.list())
  .dispatch('/people/:id', 'GET', async (req, res, {params}) => (await peopleDb.list())
    .find(p => p.id === params.id))
  .dispatch('/people', 'POST', async (req) => await peopleDb.add(await json(req)))
  .dispatch('/people', 'PUT', async (req) => await peopleDb.update(await json(req)))
  .dispatch('/people/:id', 'DELETE', async (req, res, {params}) => {
    await peopleDb.remove(params.id)

    return {}
  })))

const socketIoApp = io(module.exports)

socketIoApp.on('connection', function (socket) {
  console.log('A user connected')

  socket.on('disconnect', function () {
    console.log('A user disconnected')
  });

});


if (require.main === module) {
  module.exports.listen(process.env.PORT || 3000, () => console.log('listening...'))
}
