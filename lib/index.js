#!/usr/bin/env node
const program = require('commander')
const path = require('path')
const exists = require('fs').existsSync
const shell = require('shelljs')
const inquirer = require('inquirer')
const download = require('download-git-repo')
const ora = require('ora')
const checkVersion = require('./check-version')
const request = require('request')
const chalk = require('chalk')
const _ = require('lodash')

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

function getTemplates (done) {
  request({
    url: 'https://raw.githubusercontent.com/wangdahoo/create-my-app/master/lib/templates.json',
    timeout: 1000
  }, function (err, res, body) {
    if (!err && res.statusCode === 200) {
      done(body)
    }
    done(require('./templates.json'))
  })
}

program
  .version(require('../package').version)

program
  .command('list')
  .description('list available templates')
  .action(function () {
    console.log('')
    console.log('  Templates:')
    getTemplates(function (templates) {
      _.each(templates, function (desc, name) {
        console.log('    - ' + chalk.green(name) + ': ' + desc)
      })
    })
    console.log('')
  })

program
  .command('init <template> <dir>')
  .description('init a project from given template.')
  .action(function (template, dir) {
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

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
