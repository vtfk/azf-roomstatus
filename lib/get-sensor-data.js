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

  const { data } = result

  logger('info', `data from ${data.length} sensors received`)

  return data
}
