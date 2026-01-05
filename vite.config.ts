import { defineConfig, ConfigEnv, UserConfig, loadEnv } from 'vite'
import path from 'path'
// vite.config.ts中无法使用import.meta.env 所以需要引入
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
// 增加 vue文件 script name值
import vueSetupExtend from 'vite-plugin-vue-setup-extend'
// 生产gz文件
import viteCompression from 'vite-plugin-compression'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import vueJsx from '@vitejs/plugin-vue-jsx'
import qiankun from 'vite-plugin-qiankun'
function resolve(dir) {
  return path.join(__dirname, '.', dir)
}

const MICRO_APP_NAME = 'STARVIEW'
const commonAttrs = {
  changeOrigin: true,
  followRedirects: true,
}
const proxy = {
  /** qiankun */
  [`/${MICRO_APP_NAME}/gateway-observe`]: {
    target: 'https://gateway.observe.dev.eks.gainetics.io',
    rewrite: (path) => path.replace(/^\/STARVIEW\/gateway-observe/, ''),
    ...commonAttrs,
  },
  /** 追踪 */
  [`/${MICRO_APP_NAME}/trace-proxy`]: {
    target: 'https://grafana-chinese.observe.dev.eks.gainetics.io',
    rewrite: (path) => path.replace(/^\/STARVIEW\/trace-proxy/, ''),
    ...commonAttrs,
  }
}

export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {
  const isBuild = command === 'build'
  return {
    base: isBuild ? '/microAppStarview/' : '/',
    plugins: [
      vue(),
      vueJsx(),
      vueSetupExtend(),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      // * 使用 svg 图标
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), 'src/icons/svg')],
        // 指定symbolId格式
        symbolId: 'icon-[dir]-[name]',
      }),
      // gzip压缩 生产环境生成 .gz 文件
      mode === 'production' &&
      viteCompression({
        verbose: true,
        disable: false,
        threshold: 10240,
        algorithm: 'gzip',
        ext: '.gz',
      }),
      qiankun(MICRO_APP_NAME, {
        useDevMode: true,
      }),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "./src/styles/index.scss" as *;`,
          quietDeps: true,
          silenceDeprecations: ['global-builtin', 'mixed-decls', 'import', 'color'],
        },
      },
    },
    logLevel: 'error',
    // 配置别名
    resolve: {
      alias: {
        '@': resolve('src'),
        '~': resolve('src'),
        static: resolve('public/static'),
      },
      // 忽略后缀名的配置选项, 添加 .vue 选项时要记得原本默认忽略的选项也要手动写入
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    },
    //启动服务配置
    server: {
      // 服务器主机名，如果允许外部访问，可设置为 "0.0.0.0" 也可设置成你的ip地址
      host: '0.0.0.0',
      port: Number(loadEnv(mode, process.cwd())?.VITE_PORT),
      open: true,
      https: false,
      cors: true,
      origin: 'http://localhost:8082',
      // 代理跨域（模拟示例）
      proxy,
    },
  }
})
