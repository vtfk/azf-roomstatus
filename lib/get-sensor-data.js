const axios = require('axios')
const { logger } = require('@vtfk/logger')

module.exports = async (context, options) => {
  if (!options || !options.url || !options.user || !options.pass) {
    throw Error('Invalid options!')
  }

  const credentials = Buffer.from(`${options.user}:${options.pass}`, 'utf-8').toString('base64')
  const result = await axios.get(options.url, {
    headers: {
      Authorization: `Basic ${credentials}`
    }
  })

  logger('info', `data from ${result.data.length} sensors received`)

  return result.data
}
