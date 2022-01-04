#!/usr/bin/env node
import inquirer from 'inquirer'
import fse from 'fs-extra'
import path from 'path'
import chalk from 'chalk'

async function run(dir: string): Promise<boolean> {
  async function loop(dir: string): Promise<boolean> {
    const files: string[] = await fse.readdir(dir)
    for(let i:number = 0; i < files.length ; i++) {
      const currentPath:string = path.join(dir, files[i])
      const access:boolean = await fse.pathExists(currentPath)
      if(!access) {
        continue
      }
      const stats:fse.Stats = await fse.stat(currentPath)
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
    return true
  }
  try {
    let result = await loop(dir)
    return result;
  } catch (error) {
    return false; 
  }
}
export default run;