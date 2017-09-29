#!/usr/bin/env node
const program = require('commander')
const path = require('path')
const exists = require('fs').existsSync
const shell = require('shelljs')
const inquirer = require('inquirer')
const download = require('download-git-repo')
const ora = require('ora')
const checkVersion = require('./check-version')

function getRepoName (templateName) {
  return `wangdahoo/createmyapp-${templateName || 'express'}`
}

function init (templateName, projectDir) {
  checkVersion(function () {
    shell.mkdir('-p', projectDir)
    const spinner = ora('initializing...').start()
    spinner.color = 'green'
    download(getRepoName(templateName), projectDir, function (err) {
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
  .command('init <template> <dir>')
  .description('init a project from given template.')
  .action(function(template, dir) {
    let projectDir = path.resolve(dir || '.')

    if (exists(projectDir)) {
      inquirer.prompt([{
        type: 'confirm',
        message: 'Target directory exists. Continue?',
        name: 'ok'
      }]).then(function (answers) {
        if (answers.ok) init(template, projectDir)
      })
    } else {
      init(template, projectDir)
    }
  })

program
  .parse(process.argv)
