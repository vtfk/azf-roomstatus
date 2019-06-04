const storage = require('@vtfk/azure-storage-blob')({
  connectionString: process.env.BLOB_URL
})

const container = storage.container(process.env.BLOB_CONTAINER)

module.exports = async function (context, req) {
  const { data } = req
}
