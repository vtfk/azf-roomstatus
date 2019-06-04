const mongojs = require('mongojs')
const { logger } = require('@vtfk/logger')

const db = mongojs(process.env.COSMOSDB_URL)
const dbCollectionCurrent = db.collection(process.env.COSMOSDB_COLLECTION_CURRENT)
const dbCollectionLog = db.collection(process.env.COSMOSDB_COLLECTION_LOG)

module.exports = async (data) => {
  data.forEach(element => {
    let roomStatus = {
      sensorId: element.id,
      activity: element.data,
      updatedDate: new Date(element.time * 1000).toISOString(),
      updatedTime: element.time
    }

    const history = roomStatus

    dbCollectionCurrent.findOne({ sensorId: roomStatus.sensorId }, async (err, doc) => {
      if (err) {
        logger('error', ['create-or-update-db', 'findOne', err])
      }

      // Insert to history
      dbCollectionLog.insert(history)
      logger('info', ['create-or-update-db', 'insert', `inserted update for ${history.sensorId} to history`])

      if (doc) {
        // Update existing
        dbCollectionCurrent.update({ _id: mongojs.ObjectId(doc._id) }, roomStatus)
        logger('info', ['create-or-update-db', 'update', `updated ${roomStatus.sensorId}`])
      } else {
        // Create new object
        const namesplit = element.name.split('_')
        roomStatus.displayName = `${namesplit[1]} ${namesplit[0]}`
        roomStatus.visible = true

        dbCollectionCurrent.insert(roomStatus)
        logger('info', ['create-or-update-db', 'insert', `inserted new object: ${roomStatus.sensorId} / ${roomStatus.displayName}`])
      }
    })
  })
}
