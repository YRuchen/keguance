
## 安装
```
  # GitHub
  git clone https://github.com/zouzhibin/vue-admin-perfect.git
  # Gitee
  git clone https://gitee.com/yuanzbz/vue-admin-perfect.git
```

## 分支管理
- master 技术采用 vite + vue3.0 + Typescript + pinia
- vue-admin-simple  简易版本
- vite-vuex vite + vue3.0 + Typescript + vuex
- vue-i18n 语言切换版本
- webpack 技术采用 webpack + vue3.0 + Typescript + vuex
- uniapp uniapp版本 uniapp +vuex +element scss
  ```
  # 本地开发 启动项目
  借助hbuilder工具运行浏览器启动
  ```

## 下载依赖
```
 npm install
 cnpm install
 yarn 
 # npm install 安装失败，请升级 nodejs 到 16 以上，或尝试使用以下命令：
  npm install --registry=https://registry.npm.taobao.org
```
## 运行打包
```
 npm run dev
 npm run build 
```
## eslint+prettier
```
# eslint 检测代码
npm run lint

#prettier 格式化代码
npm run lint:prettier
```

## 文件目录结构
```
vue-admin-perfect
├─ public                 # 静态资源文件（忽略打包）
├─ src
│  ├─ api                 # API 接口管理
│  ├─ assets              # 静态资源文件
│  ├─ components          # 全局组件
│  ├─ config              # 全局配置项
│  ├─ hooks               # 常用 Hooks
│  ├─ language            # 语言国际化
│  ├─ layout              # 框架布局
│  ├─ routers             # 路由管理
│  ├─ store               # pinia store
│  ├─ styles              # 全局样式
│  ├─ utils               # 工具库
│  ├─ views               # 项目所有页面
│  ├─ App.vue             # 入口页面
│  └─ main.ts             # 入口文件
├─ .env                   # vite 常用配置
├─ .env.development       # 开发环境配置
├─ .env.production        # 生产环境配置
├─ .env.test              # 测试环境配置
├─ .eslintignore          # 忽略 Eslint 校验
├─ .eslintrc.cjs           # Eslint 校验配置
├─ .gitignore             # git 提交忽略
├─ .prettierignore        # 忽略 prettier 格式化
├─ .prettierrc.config.js         # prettier 配置
├─ index.html             # 入口 html
├─ yarn.lock      # 依赖包包版本锁
├─ package.json           # 依赖包管理
├─ README.md              # README 介绍
├─ tsconfig.json          # typescript 全局配置
└─ vite.config.ts         # vite 配置
```



