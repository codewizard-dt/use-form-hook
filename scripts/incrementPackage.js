const fs = require('fs')
const path = require('path')
const packageJson = require('../package.json')

const versionType = {
  "MAJOR": 0,
  "MINOR": 1,
  "PATCH": 2
}
let version = packageJson.version.split('.')

function increment(type = 'PATCH') {
  try {
    if (typeof type === 'string') type = versionType[type]
    if (typeof type !== 'number' || type > 2) throw new Error(`Version type ${type} not valid`)
    version[type] = Number(version[type]) + 1
  } catch (error) {
    console.error(error)
  }
}

increment(process.env.VERSION || "PATCH")

packageJson.version = version.join('.')
const text = JSON.stringify(packageJson, null, 2)

try {
  fs.writeFileSync(path.resolve(__dirname, '../package.json'), text)
} catch (error) {
  console.error(error)
}

