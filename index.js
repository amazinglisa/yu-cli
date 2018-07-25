#!/usr/bin/env node

const program = require('commander')
const downloadRepo = require('download-git-repo')
const inquirer = require('inquirer')
const handlebars = require('handlebars')
const ora = require('ora')
const chalk = require('chalk')
const symbols = require('log-symbols')
var fs  = require('fs')

program.version(require('./package').version, '-v, --version')
.command('init <name>')
.action((name) => {
  if(!fs.existsSync(name)) {
    inquirer.prompt([{
        name: 'name',
        message: '请输入项目名称'
      }, {
        name: 'version',
        message: '请输入项目版本号'
      }, {
        name: 'description',
        message: '请输入项目描述'
      }, {
        name: 'author',
        message: '请输入作者名称'
      }])
      .then((answer) => {
        const spinner = ora('正在下载模板...')
        spinner.start()

        downloadRepo('https://github.com:amazinglisa/vue-webpack4-demo#master', name, {clone: false}, (err) => {
          if(err) {
            spinner.fail()
            console.log(symbols.error, chalk.red(err))
          } else {
            spinner.succeed()
            const fileName = `${name}/package.json`
            const meta = {
              name: answer.name,
              version: answer.version,
              description: answer.description,
              author: answer.author
            }

            if(fs.existsSync(fileName)) {
              const content = fs.readFileSync(fileName).toString()
              const result = handlebars.compile(content)(meta)
              fs.writeFileSync(fileName, result)
            }

            console.log(symbols.success, chalk.green('项目初始化完成'))
          }
        })
      })
  } else {
    // 错误提示项目已存在，避免覆盖原有项目
    console.log(symbols.error, chalk.red('项目已存在'));
  }
})
program.parse(process.argv)
