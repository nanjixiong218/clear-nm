#!/usr/bin/env node
import inquirer from 'inquirer'
import fse from 'fs-extra'
import path from 'path'
import chalk from 'chalk'

async function run(dir: string): Promise<boolean> {
  let cnt = 0;
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
          cnt++;
          console.log(chalk.blue(`${cnt}: \n`))
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
    if(cnt == 0) {
      console.log(chalk.red('没有发现 node_modules 目录'))
    } else {
      console.log(chalk.green(`共完成 ${cnt} 个  node_modules 目录的删除 !`))  
    }
    return result;
  } catch (error) {
    return false; 
  }
}
export default run;