module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint/eslint-plugin'],
    extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
    ],
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
        complexity: ['error', 3],
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
            },
        ],
    },
};
