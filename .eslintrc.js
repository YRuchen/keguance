module.exports = {
  env: {
    browser: true, // 代码运行在浏览器环境
    es2021: true, // 支持 ES2021 全局变量
    node: true, // 代码运行在 Node.js 环境
  },
  extends: [
    'plugin:vue/vue3-recommended', // Vue3 推荐规则集
    'eslint:recommended', // ESLint 推荐规则集
    'plugin:vue/vue3-essential', // Vue3 必要规则集
    'plugin:@typescript-eslint/recommended', // TypeScript 推荐规则集
    'plugin:prettier/recommended', // 启用 Prettier 推荐配置
  ],
  parser: 'vue-eslint-parser', // 使用 Vue 解析器，解析 .vue 文件
  parserOptions: {
    ecmaVersion: 'latest', // 支持最新 ECMAScript 语法
    parser: '@typescript-eslint/parser', // 使用 TypeScript 解析器
    sourceType: 'module', // 代码使用 ES 模块
    ecmaFeatures: {
      jsx: true, // 支持 JSX 语法
    },
  },
  plugins: ['vue', '@typescript-eslint'], // 启用 Vue 和 TypeScript 插件
  globals: {
    defineProps: 'readonly', // Vue 3 defineProps 全局变量，只读
    defineEmits: 'readonly', // Vue 3 defineEmits 全局变量，只读
  },
  rules: {
    'no-console': 'off', // 允许使用 console
    '@typescript-eslint/no-explicit-any': 'off', // 允许使用 any 类型
    'no-use-before-define': 'off', // 允许在定义前使用变量
    '@typescript-eslint/no-use-before-define': 'off', // TS 允许在定义前使用变量
    '@typescript-eslint/ban-ts-comment': 'off', // 允许使用 @ts-ignore 等注释
    '@typescript-eslint/no-empty-function': ['off'], // 允许空函数
    '@typescript-eslint/no-inferrable-types': 'off', // 允许显式指定可以推断的类型
    '@typescript-eslint/no-namespace': 'off', // 允许自定义 TS 命名空间
    '@typescript-eslint/ban-types': 'off', // 允许使用 TS 内置类型
    'vue/multi-word-component-names': 'off', // 允许单词组件名，不强制多词
    'vue/no-v-html': 'off', // 允许使用 v-html
    'no-undef': 'off', // 允许未声明的变量（可能由 TS 检查）
    'no-redeclare': 'off', // 允许变量重复声明
    'no-self-assign': 'off', // 允许自己赋值给自己
    'no-sparse-arrays': 'off', // 允许稀疏数组
    'vue/valid-v-for': 'off', // 关闭 v-for 校验
    'vue/no-unused-vars': 'off', // 关闭 Vue 未使用变量校验
    'vue/require-v-for-key': 'off', // 关闭 v-for 必须使用 key
    'no-useless-escape': 'off', // 允许不必要的转义字符
    'vue/require-explicit-emits': 'off', // 关闭要求显式定义 emits
    'no-case-declarations': 'off', // 允许 case 内定义变量
    '@typescript-eslint/no-non-null-assertion': 'off', // 允许使用非空断言 !
    'vue/require-prop-types': 'off', // 不要求 prop 必须写类型
    '@typescript-eslint/no-this-alias': 'off', // 允许将 this 赋值给变量
    'no-async-promise-executor': 'off', // 允许在 Promise executor 中使用 async
    'vue/no-template-shadow': 'off', // 允许 template 中变量覆盖外部变量
    'vue/require-default-prop': 'off', // prop 可选时不强制要求默认值
    '@typescript-eslint/no-unused-vars': [
      'off', // 关闭未使用变量检查
      {
        argsIgnorePattern: '^_', // 忽略下划线开头的参数未使用警告
        varsIgnorePattern: '^_', // 忽略下划线开头的变量未使用警告
      },
    ],
  },
  overrides: [
    {
      files: ['scripts/**/*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
}
