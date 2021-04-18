module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint/eslint-plugin', 'import'],
    extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
    ],
    settings: {
        'import/resolver': {
            node: {
                moduleDirectory: ['node_modules', 'src'],
            },
        },
    },
    root: true,
    env: {
        node: true,
        jest: true,
    },
    ignorePatterns: ['.eslintrc.js'],
    rules: {
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        'no-console': 'error',
        complexity: ['error', 8],
        'default-param-last': ['error'],
        'default-case-last': 'error',
        'consistent-return': ['error', { treatUndefinedAsUnspecified: false }],
        'no-constructor-return': 'error',
        'no-eq-null': 'error',
        'func-style': ['error', 'expression'],
        'no-magic-numbers': [
            'error',
            {
                ignore: [0, 1],
                ignoreArrayIndexes: true,
                ignoreDefaultValues: true,
                detectObjects: false,
            },
        ],
        'import/first': 'error',
        'import/newline-after-import': 'error',
        'newlines-between': 'off',
        'import/no-duplicates': 'error',
        'import/order': 'error',
        'no-absolute-path': 'off',
    },
};
