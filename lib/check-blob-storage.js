const { logger } = require('@vtfk/logger')

const storage = require('@vtfk/azure-storage-blob')({
  connectionString: process.env.BLOB_URL
})

const container = storage.container(process.env.BLOB_CONTAINER)

module.exports = async function (data) {
  const jsonData = JSON.stringify(data)

  logger('info', ['checkBlobStorage', 'input', jsonData.length])

  let content = null
  let equalContent = false
  try {
    content = await container.read('currentStatus.json')
    logger('info', ['checkBlobStorage', 'blob', content.length])

    equalContent = content === jsonData
  } catch (error) {
    if (!error.toString().includes('Unexpected status code: 404')) {
      throw error
    }
  }

  // Update blob with new data.
  if (!equalContent) {
    try {
      await container.writeText('currentStatus.json', jsonData)
      logger('info', ['checkBlobStorage', 'wrote to blob storage'])
    } catch (error) {
      throw error
    }

    // Return difference between objects
    if (content) {
      const oldData = JSON.parse(content)
      const difference = data.filter(element => {
        const thisElemnt = oldData.filter(f => f.id === element.id)[0]
        if (thisElemnt.data !== element.data) {
          return true
        }
      })

      return difference
    }
  }

  return !equalContent
}
