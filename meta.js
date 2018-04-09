const path = require('path')
const fs = require('fs')

const {
  sortDependencies,
  installDependencies,
  runLintFix,
  printMessage,
} = require('./utils')
const pkg = require('./package.json')

const templateVersion = pkg.version

const { addTestAnswers } = require('./scenarios')

module.exports = {
  metalsmith: {
    // When running tests for the template, this adds answers for the selected scenario
    before: addTestAnswers
  },
  helpers: {
    if_or(v1, v2, options) {

      if (v1 || v2) {
        return options.fn(this)
      }

      return options.inverse(this)
    },
    template_version() {
      return templateVersion
    },
  },
  
  prompts: {
    name: {
      when: 'isNotTest',
      type: 'string',
      required: true,
      message: 'Project name',
    },
    description: {
      when: 'isNotTest',
      type: 'string',
      required: false,
      message: 'Project description',
      default: 'A Vue.js project',
    },
    author: {
      when: 'isNotTest',
      type: 'string',
      message: 'Author',
    },
    build: {
      when: 'isNotTest',
      type: 'list',
      message: 'Vue build',
      choices: [
        {
          name: 'Runtime + Compiler: recommended for most users',
          value: 'standalone',
          short: 'standalone',
        },
        {
          name:
            'Runtime-only: about 6KB lighter min+gzip, but templates (or any Vue-specific HTML) are ONLY allowed in .vue files - render functions are required elsewhere',
          value: 'runtime',
          short: 'runtime',
        },
      ],
    },
    vuex: {
      when: 'isNotTest',
      type: 'confirm',
      message: 'Use vuex?'
    },
    isMobile: {
      when: 'isNotTest',
      type: 'confirm',
      message: 'Is a mobile project?'
    },
    requestNpm: {
      when: 'isNotTest',
      type: 'list',
      message: 'select the method of request',
      choices: [
        {
          name: 'axios',
          value: 'axios',
          short: 'axios'
        }, {
          name: 'jsonp',
          value: 'jsonp',
          short: 'jsonp'
        }, {
          name: 'axios + jsonp',
          value: 'two',
          short: 'two'
        }
      ]
    },
    keepAlivePage: {
      when: 'isNotTest',
      type: 'confirm',
      message: 'Use keep-alive page?'
    },
    preCss: {
      when: 'isNotTest',
      type: 'list',
      message: 'Select a CSS preprocessor?',
      choices: [
        {
          name: 'Less',
          value: 'less',
          short: 'Less'
        },
        {
          name: 'Scss',
          value: 'scss',
          short: 'Scss'
        },
        {
          name: 'none',
          value: 'none',
          short: 'none'
        }
      ]
    },
    otherConfig: {
      when: 'isNotTest',
      type: 'confirm',
      message: 'select other config ? (lint, test)'
    },
    lint: {
      when: 'isNotTest && otherConfig',
      type: 'confirm',
      message: 'Use ESLint to lint your code?',
    },
    lintConfig: {
      when: 'isNotTest && otherConfig && lint',
      type: 'list',
      message: 'Pick an ESLint preset',
      choices: [
        {
          name: 'Standard (https://github.com/standard/standard)',
          value: 'standard',
          short: 'Standard',
        },
        {
          name: 'Airbnb (https://github.com/airbnb/javascript)',
          value: 'airbnb',
          short: 'Airbnb',
        },
        {
          name: 'none (configure it yourself)',
          value: 'none',
          short: 'none',
        },
      ],
    },
    unit: {
      when: 'isNotTest && otherConfig',
      type: 'confirm',
      message: 'Set up unit tests',
    },
    runner: {
      when: 'isNotTest && otherConfig && unit',
      type: 'list',
      message: 'Pick a test runner',
      choices: [
        {
          name: 'Jest',
          value: 'jest',
          short: 'jest',
        },
        {
          name: 'Karma and Mocha',
          value: 'karma',
          short: 'karma',
        },
        {
          name: 'none (configure it yourself)',
          value: 'noTest',
          short: 'noTest',
        },
      ],
    },
    e2e: {
      when: 'isNotTest && otherConfig',
      type: 'confirm',
      message: 'Setup e2e tests with Nightwatch?',
    },
    autoInstall: {
      when: 'isNotTest',
      type: 'list',
      message:
        'Should we run `npm install` for you after the project has been created? (recommended)',
      choices: [
        {
          name: 'Yes, use NPM',
          value: 'npm',
          short: 'npm',
        },
        {
          name: 'Yes, use Yarn',
          value: 'yarn',
          short: 'yarn',
        },
        {
          name: 'No, I will handle that myself',
          value: false,
          short: 'no',
        },
      ],
    },
  },
  filters: {
    '.eslintrc.js': 'otherConfig && lint',
    '.eslintignore': 'otherConfig && lint',
    'config/test.env.js': 'otherConfig && (unit || e2e)',
    'build/webpack.test.conf.js': "otherConfig && unit && runner === 'karma'",
    'test/unit/**/*': 'otherConfig && unit',
    'test/unit/index.js': "otherConfig && unit && runner === 'karma'",
    'test/unit/jest.conf.js': "otherConfig && unit && runner === 'jest'",
    'test/unit/karma.conf.js': "otherConfig && unit && runner === 'karma'",
    'test/unit/specs/index.js': "otherConfig && unit && runner === 'karma'",
    'test/unit/setup.js': "otherConfig && unit && runner === 'jest'",
    'test/e2e/**/*': 'otherConfig && e2e',
    'src/utils/flexible.js': "isMobile",
    'src/utils/axiosAdapter.js': "requestNpm === 'axios' || requestNpm === 'two'",
    'src/assets/css/variable.less': "isMobile && preCss === 'less'",
    'src/assets/css/variable.scss': "isMobile && preCss === 'scss'",
    'src/store/**/*': 'vuex'
  },
  complete: function(data, { chalk }) {
    const green = chalk.green

    sortDependencies(data, green)

    const cwd = path.join(process.cwd(), data.inPlace ? '' : data.destDirName)

    if (data.autoInstall) {
      installDependencies(cwd, data.autoInstall, green)
        .then(() => {
          return runLintFix(cwd, data, green)
        })
        .then(() => {
          printMessage(data, green)
        })
        .catch(e => {
          console.log(chalk.red('Error:'), e)
        })
    } else {
      printMessage(data, chalk)
    }
  },
}
