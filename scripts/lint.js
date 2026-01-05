const { execSync } = require('child_process')

console.log(`🔍 开始代码检查...\n`)

try {
  /** 1: 运行ESLint修复 */
  console.log(`🛠️  运行 ESLint 自动修复...`)
  execSync('npx eslint . --ext .vue,.js,.ts,.jsx,.tsx --fix --max-warnings=0', {
    stdio: 'inherit',
  })
  /** 2: 运行Prettier格式化 */
  console.log(`🛠️  运行 Prettier 格式化...`)
  execSync('npx prettier --write "**/*.{vue,js,ts,jsx,tsx,json,md,css,scss,less}"', {
    shell: true,
    stdio: 'inherit',
  })
  /** 3: 显示修复的文件 */
  console.log(`📄 修复的文件列表:`)
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' })
    if (status.trim()) {
      console.log('修改的文件：')
      console.log(status)
      console.log('\n💡 请运行: git add . && git commit -m "fix: code style"')
    } else {
      console.log('✅ 没有文件被修改，代码已经很规范了！')
    }
  } catch (error) {
    console.error('ℹ️  不是 Git 仓库，无法显示修改的文件')
  }
  /** 4: 检查剩余的ESLint问题 */
  console.log('\n📋 检查剩余的 ESLint 问题...')
  execSync('npx eslint . --ext .vue,.js,.ts,.jsx,.tsx --max-warnings=0', {
    stdio: 'inherit',
  })
  console.log('\n✅ 所有检查完成！')
} catch (error) {
  console.error(`\n❌ 检查失败，请手动修复错误后重试`)
  process.exit(1)
}
