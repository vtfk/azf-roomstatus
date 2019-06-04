const getSensorData = require('../lib/getSensorData')
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

  var sensorData = await getSensorData(context, sensorOptions)
}
