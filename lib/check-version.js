const request = require('request')
const semver = require('semver')
const chalk = require('chalk')
const pkg = require('../package.json')

module.exports = function (done) {
  // Ensure minimum supported node version is used
  if (!semver.satisfies(process.version, pkg.engines.node)) {
    return console.log(chalk.red(
      '  You must upgrade node to >=' + pkg.engines.node + '.x to use create-my-app'
    ))
  }

  request({
    url: 'https://registry.npmjs.org/create-my-app',
    timeout: 1000
  }, function (err, res, body) {
    if (!err && res.statusCode === 200) {
      var latestVersion = JSON.parse(body)['dist-tags'].latest
      var localVersion = pkg.version
      if (semver.lt(localVersion, latestVersion)) {
        console.log(chalk.yellow('  A newer version of create-my-app is available.'))
        console.log()
        console.log('  latest:    ' + chalk.green(latestVersion))
        console.log('  installed: ' + chalk.red(localVersion))
        console.log()
      }
    }
    done()
  })
}
