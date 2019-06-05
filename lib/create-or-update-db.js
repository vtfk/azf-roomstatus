const mongoist = require('mongoist')
const { logger } = require('@vtfk/logger')

const db = mongoist(process.env.COSMOSDB_URL)

const dbCollectionCurrent = db.collection(process.env.COSMOSDB_COLLECTION_CURRENT)
const dbCollectionLog = db.collection(process.env.COSMOSDB_COLLECTION_LOG)

module.exports = async (data) => {
  data.forEach(async (element) => {
    let roomStatus = {
      sensorId: element.id,
      activity: element.data,
      updatedDate: new Date(element.time * 1000).toISOString(),
      updatedTime: element.time
    }

    const history = { ...roomStatus }

    try {
      const doc = await dbCollectionCurrent.findOne({ sensorId: roomStatus.sensorId })
      if (doc) {
        // Update existing
        const res = await dbCollectionCurrent.update({ _id: mongoist.ObjectId(doc._id) }, { $set: roomStatus })

        logger('info', ['create-or-update-db', 'update current', 'success', res])
        logger('info', ['create-or-update-db', 'update current', `updated ${roomStatus.sensorId}`])
      } else {
        // Create new object
        const namesplit = element.name.split('_')
        roomStatus.displayName = `${namesplit[1]} ${namesplit[0]}`
        roomStatus.visible = true

        const res = await dbCollectionCurrent.insert(roomStatus)
        logger('info', ['create-or-update-db', 'insert current', `inserted new object: ${roomStatus.sensorId} / ${roomStatus.displayName} with id ${res._id}`])
      }

      // Insert to history
      await dbCollectionLog.insert(history)
        .then(res => logger('info', ['create-or-update-db', 'insert history', `inserted update for ${history.sensorId} to history`]))
        .catch(err => logger('error', ['create-or-update-db', 'insert history', err]))
    } catch (err) {
      logger('error', ['create-or-update-db', err])
    }
  })
}
