module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    // 语句强制分号结尾
    semi: [2, 'always'],
    // 缩进
    indent: [2, 2],
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // 已声明的变量名称是否允许重新申明，2不允许
    'no-redeclare': 2,
    // 消除未使用的变量，函数和函数的参数
    'no-unused-vars': 0,
    // 强制变量只声明一次
    'one-var': 0,
    // 组件单行属性个数定义
    'vue/max-attributes-per-line': [
      2,
      {
        // 组件代码为一行时，每行最多属性个数
        singleline: 4,
        multiline: {
          max: 2,
          // 不允许属性放在组件定义第一行
          allowFirstLine: false
        }
      }
    ],
    // =>的前/后括号
    'arrow-spacing': [2, { before: true, after: true }],
    // 如果代码块是单行的时候，代码块内部前后需要留一个空格
    'block-spacing': [2, 'always'],
    // 关键字前后空格
    'keyword-spacing': [
      2,
      {
        before: true,
        after: true
      }
    ],
    // 大括号内不允许不必要的空格
    'object-curly-spacing': [
      2,
      'always',
      {
        objectsInObjects: false
      }
    ],
    // 在定义对象或数组时，最后一项不能加逗号
    'comma-dangle': [2, 'never'],
    // 在写逗号时，逗号前面不需要加空格，而逗号后面需要添加空格
    'comma-spacing': [2, { before: false, after: true }],
    // 该规则规定了在对象字面量语法中，key和value之间的空白，冒号前不要空格，冒号后面需要一个空格
    'key-spacing': [
      2,
      {
        beforeColon: false,
        afterColon: true
      }
    ],
    // 构造函数首字母大写
    'new-cap': [
      2,
      {
        newIsCap: true,
        capIsNew: false
      }
    ],
    // 在使用构造函数时候，函数调用的圆括号不能够省略
    'new-parens': 2,
    // 禁止使用Array构造函数
    'no-array-constructor': 2,
    // 定义字符串。使用单引号，警告提醒
    quotes: [1, 'single', {
      avoidEscape: true,
      allowTemplateLiterals: true
    }],
    // 分号前后空格
    'semi-spacing': [2, { before: false, after: true }],
    'space-infix-ops': 2,
    // 一元操作符前后是否需要加空格，单词类操作符需要加，而非单词类操作符不用加
    'space-unary-ops': [2, { words: true, nonwords: false }],
    // 注释符号｀／*｀ ｀／／｀，后面需要留一个空格
    'spaced-comment': [
      2,
      'always',
      {
        markers: [
          'global',
          'globals',
          'eslint',
          'eslint-disable',
          '*package',
          '!',
          ','
        ]
      }
    ]
  }
};
