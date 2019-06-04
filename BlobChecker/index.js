const checkBlobStorage = require('../lib/check-blob-storage')

module.exports = async function (context, req) {
  if (!req.body) {
    context.res = {
      body: 'Where is my body?!',
      status: 400
    }
    return
  }

  try {
    const result = await checkBlobStorage(req.body)

    context.res = {
      body: result,
      status: 200
    }
  } catch (error) {
    context.res = {
      body: error,
      status: 500
    }
  }
}
