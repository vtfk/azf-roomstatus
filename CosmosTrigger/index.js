const convertCosmosDocument = require('../lib/convert-cosmos-documents')

module.exports = async function (context, documents) {
  const updates = documents.map(document => {
    let cleanObj = convertCosmosDocument(document.$v)
    delete cleanObj['_id']

    console.log(JSON.stringify(cleanObj, null, 2))

    return cleanObj
  })

  // TODO: push 'updates' to clients via web socket endpoint
}
