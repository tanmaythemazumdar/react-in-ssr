import { config } from '@tini/eslint-config/base'
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended'

/** @type {import("eslint").Linter.Config} */
export default [...config, eslintPluginPrettier]
