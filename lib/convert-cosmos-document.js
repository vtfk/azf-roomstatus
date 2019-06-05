module.exports = (dirtyArray) => {
  // Converts dirty array from Cosmos Db trigger to JSON
  dirtyArray = Array.isArray(dirtyArray) ? dirtyArray : [dirtyArray]
  const cleanArray = dirtyArray.map(obj => {
    let newObj = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        newObj[key] = obj[key].$v
      }
    }
    return newObj
  })
  return cleanArray
}

/*
 {
  "sensorId": {
    "$t": 16,
    "$v": 1823
  },
  "activity": {
    "$t": 8,
    "$v": true
  },
  "updatedDate": {
    "$t": 2,
    "$v": "2019-06-05T11:25:22Z"
  },
  "updatedTime": {
    "$t": 16,
    "$v": 1559733922
  },
  "displayName": {
    "$t": 2,
    "$v": "Samtalerom 1411"
  },
  "visible": {
    "$t": 8,
    "$v": true
  },
  "_id": {
    "$t": 7,
    "$v": "\\├À┬ö├ª=┬▓┬øF<w┬ê~"
  }
}

{
  "sensorId": 1823,
  "activity": true,
  ...
}
*/
