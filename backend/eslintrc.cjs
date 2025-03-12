module.exports = {
    root: true,
    env: {
        node: true,
        es2023: true,
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json",
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:prettier/recommended"
    ],
    plugins: ["@typescript-eslint"],
    rules: {
        "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-floating-promises": "error",
        "@typescript-eslint/restrict-template-expressions": [
            "error",
            { allowAny: false, allowBoolean: false, allowNullish: false, allowNumber: true }
        ],
        "prettier/prettier": [
            "error",
            {
                endOfLine: "auto",
            },
        ],
    },
    ignorePatterns: ["node_modules/", "dist/", "build/", "coverage/"],
};
