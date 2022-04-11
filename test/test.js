'use strict'

const assert = require('assert')
const { spawnSync } = require('child_process')
const fs = require('fs')
const path = require('path')

{
  const inputFiles = fs.readdirSync(path.join(__dirname, 'input'))

  inputFiles.forEach((fileName) => {
    const expected = fs.readFileSync(path.join(__dirname, 'output', `${path.basename(fileName, '.tsv')}.out`))
    const results = spawnSync(process.argv[0], [path.join(__dirname, '..', 'meeting-picker.js'), path.join('test', 'input', fileName)])
    if (results.error) {
      throw results.error
    }
    assert.strictEqual(results.stdout.toString(), expected.toString(), `output for ${fileName} is different than expected`)
  })
}
