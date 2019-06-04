const { logger } = require('@vtfk/logger')

const getSensorData = require('../lib/get-sensor-data')
const checkBlobStorage = require('../lib/check-blob-storage')
const createOrUpdateDB = require('../lib/create-or-update-db')

const sensorOptions = {
  url: process.env.SENSOR_URL,
  user: process.env.SENSOR_USER,
  pass: process.env.SENSOR_PASS
}

module.exports = async function (context, req) {
  context.res = {
    status: 202,
    body: 'Accepted'
  }

  try {
    const sensorData = await getSensorData(context, sensorOptions)
    const updatedData = await checkBlobStorage(sensorData)

    if (updatedData) {
      logger('info', ['sensorPoller', 'update', JSON.stringify(updatedData)])
      createOrUpdateDB(updatedData)
    } else {
      logger('info', ['sensorPoller', 'no updates'])
    }
  } catch (err) {
    logger('error', ['sensorPoller', 'error', err])
  }
}
