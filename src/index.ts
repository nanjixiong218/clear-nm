#!/usr/bin/env node
import inquirer from 'inquirer'
import fse from 'fs-extra'
import path from 'path'
import chalk from 'chalk'

const root = process.cwd()
async function run() {
  async function loop(dir) {
    const files = await fse.readdir(dir)
    for(let i = 0; i < files.length ; i++) {
      const currentPath = path.join(dir, files[i])
      const access = await fse.pathExists(currentPath)
      if(!access) {
        continue
      }
      const stats = await fse.stat(currentPath)
      if(stats.isDirectory()) {
        if(currentPath.indexOf('node_modules') !== -1) {
          console.log(chalk.green(`开始删除 ${currentPath}!`))
          await fse.remove(currentPath)
          console.log(chalk.green(`完成删除 ${currentPath}!`))  
          continue
        }
        await loop(currentPath)
      }
    }
  }
  loop(root)
}
run()