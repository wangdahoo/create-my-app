#!/usr/bin/env node
const program = require('commander')
const path = require('path')
const exists = require('fs').existsSync
const shell = require('shelljs')
const inquirer = require('inquirer')
const download = require('download-git-repo')
const ora = require('ora')
const checkVersion = require('./check-version')

function init (projectDir) {
  let defaultTemplateRepo = 'wangdahoo/vuead-template'

  checkVersion(function () {
    shell.mkdir('-p', projectDir)

    const spinner = ora('initializing...').start()
    spinner.color = 'green'
    download(defaultTemplateRepo, projectDir, function (err) {
      if (err) {
        spinner.fail('fail.')
        throw err
      }
      spinner.succeed('done.')
    })
  })
}

program
  .version(require('../package').version)

program
  .command('init <dir>')
  .description('run the given remote command')
  .action(function(dir) {
    let projectDir = path.resolve(dir || '.')

    if (exists(projectDir)) {
      inquirer.prompt([{
        type: 'confirm',
        message: 'Target directory exists. Continue?',
        name: 'ok'
      }]).then(function (answers) {
        if (answers.ok) init(projectDir)
      })
    } else {
      init(projectDir)
    }
  })

program
  .parse(process.argv)
