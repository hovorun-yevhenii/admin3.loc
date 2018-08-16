module.exports = {
    root: true,
    parserOptions: {
        parser: 'babel-eslint'
    },
    env: {
        browser: true,
    },
    extends: [
        'plugin:vue/essential',
        '@vue/airbnb',
    ],
    // required to lint *.vue files
    plugins: [
        'vue',
    ],
    // add your custom rules here
    rules: {
        'import/first': 'off',
        'no-console': process.env.NODE_ENV === 'production' ? ["error", { allow: ["warn", "error"] }] : 'off',
        'indent': 'off',
        'linebreak-style': 0,
        'max-len': ['error', 100, 2, {
            ignoreUrls: true,
            ignoreComments: true,
            ignoreRegExpLiterals: true,
            ignoreStrings: true,
            ignoreTemplateLiterals: true,
        }],
        'no-trailing-spaces': ['error', {
            skipBlankLines: true,
            ignoreComments: false,
        }],

        "no-underscore-dangle": [2, { "allow": ['_page', '_sort', '_order'] }],

        // don't require .vue extension when importing
        'import/extensions': ['error', 'never'],
        // disallow reassignment of function parameters
        // disallow parameter object manipulation except for specific exclusions
        'no-param-reassign': ['error', {
            props: true,
            ignorePropertyModificationsFor: [
                'state', // for vuex state
                'acc', // for reduce accumulators
                'e' // for e.returnvalue
            ]
        }],
        // allow optionalDependencies
        'import/no-extraneous-dependencies': ['error', {
            optionalDependencies: ['test/unit/index.js']
        }],
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
    }
};